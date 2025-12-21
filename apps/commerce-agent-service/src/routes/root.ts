import 'dotenv/config';
import { FastifyPluginAsync } from 'fastify';
import { TwilioMessage } from './types';
import { createCommerceGraph } from '../llmGraphs/commerceGraph';
import { MemorySaver } from '@langchain/langgraph';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { prompt } from '../llmPrompts/agentBasePrompt';
import { getDocumentationTool } from '../llmTools/getDocumentationTool';

const memory = new MemorySaver();

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  const ctTools = fastify.commercetools.getTools();

  const tools = [...ctTools, getDocumentationTool];

  fastify.log.info(
    { tool_names: tools.map((t) => t.name) },
    'Generated Commercetools tools',
  );

  const langGraphApp = createCommerceGraph({ tools, memory });

  fastify.post('/message', async (request, reply) => {
    const body = request.body as TwilioMessage | { message: string };
    let WaId: string;
    let Body: string;
    let isLocalTest = false;

    if ('WaId' in body) {
      WaId = body.WaId;
      Body = body.Body;
    } else {
      WaId = 'local-test-thread';
      Body = body.message;
      isLocalTest = true;
    }

    // Log the start of the request with the user's ID and message.
    fastify.log.info({ WaId, Body }, 'Processing incoming message');

    try {
      const config = { configurable: { thread_id: WaId } };

      // Retrieve previous messages for this conversation thread.
      const messagesSaved = await memory.get(config);

      // Construct the message history, adding the system prompt if it's a new conversation.
      const messages = [
        ...(messagesSaved === undefined ? [new SystemMessage(prompt)] : []),
        new HumanMessage(Body),
      ];

      // Log the messages being sent to the AI graph.
      fastify.log.info({ messages }, 'Invoking AI graph with messages');

      const output = await langGraphApp.invoke({ messages }, config);

      // Log the entire raw output from the graph. This is crucial for debugging
      // as it contains the agent's thoughts and tool calls.
      fastify.log.info({ output }, 'Received output from AI graph');

      // Extract the last message from the output as the response.
      const modelResponse =
        output.messages[output.messages.length - 1].content.toString();

      if (isLocalTest) {
        reply.send({ response: modelResponse });
      } else {
        // Send the response back to the user via Twilio WhatsApp.
        // We prepend 'whatsapp:+' to the WaId to ensure it's in the correct E.164 format.
        const messageResult = await fastify.twilio.messages.create({
          from: fastify.twilioNumber,
          to: `whatsapp:+${WaId}`,
          body: modelResponse,
        });

        fastify.log.info(
          { messageSid: messageResult.sid },
          'Successfully sent response via Twilio',
        );
        reply.send({ status: 'ok' });
      }
    } catch (error) {
      // Enhance error logging to include the original request body for better context.
      fastify.log.error(
        { err: error, requestBody: request.body },
        'An error occurred while processing the message',
      );
      reply.status(500).send({ error: 'Error procesando el mensaje' });
    }
  });
};

export default root;
