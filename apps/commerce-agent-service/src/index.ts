import closeWithGrace from 'close-with-grace';
import fastify from 'fastify';
import app, { options } from './app';

// Instantiate Fastify with the options exported from app.ts
const server = fastify(options);

// Register your application logic as a plugin.
void server.register(app);

// Set up graceful shutdown.
// The delay is the number of milliseconds for the graceful close to finish.
const closeListeners = closeWithGrace({ delay: 500 }, async function ({ err }) {
  if (err) {
    server.log.error(err);
  }
  // This will close the fastify server and trigger the onClose hook.
  await server.close();
});

server.addHook('onClose', async (instance) => {
  // This hook is called when server.close() is invoked.
  closeListeners.uninstall();
});

// Start the server.
const start = async () => {
  try {
    await server.listen({
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      host: '0.0.0.0',
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

void start();