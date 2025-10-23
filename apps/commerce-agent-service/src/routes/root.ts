import 'dotenv/config';
import { FastifyPluginAsync } from 'fastify';
import { TwilioMessage } from './types';
import { createCommerceGraph } from '../llmGraphs/commerceGraph';
import { MemorySaver } from '@langchain/langgraph';
import { CommercetoolsAgentEssentials } from '@commercetools/agent-essentials/langchain';
import twilio from 'twilio';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { prompt } from '../llmPrompts/agentBasePrompt';
import { getDocumentationTool } from '../llmTools/getDocumentationTool';

// --- Environment Variable Validation ---
// Ensure all required Twilio environment variables are set.
// The application will throw an error on startup if any are missing.
const {
  TWILIO_ACCOUNT_SID: accountSid,
  TWILIO_AUTH_TOKEN: authToken,
  TWILIO_NUMBER: twilioNumber,
} = process.env;

if (!accountSid || !authToken || !twilioNumber) {
  throw new Error('Twilio environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER) must be set.');
}

// Create a Twilio client with the validated credentials.
const twilioClient = twilio(accountSid, authToken);

const memory = new MemorySaver();

// Configure the Commercetools Agent Essentials toolkit.
// This will be our single source for all Commercetools-related tools.
const commercetoolsAgentEssentials = new CommercetoolsAgentEssentials({
  authConfig: {
    type: 'client_credentials',
    clientId: process.env.CT_CLIENT_ID!,
    clientSecret: process.env.CT_CLIENT_SECRET!,
    projectKey: process.env.CT_PROJECT_KEY!,
    authUrl: process.env.CT_AUTH_URL!,
    apiUrl: process.env.CT_API_URL!,
  },
  configuration: {
    // Define which actions the agent is allowed to perform.
    // This provides a great layer of security and control.
    actions: {
      products: { read: true },
      category: { read: true },
      cart: { read: true, create: true, update: true },
      project: { read: true },
    },
  },
});

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { root: true };
  });

  fastify.post('/message', async (request, reply) => {
    const { Body, WaId } = request.body as TwilioMessage;
    // Log the start of the request with the user's ID and message.
    fastify.log.info({ WaId, Body }, 'Processing incoming message');

    try {
      // Get the array of tools from the Commercetools agent essentials toolkit.
      const ctTools = commercetoolsAgentEssentials.getTools();

      // Add the documentation tool to the list of available tools.
      const tools = [...ctTools, getDocumentationTool];

      // Log the names of the tools to confirm they were created successfully.
      fastify.log.info({ tool_names: tools.map((t) => t.name) }, 'Generated Commercetools tools');

      const langGraphApp = createCommerceGraph({ tools, memory });

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

      // Send the response back to the user via Twilio WhatsApp.
      // We prepend 'whatsapp:+' to the WaId to ensure it's in the correct E.164 format.
      const messageResult = await twilioClient.messages.create({
        from: twilioNumber,
        to: `whatsapp:+${WaId}`,
        body: modelResponse,
      });

      fastify.log.info({ messageSid: messageResult.sid }, 'Successfully sent response via Twilio');
    } catch (error) {
      // Enhance error logging to include the original request body for better context.
      fastify.log.error({ err: error, requestBody: request.body }, 'An error occurred while processing the message');
      reply.status(500).send({ error: 'Error procesando el mensaje' });
    }
  });
};

export default root;
