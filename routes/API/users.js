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

  return router
}
