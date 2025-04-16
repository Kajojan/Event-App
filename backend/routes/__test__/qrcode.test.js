const server = require('../../app.js')
const supertest = require('supertest')

jest.mock('express-oauth2-jwt-bearer', () => ({
  auth: jest.fn((_options) => (req, res, next) => {
    next()
  }),
}))

jest.mock('neo4j-driver', () => ({
  driver: jest.fn().mockReturnValue({
    session: jest.fn().mockReturnValue({
      run: jest.fn(),
      close: jest.fn(),
    }),

    close: jest.fn(),
  }),
  auth: {
    basic: jest.fn().mockReturnValue({}),
  },
}))

jest.mock('../../db/db_connect', () => ({
  runQuery: jest.fn((query) => {
    switch (query) {
    case 'RETURN 1':
      return Promise.resolve({
        records: [{ _fields: ['result1'] }],
      })

    case 'SHOW CONSTRAINTS':
      return Promise.resolve({
        records: [{ _fields: ['unique_user'] }],
      })

    default:
      return Promise.resolve({
        records: [
          {
            get: (key) => {
              if (key === 'n') {
                return {}
              }
              return null
            },
          },
        ],
      })
    }
  }),
}))

afterAll(async () => {
  server.close()
})

describe('/', () => {
  it('qr', async () => {
    const res = await supertest(server)
      .get('/api/qr/')
      .query({ data: { email: 'jan.kowalksi@example.pl', name: 'Jan', event: 'wydarzenie1', seat: 1 } })
      .trustLocalhost(true)
      .set('Authorization', 'Bearer valid_token')

    expect(res.statusCode).toEqual(200)
    expect(res.body.qrCodeBase64).toBeDefined()
  })
})
