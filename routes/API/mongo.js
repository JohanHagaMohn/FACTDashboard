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

let db = null;

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to Mongo DB");

  db = client.db(dbName);

  //client.close();
});

router.get('/tweets', function (req, res, next) {
  db.collection('tweets').find({}).toArray((err, docs) => {
    assert.equal(null, err)

    res.send(docs)
  })
});

router.get("/add/:title/:msg", (req, res, next) => {
  db.collection('tweets').insertOne(req.params, (err, r) => {
    assert.equal(null, err);
    assert.equal(1, r.insertedCount);

    res.send(r)
  })
})

module.exports = router;
