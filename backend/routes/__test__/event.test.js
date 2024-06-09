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
            },
          ],
        });
    }
  }),
}));

afterAll(() => {
  server.close();
});

describe("/", () => {
  it("get_event", async () => {
    const res = await supertest(server)
      .get("/api/event/get_event/1/jan.kowalksi@example.pl")
      .trustLocalhost(true)
      .set("Authorization", "Bearer valid_token");

    expect(res.statusCode).toEqual(200);
  });

  it("edit", async () => {
    const res = await supertest(server)
      .put("/api/event/edit")
      .trustLocalhost(true)
      .set("Authorization", "Bearer valid_token")
      .send({ id: 1, data: {} });

    expect(res.statusCode).toEqual(200);
  });

  it("editErrorNodata", async () => {
    const res = await supertest(server)
      .put("/api/event/edit")
      .trustLocalhost(true)
      .set("Authorization", "Bearer valid_token");
    //   .send({ id: 1, data: {} });

    expect(res.statusCode).toEqual(500);
  });

  it("delete", async () => {
    const res = await supertest(server)
      .delete("/api/event/1")
      .trustLocalhost(true)
      .set("Authorization", "Bearer valid_token");

    expect(res.statusCode).toEqual(200);
  });

  it("getByName", async () => {
    const res = await supertest(server)
      .get("/api/event/getByName/wydarzenie")
      .trustLocalhost(true)
      .set("Authorization", "Bearer valid_token");

    expect(res.statusCode).toEqual(200);
  });

  it("takePart", async () => {
    const res = await supertest(server)
      .delete("/api/event/1")
      .trustLocalhost(true)
      .set("Authorization", "Bearer valid_token");

    expect(res.statusCode).toEqual(200);
  });
});
