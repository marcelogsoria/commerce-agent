import Fastify from 'fastify';
import Support from '../../src/plugins/support';

describe('support works standalone', () => {
  it('should return "hugs"', async () => {
    const fastify = Fastify();
    void fastify.register(Support);
    await fastify.ready();
    expect(fastify.someSupport()).toEqual('hugs');
  });
});
