const neo4j = require('neo4j-driver')

// env
const username = process.env.NEO4J_DB_USERNAME;
const password = process.env.NEO4J_DB_PASSWORD;
const uri = process.env.NEO4J_DB_URI

// Connect to neo4j
let driver
try {
  driver = neo4j.driver(uri, neo4j.auth.basic(username, password))
  //session = driver.session()
} catch (err) {
  console.warn("Failed to connect to Neo4j")
  console.log(err)
}

// Query the neo4j databse
async function query(query, params) {
  let session = driver.session()
  let res = await session.run(query, params)
  session.close()
  return res
}

// Find followers of a user
async function getFollowers(id) {
  return await query('MATCH (s:user {id_str: $id_str})<-[r:FOLLOW]-(f:user) RETURN s, r, f', {
    id_str: id
  })
}

async function findRetweets(id) {
  return await query('MATCH (s:tweet {id_str: $id_str})<-[r:retweet]-(t:tweet) RETURN s, r, t', {
    id_str: id
  })
}

async function getUserFromTweet(id) {
  return await query('MATCH (:tweet {id_str: $id_str})-[:created_by]->(u:user) RETURN u', {
    id_str: id
  })
}

async function getFollowernetworkFromRetweets(id) {
  const response1 = await query(`
    MATCH (st:tweet {id_str: $id_str})<-[:retweet]-(t:tweet)
    MATCH (st)-[:created_by]->(su:user)
    MATCH (t)-[:created_by]->(ru:user)
    RETURN su, ru`, {
    id_str: id
  })

  const records = response1.records

  if (records.length == 0) {
    return null
  }

  let users = [records[0]._fields[0]]
  for (let i = 0; i < records.length; i++) {
    users.push(records[i]._fields[1])
  }

  let relationships = []

  // TODO, should be refactored, O(n^3)
  pFollowers = []
  for (let user of users) {
    pFollowers.push(getFollowers(user.properties.id_str))
  }
  let uFollowers = await Promise.all(pFollowers)
  
  for (let followers of uFollowers) {
    for (let f of followers.records) {
      let uId = f._fields[2].identity.low
      for (let u of users) {
        if (uId == u.identity.low) {
          relationships.push(f._fields[1])
        }
      }
    }
  }

  return {
    users,
    relationships
  }
}

module.exports = {
  driver,
  query,
  getFollowers,
  findRetweets,
  getUserFromTweet,
  getFollowernetworkFromRetweets
}
