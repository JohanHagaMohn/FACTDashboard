/* globals Chart:false, feather:false */

(async function () {
  let count = await $.get("./API/mongo/tweets/count");
  document.querySelector("#count").innerHTML = count.count;
})();

async function lastWeekData() {
  pData = [null, null, null, null, null, null, null];

  for(let i = 0; i < 7; i++) {
    pData[i] = $.get("./API/mongo/tweets/count/date?y=2020&m=8&d=" + (i + 11));
  }

  let data = await Promise.all(pData)

  for(let i = 0; i < data.length; i++) {
    data[i] = data[i].count
  }

  return data
}

(async function () {
  feather.replace()

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
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })
})()
