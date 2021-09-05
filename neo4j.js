const neo4j = require('neo4j-driver')

// env
const username = process.env.NEO4J_DB_USERNAME;
const password = process.env.NEO4J_DB_PASSWORD;
const uri = process.env.NEO4J_DB_URI

let driver, session
try {
  driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
  session = driver.session()
} catch (err) {
  console.warn("Failed to connect to Neo4j")
  console.log(err)
}

async function query(query, params) {
  return await session.run(query, params)
}

module.exports = {
  driver,
  session,
  query
}
