const express = require('express');
const router = express.Router();

module.exports = (mongo, neo4j) => {

  // Count tweets in database
  router.get("/count", async (req, res, next) => {
    res.send({
      count: await mongo.countTweets()
    })
  })

  // Get a tweet
  router.get("/get", async (req, res, next) => {
    const response = await mongo.getTweet({
    }, {
      skip: req.query.skip | 0
    })

    res.send(response)
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

    res.send(date.toString())
  })

  return router
}
