const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver')

const data = require("./neo4jTestData/data.json")

// env
const username = process.env.NEO4J_DB_USERNAME;
const password = process.env.NEO4J_DB_PASSWORD;
const uri = process.env.NEO4J_DB_URI

console.log("Connecting to Neo4j")
let driver, session
try {
  driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
  session = driver.session()
} catch (err) {
  console.warn("Failed to connect to Neo4j")
  console.log(err)
}

router.get("/example", async (req, res, next) => {
  res.json(data)
})

router.get("/example2", async (req, res, next) => {
  const result = await session.run('MATCH (n:tweet)-[r:retweet]->() RETURN *')
  res.json(result)
})

router.get("/setup", async (req, res, next) => {
  res.send("hello")
  for (let i = 0; i < data.users.length; i++) {
    const result = await session.run("CREATE (n:tweet {id_str: $id_str, name: $name, screen_name: $screen_name, description: $description, created_at: $created_at}) RETURN n", data.users[i])
  }

  for(let edge of data.edges) {
    const result = await session.run("MATCH (a:tweet {id_str: $source}) MATCH (b:tweet {id_str: $target}) CREATE (a)-[:retweet]->(b)", edge)
  }
})

module.exports = router;
