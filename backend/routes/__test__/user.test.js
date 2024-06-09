const server = require("../../app.js");
const supertest = require("supertest");
const neo4jDriver = require("neo4j-driver");
const jwt = require("jsonwebtoken");
const { auth } = require("express-oauth2-jwt-bearer");

jest.mock("express-oauth2-jwt-bearer", () => ({
  auth: jest.fn((options) => (req, res, next) => {
    next();
  }),
}));

jest.mock("neo4j-driver", () => ({
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
}));

jest.mock("../../db/db_connect", () => ({
  runQuery: jest.fn((query) => {
    switch (query) {
      case "RETURN 1":
        return Promise.resolve({
          records: [{ _fields: ["result1"] }],
        });
      case "SHOW CONSTRAINTS":
        return Promise.resolve({
          records: [{ _fields: ["unique_user"] }],
        });
      case `MATCH (n:user WHERE n.email = 'jan.kowalksi@example.pl' ) RETURN n`:
        return Promise.resolve({
          records: [{ _fields: [] }],
        });

      default:
        return Promise.resolve({
          records: [
            {
              get: (key) => {
                if (key === "n") {
                  return {};
                }
                return null;
              },
              _fields: {},
            },
          ],
        });
    }
  }),
}));

afterAll(async () => {
  server.close();
});

describe("user", () => {
  it("getUser", async () => {
    const res = await supertest(server)
      .get("/api/user/jan.kowalksi@example.pl")
      .trustLocalhost(true)
      .set("Authorization", "Bearer valid_token");

    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toBeDefined();
  });

  it("change", async () => {
    const res = await supertest(server)
      .put("/api/user/change")
      .send({ email: "jan.kowalksi@example.pl", data: { picture: "example.png", nickname: "janek", name: "jan" } })
      .trustLocalhost(true)
      .set("Authorization", "Bearer valid_token");
    console.log(res.error);
    expect(res.statusCode).toEqual(200);
  });

  it("stats", async () => {
    const res = await supertest(server)
      .get("/api/user/stats/jan.kowalksi@example.pl")
      .trustLocalhost(true)
      .set("Authorization", "Bearer valid_token");
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.values).toBeDefined();
  });
});
