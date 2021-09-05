let api = {}

api.countTweets = async function() {
  let res = await fetch("/API/tweets/count")
  return await res.json()
}

api.countTweetsByDate = async function(year, month, day) {
  let res = await fetch(`/API/tweets/count/date?y=${year}&m=${month}&d=${day}`)
  return await res.json()
}

api.getFollowernetwork = async function() {
  let res = await fetch("/API/followernetwork")
  return await res.json()
}
