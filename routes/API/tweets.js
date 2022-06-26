const express = require('express');
const router = express.Router();

// TODO
// Finish the get tweets in a week

module.exports = (mongo, neo4j) => {

  // Count tweets in database
  router.get("/count", async (req, res, next) => {
    res.send({
      count: await mongo.countTweets()
    })
  })

  // Get a tweet
  router.get("/get", async (req, res, next) => {
    let query = {}

    if (req.query.id) {
      query = {
        "id_str": {
          "$eq": req.query.id
        }
      }
    }

    const response = await mongo.getTweet(query, {
      skip: req.query.skip | 0
    })

    if(response == null) {
      res.status(404).send("Not Found")
    } else {
      res.send(response)
    }
  })

  // Validate date
  function validateDate(y, m, d) {
    if (!(d
      && d.match(/^[0-9]{1,2}$/)
      && m
      && m.match(/^[0-9]{1,2}$/)
      && y
      && y.match(/^[0-9]{4}$/)
    )) {
      return null;
    }

    return new Date(`${y}-${m}-${d}`)
  }

  // Get mount num
  function monthFromNum(m) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[parseInt(m) - 1]
  }

  // Generate a regex to math a certain date
  function getRegexFromDate(d, m, y) {
    return new RegExp(/\w{3} /.source + monthFromNum(m) + / /.source + d + / ([0-9]{2}:){2}[0-9]{2} \+[0-9]{4} /.source + y)
  }

  // Count tweets in database by date
  router.get("/count/date", async (req, res, next) => {
    // Validate request
    let date = validateDate(req.query.y, req.query.m, req.query.d)
    if (!date) {
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

  // Find the previous monday
  function previousMonday(date) {
    var prevMonday = new Date();
    prevMonday.setDate(date.getDate() - (date.getDay() + 6) % 7);
    return prevMonday
  }

  // Get tweets by day of a week
  router.get("/count/week", async (req, res, next) => {

    let date = validateDate(req.query.y, req.query.m, req.query.d)

    // Validate request
    if (!date) {
      res.status(400).send({
        status: 400,
        msg: "Bad Request.  This api needs a d, m and y parameter.  They should be a string where d and m contains one or two numbers and y contains four numbers."
      })
      return;
    }

    date = previousMonday(date)

    res.send(date.toString())
  })

  // Get random tweet
  router.get("/random", async (req, res, next) => {
    const response = await mongo.getRandomTweet(req.query.n | 1)
    res.send(response)
  })

  // Get retweets from id of source
  router.get("/retweets", async (req, res, next) => {
    if (!req.query.id) {
      res.status(400).send("Missing requierd argument id")
      return
    }
    const response = await neo4j.findRetweets(req.query.id)
    res.send(response)
  })

  // Get user from tweet
  async function userDataFromTweet(id) {
    let results = await neo4j.getUserFromTweet(id)
    if (results.records.length == 0) {
      throw "Did not find the corresponding user"
    }

    let userID = results.records[0]._fields[0].properties.id_str
    let user = await mongo.getUserById(userID)
    return user
  }

  // Get tweet from user
  router.get("/tweetwithuserdata", async (req, res, next) => {
    if (!req.query.id) {
      res.status(400).send("Missing requierd argument id")
      return
    }

    try {
      let promises = []
      promises.push(mongo.getTweetById(req.query.id))
      promises.push(userDataFromTweet(req.query.id))

      let results = await Promise.all(promises)

      let user = results[1]
      user.status = results[0]
      res.send(user)
    } catch (e) {
      res.status(500).send("Error")
      console.error("Error pårobably due to a unvalid tweet id")
      throw e
    }
  })

  // Get random tweet from user
  router.get("/randomwithuserdata", async (req, res, next) => {
    const response = await mongo.getRandomTweet(req.query.n | 1)

    let promises = []

    for (let tweet of response) {
      promises.push(userDataFromTweet(tweet.id_str))
    }

    let users = await Promise.all(promises)

    for (let i = 0; i < response.length; i++) {
      users[i].status = response[i]
    }

    res.send(users)
  })

  // Random tweet
  router.get("/randomsourceid", async (req, res, next) => {
    const response = await neo4j.findRandomSourceTweet()

    let id = response.records[0]._fields[0].properties.id_str

    res.send({
      id: id
    })
  })

  return router
}
