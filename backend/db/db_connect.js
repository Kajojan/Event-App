const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(
  `bolt://${process.env.PORT_DB}`,
  // neo4j.auth.basic(process.env.USERNAME_DB, process.env.PASS_DB)
  neo4j.auth.none()
);
async function runQuery(query, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result;
  } finally {
    await session.close();
  }
}

module.exports = {
  driver,
  runQuery,
};
