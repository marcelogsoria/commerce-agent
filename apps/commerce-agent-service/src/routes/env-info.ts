import { FastifyPluginAsync } from 'fastify';
import { version as coreVersion } from '@langchain/core/package.json';
import { version as langgraphVersion } from '@langchain/langgraph/package.json';
import { version as openaiVersion } from '@langchain/openai/package.json';

const envInfo: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/env-info', async function () {
    return {
      twilioNumber: fastify.twilioNumber,
      commercetoolsProjectKey: process.env.CT_PROJECT_KEY,
      nodeVersion: process.version,
      langchain: {
        core: coreVersion,
        langgraph: langgraphVersion,
        openai: openaiVersion,
      },
      accountSid: fastify.twilioAccountSid,
      clientId: process.env.CT_CLIENT_ID,
    };
  });
};

export default envInfo;
