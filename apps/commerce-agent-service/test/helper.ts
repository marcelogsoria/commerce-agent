// This file contains code that we reuse between our tests.
import Fastify from 'fastify'
import fp from 'fastify-plugin'
import App from '../src/app'

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {}
}

// Automatically build and tear down our instance
async function build () {
  const fastify = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  void fastify.register(fp(App), config())

  await fastify.ready()

  return fastify
}

export {
  config,
  build
}

