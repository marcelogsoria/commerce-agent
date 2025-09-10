import fastify from 'fastify';
import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from '@langchain/langgraph';
import { tool } from '@langchain/core/tools';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';
import { ctApiRoot } from '../commercetools/apiRoot';
import prompt from './prompt';
import twilio from 'twilio';
import { Cart } from '@commercetools/platform-sdk';

// Your Account SID and Auth Token from twilio.com/console
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token
const twilioNumber = process.env.TWILIO_NUMBER; // Your Twilio number

// Create a Twilio client
const twilioClient = twilio(accountSid, authToken);

const memory = new MemorySaver();

console.log('process.env', process.env);

interface TwilioMessage {
  Body: string;
  WaId: string;
}

// TODO: Continue splitting this among the handler, llmModel and llmGraph

app.post('/message', async (request, reply) => {
  try {
    const { Body, WaId } = request.body as TwilioMessage;

    // TODO: Get tools by parameter
    const tools = [
      getCategories,
      getCart,
      getProductsFromCategory,
      addProductToCart,
    ];

    const llm = new ChatOpenAI({ model: 'gpt-4o-mini' }).bindTools(tools);

    const callModel = async (state: typeof MessagesAnnotation.State) => {
      const response = await llm.invoke(state.messages);
      return { messages: response };
    };

    const toolNode = new ToolNode(tools);

    const shouldContinue = (state: typeof MessagesAnnotation.State) => {
      const { messages } = state;
      const lastMessage = messages[messages.length - 1];
      if (
        'tool_calls' in lastMessage &&
        Array.isArray(lastMessage.tool_calls) &&
        lastMessage.tool_calls?.length
      ) {
        return 'tools';
      }
      return END;
    };

    const workflow = new StateGraph(MessagesAnnotation)
      // Define the node and edge
      .addNode('model', callModel)
      .addNode('tools', toolNode)
      .addEdge(START, 'model')
      .addEdge('tools', 'model')
      .addConditionalEdges('model', shouldContinue, ['tools', END]);

    const langGraphApp = workflow.compile({ checkpointer: memory });

    const config = { configurable: { thread_id: WaId } };

    const messagesSaved = await memory.get(config);

    const messages = [
      ...(messagesSaved === undefined ? [new SystemMessage(prompt)] : []),
      new HumanMessage(Body),
    ];

    /*     console.log('messages', messages); */
    const output = await langGraphApp.invoke({ messages }, config);
    /*     console.log('output', output); */

    const modelResponse = output.messages[output.messages.length - 1].content;

    const messageResult = await twilioClient.messages.create({
      from: twilioNumber,
      to: `whatsapp:${WaId}`,
      body: modelResponse,
    });
  } catch (error) {
    app.log.error(error);
    reply.status(500).send({ error: 'Error procesando el mensaje' });
  }
});
