const server = require('../../app.js')
const supertest = require('supertest')

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
    case 'create_user':
      return Promise.resolve({
        records: [
          {
            get: (key) => {
              if (key === 'n') {
                return {
                  id: '123',
                  name: 'Test User',
                  email: 'testuser@example.com',
                }
              }
              return null
            },
          },
        ],
      })
    default:
      return Promise.resolve({
        records: [
          {
            get: (key) => {
              if (key === 'n') {
                return { name: 'jan', email: 'jan.kowalksi@example.pl', picture: 'example.png', nickname: 'janek' }
              }
              return null
            },
          },
        ],
      })
    }
  }),
}))

afterAll(() => {
  server.close()
})

describe('/', () => {
  it('Correctregister', async () => {
    const res = await supertest(server)
      .post('/register')
      .trustLocalhost(true)
      .send({ name: 'jan', email: 'jan.kowalksi@example.pl', picture: 'example.png', nickname: 'janek' })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toEqual({
      user: { email: 'jan.kowalksi@example.pl', name: 'jan', nickname: 'janek', picture: 'example.png' },
    })
  })

  it('NotAuthUser', async () => {
    const res = await supertest(server).get('/api/user/jan.kowalksi@example.pl').trustLocalhost(true)
    expect(res.statusCode).toEqual(401)
  })
})
