const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver')

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

router.get("/tweetSpread", async (req, res, next) => {
  const result = await session.run('MATCH (u:user {id_str: $id_str}) CALL apoc.path.subgraphAll(u, {relationshipFilter: "FOLLOW", nodeFiler: "user"}) YIELD nodes, relationships RETURN nodes, relationships;', {
    id_str: res.query.id_str
  })

  res.send(result)
})

router.get("/example2", async (req, res, next) => {
  const nodes = await session.run('MATCH (n:user) RETURN n')
  const edges = await session.run('MATCH ()-[r:FOLLOW]->() RETURN r')

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

module.exports = router;
