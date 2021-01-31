var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Authentication
const username = encodeURIComponent(process.env.MONGO_DB_USERNAME);
const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const authMechanism = 'DEFAULT';

// Database Name
const dbName = process.env.MONGO_DB_DBNAME;

// Connection URL
const url = `mongodb://${username}:${password}@${process.env.MONGO_DB_IP}:${process.env.MONGO_DB_PORT}/${dbName}?authMechanism=${authMechanism}`;

// The database instance
let db = null;

// The tweet collection
let tweetCol = null;
// The user collection
let userCol = null;

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  assert.strictEqual(null, err);
  console.log("Connected successfully to Mongo DB");

  db = client.db(dbName);

  tweetCol = db.collection("tweets")
  userCol = db.collection("users")

  //client.close();
});

// The tweets collection

router.get("/tweets/count", (req, res, next) => {
  tweetCol.countDocuments({}, (err, r) => {
    assert.equal(null, err)
    res.send({ count: r })
  })
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

  tweetCol.countDocuments({
    "created_at": {
      $regex: regexDate
    }
  }, (err, r) => {
    assert.strictEqual(null, err)
    res.send({ count: r })
  })
})

// An endpoint to get info from one spesific tweet
router.get("/tweets/get", async (req, res, next) => {
  const response = await tweetCol.findOne({

  }, {
    skip: req.query.skip | 0//parseInt(Math.random() * 100)
  })

  res.send(response)
})

module.exports = router;
