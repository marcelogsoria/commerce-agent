import { FastifyPluginAsync } from 'fastify';

const chat: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // This plugin is now empty as the static files are served by the @fastify/static plugin.
  // The chat interface is available at /public/index.html
};

export default chat;