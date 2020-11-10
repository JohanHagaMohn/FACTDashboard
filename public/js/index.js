const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
    data[i]["d"] = i + 11
    data[i]["day"] = daysOfWeek[i]
  }

  return data
}

(async function () {

  let ctx = document.getElementById('tweetHistory')

  let data = await lastWeekData()

  let width = ctx.clientWidth
  let height = 300
  let margin = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 40
  }

  let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .style("font", "20px Arial")
    .call(d3.axisLeft(y).ticks(5))
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Tweets"))

  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .style("font", "20px Arial")
    .call(d3.axisBottom(x).ticks(7).tickFormat((d, i) => data[i].day))

  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]).nice()
    .range([height - margin.bottom, margin.top])

  let x = d3.scaleLinear()
    .domain([d3.min(data, d => d.d), d3.max(data, d => d.d)]).nice()
    .range([margin.left, width - margin.right])

  let line = d3.line()
    .defined(d => !isNaN(d.count))
    .x(d => x(d.d))
    .y(d => y(d.count))

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

  ctx.appendChild(svg.node())

})()
