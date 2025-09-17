import 'dotenv/config';
import { FastifyPluginAsync } from 'fastify';
import { TwilioMessage } from './types';
import { addProductToCartTool } from '../llmTools/addProductToCartTool';
import { getCategoriesTool } from '../llmTools/getCategoriesTool';
import { createGetCartTool } from '../llmTools/getCartTool';
import { getProductsFromCategoryTool } from '../llmTools/getProductsFromCategoryTool';
import { createCommerceGraph } from '../llmGraphs/commerceGraph';
import { MemorySaver } from '@langchain/langgraph';
import twilio from 'twilio';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { prompt } from '../llmPrompts/agentBasePrompt';

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token
const twilioNumber = process.env.TWILIO_NUMBER; // Your Twilio number

// Create a Twilio client
const twilioClient = twilio(accountSid, authToken);

const memory = new MemorySaver();

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { root: true };
  });

  fastify.post('/message', async (request, reply) => {
    try {
      const { Body, WaId } = request.body as TwilioMessage;

      const getCartTool = createGetCartTool({ WaId });

      // TODO: Create tools
      const tools = [
        getCategoriesTool,
        getCartTool,
        getProductsFromCategoryTool,
        addProductToCartTool,
      ];

      // TODO: Create graph
      const langGraphApp = createCommerceGraph({ tools, memory });

      // TODO: Get tools by parameter

      const config = { configurable: { thread_id: WaId } };

      const messagesSaved = await memory.get(config);

      const messages = [
        ...(messagesSaved === undefined ? [new SystemMessage(prompt)] : []),
        new HumanMessage(Body),
      ];

      /*     console.log('messages', messages); */
      const output = await langGraphApp.invoke({ messages }, config);
      /*     console.log('output', output); */

      const modelResponse =
        output.messages[output.messages.length - 1].content.toString();

      const messageResult = await twilioClient.messages.create({
        from: twilioNumber,
        to: `whatsapp:${WaId}`,
        body: modelResponse,
      });

      console.log('Twilio messageResult', messageResult);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Error procesando el mensaje' });
    }
  });
};

export default root;
