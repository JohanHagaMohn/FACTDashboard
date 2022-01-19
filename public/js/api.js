let api = {}

// Counts all the tweets in the database
api.countTweets = async function() {
  let res = await fetch("/API/tweets/count")
  return await res.json()
}

// Count all the users in the database
api.countUsers = async function() {
  let res = await fetch("/API/users/count")
  return await res.json()
}

// Counts tweets by date
api.countTweetsByDate = async function(year, month, day) {
  let res = await fetch(`/API/tweets/count/date?y=${year}&m=${month}&d=${day}`)
  return await res.json()
}

api.getFollowernetwork = async function() {
  let res = await fetch("/API/followernetwork")
  return await res.json()
}

// Get a specific tweet by an id
api.getTweet = async function(id) {
  let res = await fetch(`/API/tweets/get?id=${id}`)
  if(res.status == 200) {
    return await res.json()
  } else if (res.status == 404) {
    return null
  } else {
    throw Error("Unexpected error while trying to feth a tweeet by an id.")
  }
}

// Get a specific user by an id
api.getUser = async function(id) {
  let res = await fetch(`/API/users/get?id=${id}`)
  if(res.status == 200) {
    return await res.json()
  } else if (res.status == 404) {
    return null
  } else {
    throw Error("Unexpected error while trying to feth a user by an id.")
  }
}

// Get followers of a user by the user id
api.getFollowers = async function(id) {
  let res = await fetch(`/API/users/followers?id=${id}`)
  return await res.json()
}

api.getRandomTweets = async function(n) {
  let num = n | 1
  let res = await fetch(`/API/tweets/random?n=${num}`)
  return await res.json()
}

api.getRandomTweet = async function() {
  return (await api.getRandomTweets())[0]
}

api.getRandomUsers = async function(n) {
  let num = n | 1
  let res = await fetch(`/API/users/random?n=${num}`)
  return await res.json()
}

api.getRandomUser = async function() {
  return (await api.getRandomUsers())[0]
}

api.getUserIDFromTweet = async function(id) {
  if (!id) {
    throw Exception("Missing required argument, id")
  }

  const res = await fetch(`/API/users/getFromTweet?id=${id}`)
  const data = await res.json()
  if (data.records.length == 0) {
    console.error("Did not find a tweet with that id")
    return null
  }
  return data.records[0]._fields[0].properties.id_str
}

// example: api.findRetweets("1275849404067524611")
api.findRetweets = async function(id) {
  if (!id) {
    throw Exception("Missing required argument, id")
  }

  let res = await fetch(`/API/tweets/retweets?id=${id}`)
  return await res.json()
}

// Example api.followernetworkFromRetweets("1275849404067524611")
api.followernetworkFromRetweets = async function(id) {
  if (!id) {
    throw Exception("Missing required argument, id")
  }

  let res = await fetch(`/API/followernetwork/retweet?id=${id}`)
  return await res.json()
}

api.getTweetWithUserData = async function(id) {
  if (!id) {
    throw Exception("Missing required argument, id")
  }
  
  let res = await fetch(`/API/tweets/tweetwithuserdata?id=${id}`)
  return await res.json()
}

api.getRandomTweetsWithUserData = async function(n) {

  let num = n | 1;
  
  let res = await fetch(`/API/tweets/randomwithuserdata?id=${num}`)
  return await res.json()
}

api.getRandomTweetWithUserData = async function() {
  return (await api.getRandomTweetsWithUserData(1))[0]
}