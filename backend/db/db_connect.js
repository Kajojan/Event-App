const neo4j = require('neo4j-driver')
require('dotenv').config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env'
})
const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD))
async function runQuery(query, params = {}) {
  const session = driver.session()
  try {
    const result = await session.run(query, params)
    return result
  } finally {
    await session.close()
  }
}

module.exports = {
  driver,
  runQuery,
}
