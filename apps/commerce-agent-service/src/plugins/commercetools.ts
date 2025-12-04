import 'dotenv/config';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { CommercetoolsAgentEssentials } from '@commercetools/agent-essentials/langchain';

// --- Commercetools Agent Essentials Initialization ---
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
    actions: {
      products: { read: true },
      category: { read: true },
      cart: { read: true, create: true, update: true },
      project: { read: true },
    },
  },
});

// --- Type Augmentation ---
declare module 'fastify' {
  interface FastifyInstance {
    commercetools: CommercetoolsAgentEssentials;
  }
}

// --- Plugin ---
const commercetoolsPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.decorate('commercetools', commercetoolsAgentEssentials);
});

export default commercetoolsPlugin;
