import { build } from '../helper';
import { FastifyInstance } from 'fastify';

jest.mock('../../src/llmGraphs/commerceGraph', () => ({
  createCommerceGraph: jest.fn(() => ({
    invoke: jest.fn().mockResolvedValue({
      messages: [{ content: 'mocked response' }],
    }),
  })),
}));

describe('default root route', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a mocked response from the AI', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/message',
      payload: {
        message: 'hello',
      },
    });
    expect(res.json()).toEqual({ response: 'mocked response' });
  });
});
