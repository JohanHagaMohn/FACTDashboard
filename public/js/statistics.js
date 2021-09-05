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
let tweetDOMs = [];
const options = {
  theme: "light",
  width: 330,
  align: "center",
  dnt: true,
  conversation: "none"
}

async function addTweet(DOMelm, id) {
  //let tweet = await $.get("./API/mongo/tweets/get?skip=" + parseInt(Math.random() * 199));
  await twttr.widgets.createTweet(
    /*tweet.id_str,*/
    id,
    DOMelm,
    options
  )
  DOMelm.removeChild(DOMelm.childNodes[0])
}

async function findTweets() {
  tweets = ["1333397170414870528", "1340280153604284417", "997657383458562048"]
  i = 0
  for (DOM of tweetDOMs) {
    DOM.innerHTML = loadingAnimation;
    addTweet(DOM, tweets[i++])
  }
}

(async function () {

  let randTweet = document.getElementById("randTweet")
  let nCols = Math.floor(randTweet.clientWidth / options.width * 0.97)

  for (let i = 0; i < nCols; i++) {
    let divElm = document.createElement("div")
    divElm.classList.add("col-sm")
    divElm.innerHTML = loadingAnimation
    randTweet.appendChild(divElm)
    tweetDOMs.push(divElm)
  }

  twttr.ready(() => {
    findTweets()
  })
})();

async function lastWeekData() {
  pData = [null, null, null, null, null, null, null];

  for (let i = 0; i < 7; i++) {
    pData[i] = api.countTweetsByDate(2020, 8, (i + 11));
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
