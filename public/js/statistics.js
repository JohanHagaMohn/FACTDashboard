/* globals Chart:false, feather:false */

(async function () {
  let count = await api.countTweets();
  document.querySelector("#tweetCount").innerHTML = count.count;
})();

(async function () {
  let count = await api.countUsers();
  document.querySelector("#usersCount").innerHTML = count.count;
})();

const loadingAnimation = "<div class=\"d-flex flex-wrap justify-content-center\"><div class=\"lds-ellipsis\"><div></div><div></div><div></div><div></div></div></div>";

async function findTweets() {

  let randTweet = document.getElementById("randTweet")
  randTweet.style = "height: 608px;"
  randTweet.innerHTML = "";

  let tweets = await api.getRandomTweetsWithUserData(3)

  for (let i = 0; i < tweets.length; i++) {
    let elm = generateTweetDOM(tweets[i])
    randTweet.appendChild(elm)
  }
};

findTweets()

async function lastWeekData() {
  pData = [null, null, null, null, null, null, null];

  for (let i = 0; i < 7; i++) {
    pData[i] = api.countTweetsByDate(2020, 6, (i + 19));
  }

  let data = await Promise.all(pData)

  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].count
  }

  return data
}

(async function () {
  // Graphs
  var ctx = document.getElementById('myChart');
  // eslint-disable-next-line no-unused-vars

  let data = await lastWeekData();

  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
        'Monday'
      ],
      datasets: [{
        data: data,
        lineTension: 0.4,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointHitRadius: 50,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })
})()
