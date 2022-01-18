const neo4j = require('neo4j-driver')

// env
const username = process.env.NEO4J_DB_USERNAME;
const password = process.env.NEO4J_DB_PASSWORD;
const uri = process.env.NEO4J_DB_URI

// Connect to neo4j
let driver, session
try {
  driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
  session = driver.session()
} catch (err) {
  console.warn("Failed to connect to Neo4j")
  console.log(err)
}

// Query the neo4j databse
async function query(query, params) {
  return await session.run(query, params)
}

// Find followers of a user
async function getFollowers(id) {
  return await query('MATCH (s:user {id_str: $id_str})<-[r:FOLLOW]-(f:user) RETURN s, r, f', {
    id_str: id
  })
}

async function findRetweets(id) {
  return await query('MATCH (s:tweet {id_str: $id_str})<-[r:retweet]-(t:tweet) RETURN s, r, t', {
    id_str: id
  })
}

module.exports = {
  driver,
  session,
  query,
  getFollowers,
  findRetweets
}
