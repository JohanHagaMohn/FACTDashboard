const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver')

//const data = require("./neo4jTestData/data.json")

// env
const username = process.env.NEO4J_DB_USERNAME;
const password = process.env.NEO4J_DB_PASSWORD;
const uri = process.env.NEO4J_DB_URI

console.log("Connecting to Neo4j")
try {
  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
  const session = driver.session()
} catch (err) {
  console.warn("Failed to connect to Neo4j")
  console.log(err)
}

router.get("/example", async (req, res, next) => {
  const result = await session.run('MATCH (n) RETURN n')
  console.log(result)
  res.json(result)
})

module.exports = router;
