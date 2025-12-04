import { build } from '../helper'
import { FastifyInstance } from 'fastify'

describe('default root route', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return the chat interface', async () => {
    const res = await app.inject({
      url: '/'
    })
    expect(res.payload).toContain('<title>Commerce Agent - Local Test</title>')
  })
})
