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

// Get followers of a user by the user id
api.getFollowers = async function(id) {
  let res = await fetch(`/API/users/followers?id=${id}`)
  return await res.json()
}
