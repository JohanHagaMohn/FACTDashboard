const express = require('express');
const router = express.Router();

const mongo = require('../../mongo.js');
const neo4j = require("../../neo4j.js");

const tweetsRouter = require("./tweets.js")(mongo, neo4j)
router.use("/tweets", tweetsRouter)

const usersRouter = require("./users.js")(mongo, neo4j)
router.use("/users", usersRouter)

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

router.get("/followernetwork/retweet", async (req, res, next) => {
  let id = req.query.id
  if (!id) {
    res.send(400).send("Missing requierd argument id")
  }
  let response = await neo4j.getFollowernetworkFromRetweets(id)
  if (response == null) {
    res.status(400).send("Bad id")
    return
  }
  res.send(response)
})

module.exports = router
