const express = require('express');
const router = express.Router();

const mongo = require('../../mongo.js');
const neo4j = require("../../neo4j.js");

const tweetsRouter = require("./tweets.js")(mongo, neo4j)
router.use("/tweets", tweetsRouter)

// Count users in database
router.get("/users/count", async (req, res, next) => {
  res.send({
    count: await mongo.countUsers()
  })
})

router.get("/users/followers", async (req, res, next) => {
  if (!req.query.id) {
    res.status(400).send("This wndpoint requires an id to be specified")
    return
  }

  let response = await neo4j.getFollowers(req.query.id)
  res.send(response)
})

// Followernetwork example
router.get("/followernetwork", async (req, res, next) => {
  const nodes = await neo4j.query('MATCH (n:user) RETURN n')
  const edges = await neo4j.query('MATCH ()-[r:FOLLOW]->() RETURN r')

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

module.exports = router
