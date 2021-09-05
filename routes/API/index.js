const express = require('express');
const router = express.Router();

const mongo = require('../../mongo.js');
const neo4j = require("../../neo4j.js");

// Count tweets in database
router.get("/tweets/count", async (req, res, next) => {
  res.send({
    count: await mongo.countTweets()
  })
})

// Count users in database
router.get("/users/count", async (req, res, next) => {
  res.send({
    count: await mongo.countUsers()
  })
})

// Count tweets in database by date
router.get("/tweets/count/date", async (req, res, next) => {
  function monthFromNum(m) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[parseInt(m) - 1]
  }

  function getRegexFromDate(d, m, y) {
    return new RegExp(/\w{3} /.source + monthFromNum(m) + / /.source + d + / ([0-9]{2}:){2}[0-9]{2} \+[0-9]{4} /.source + y)
  }

  // Validate request

  if (!(req.query.d
    && req.query.d.match(/^[0-9]{1,2}$/)
    && req.query.m
    && req.query.m.match(/^[0-9]{1,2}$/)
    && req.query.y
    && req.query.y.match(/^[0-9]{4}$/)
  )) {
    res.status(400).send({
      status: 400,
      msg: "Bad Request.  This api needs a d, m and y parameter.  They should be a string where d and m contains one or two numbers and y contains four numbers."
    })
    return;
  }

  let regexDate = getRegexFromDate(req.query.d, req.query.m, req.query.y)

  let count = await mongo.countTweets({
    "created_at": {
      $regex: regexDate
    }
  });

  res.send({
    count
  })
})

// Get a tweet
router.get("/tweets/get", async (req, res, next) => {
  const response = await mongo.getTweet({
  }, {
    skip: req.query.skip | 0
  })

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
