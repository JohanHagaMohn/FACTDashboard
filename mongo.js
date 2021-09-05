const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Authentication
const username = encodeURIComponent(process.env.MONGO_DB_USERNAME);
const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const authMechanism = 'DEFAULT';

// Database Name
const dbName = process.env.MONGO_DB_DBNAME;

// Connection URL
const uri = `mongodb://${username}:${password}@${process.env.MONGO_DB_IP}:${process.env.MONGO_DB_PORT}/${dbName}?authMechanism=${authMechanism}&useUnifiedTopology=true`;

const client = new MongoClient(uri)

let database, tweetCol, usersCol;

(async function() {
  await client.connect()
  database = client.db(dbName)

  tweetCol = database.collection("tweets");
  usersCol = database.collection("users");
})();

async function countTweets(query) {
  return await tweetCol.countDocuments(query)
}

async function getTweet(query) {
  return await tweetCol.findOne(query)
}

module.exports = {
  client,
  database,
  collection: {
    tweets: tweetCol,
    users: usersCol
  },
  countTweets,
  getTweet
}
