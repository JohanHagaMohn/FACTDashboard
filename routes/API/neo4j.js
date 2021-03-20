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
  const nodes = await session.run('MATCH (n:tweet) RETURN n')
  const edges = await session.run('MATCH ()-[r:retweet]->() RETURN r')

  let retNodes = []
  for (let node of nodes.records) {
    retNodes.push(node._fields[0])
  }

  let retEdges = []
  for (let node of edges.records) {
    retEdges.push(node._fields[0])
  }

  res.json({
    src: "738326833431732225",
    nodes: retNodes,
    edges: retEdges
  })
})

const neo4jDataToInsert = require('./neo4jTestData/out.json');

router.get("/setup", async (req, res, next) => {
  for (user of neo4jDataToInsert.users) {

    if (!user.status) {
      user.status = {
        full_text: "No tweet",
        created_at: "No tweet"
      }
    }

    const result = await session.run("CREATE (n:tweet {id_str: $id_str, name: $name, screen_name: $screen_name, full_text: $full_text, created_at: $created_at}) RETURN n", {
      name: user.name,
      screen_name: user.screen_name,
      id_str: user.id_str,
      full_text: user.status.full_text,
      created_at: user.status.created_at
    })
  }

  for(let edge of neo4jDataToInsert.edges) {
    const result = await session.run("MATCH (a:tweet {id_str: $source}) MATCH (b:tweet {id_str: $target}) CREATE (a)-[:retweet]->(b)", edge)
  }
  res.send("finished")
})

module.exports = router;
