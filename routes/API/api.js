const express = require('express');
const router = express.Router()

const neo4j = require('./neo4j2');
let mongo = null;
require('./mongo2')(m => {
  mongo = m
})

// Get follower network
router.get("/followerNetwork", async (req, res, next) => {
  const result = await neo4j.session.run('MATCH (u:user {id_str: $id_str}) CALL apoc.path.subgraphAll(u, {relationshipFilter: "FOLLOW", nodeFiler: "user"}) YIELD nodes, relationships RETURN nodes, relationships;', {
    id_str: req.query.id_str
  })

  res.send(result)
})

// Get user info
const twitterUserExample = require("./exampleUser.json")
router.get("/user/info", async (req, res, next) => {
  //const result = await mongo.userCol.findOne({})
  //res.send(result)

  res.send(twitterUserExample)
})

// Count the stored tweets
router.get("/tweets/count", async (req, res, next) => {
  const result = await mongo.tweetCol.countDocuments({})
  res.send({count: result})
})

function monthFromNum(m) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months[parseInt(m) - 1]
}

function getRegexFromDate(d, m, y) {
  return new RegExp(/\w{3} /.source + monthFromNum(m) + / /.source + d + / ([0-9]{2}:){2}[0-9]{2} \+[0-9]{4} /.source + y)
}

router.get("/tweets/count/date", async (req, res, next) => {
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

  mongo.tweetCol.countDocuments({
    "created_at": {
      $regex: regexDate
    }
  }, (err, r) => {
    if (err) {
      console.log(err)
      res.status(500).send(err)
    } else {
      res.send({ count: r })
    }
  })
})

module.exports = router
