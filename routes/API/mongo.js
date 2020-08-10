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
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
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
    res.send({count: r})
  })
})

module.exports = router;
