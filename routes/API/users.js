const express = require('express');
const router = express.Router();

module.exports = (mongo, neo4j) => {

  // Count users in database
  router.get("/count", async (req, res, next) => {
    res.send({
      count: await mongo.countUsers()
    })
  })

  // Get followers of a user
  router.get("/followers", async (req, res, next) => {
    if (!req.query.id) {
      res.status(400).send("This endpoint requires an id to be specified")
      return
    }

    let response = await neo4j.getFollowers(req.query.id)
    res.send(response)
  })

  router.get("/get", async (req, res, next) => {
    let query = {}

    if (req.query.id) {
      query = {
        "id_str": {
          "$eq": req.query.id
        }
      }
    }

    const response = await mongo.getUser(query)

    if(response == null) {
      res.status(404).send("Not Found")
    } else {
      res.send(response)
    }
  })

  router.get("/random", async (req, res, next) => {
    const response = await mongo.getRandomUser(req.query.n | 1)
    res.send(response)
  })

  router.get("/getFromTweet", async (req, res, next) => {
    if (!req.query.id) {
      res.status(400).send("Missing requierd argument, id")
      return
    }
    const response = await neo4j.getUserFromTweet(req.query.id)
    if(response == null) {
      res.status(404).send("Not Found")
    } else {
      res.send(response)
    }
  })

  return router
}
