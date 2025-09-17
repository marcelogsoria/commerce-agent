import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  BaseCheckpointSaver,
} from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { StructuredTool } from '@langchain/core/tools';

const createCommerceGraph = ({
  tools,
  memory,
}: {
  tools: StructuredTool[];
  memory: BaseCheckpointSaver<number>;
}) => {
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

  return langGraphApp;
};

export { createCommerceGraph };
