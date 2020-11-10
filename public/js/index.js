const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

  const margin = {
    top: 20,
    right: 25,
    bottom: 30,
    left: 30
  }

  const width = ctx.clientWidth - margin.left - margin.right
  const height = 300 - margin.top - margin.bottom

  /*
  let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .style("font", "17px Arial")
    .call(d3.axisLeft(y).ticks(5))
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Tweets"))

  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .style("font", "17px Arial")
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

  const transitionPath = d3.transition()
    .duration(2500);

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
  */

  // Create SVG and padding for the chart
  const svg = d3.create("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right);
  ctx.appendChild(svg.node())

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},0)`);
  const grp = chart
    .append("g")
    .attr("transform", `translate(-${margin.left},0)`);

  // Add empty scales group for the scales to be attatched to on update
  chart.append("g").attr("class", "x-axis");
  chart.append("g").attr("class", "y-axis");

  // Add empty path
  const path = grp
    .append("path")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 5);

  function updateScales(data) {
    // Create scales
    const yScale = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, d3.max(data, d => d.count)]).nice();
    const xScale = d3
      .scaleLinear()
      .range([0, width - margin.right])
      .domain([d3.min(data, d => d.d), d3.max(data, d => d.d)]).nice();
    return { yScale, xScale };
  }

  function createLine(xScale, yScale) {
    return line = d3
    .line()
    .x(d => xScale(d.d))
    .y(d => yScale(d.count));
  }

  function updateAxes(data, chart, xScale, yScale) {
    chart
      .select(".x-axis")
      .style("font", "15px Arial")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(data.length).tickFormat((d, i) => data[i].day));
    chart
      .select(".y-axis")
      .style("font", "15px Arial")
      .attr("transform", `translate(0, 0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Tweets"))
  }

  function updatePath(data, line) {
    const updatedPath = d3
      .select("path")
      .interrupt()
      .datum(data)
      .attr("d", line);

    const pathLength = updatedPath.node().getTotalLength();
    // D3 provides lots of transition options, have a play around here:
    // https://github.com/d3/d3-transition
    const transitionPath = d3
      .transition()
      .ease(d3.easeSin)
      .duration(2500);
    updatedPath
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-dasharray", pathLength)
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0);
  }

  function updateChart(data) {
      const { yScale, xScale } = updateScales(data);
      const line = createLine(xScale, yScale);
      updateAxes(data, chart, xScale, yScale);
      updatePath(data, line);
  }

  updateChart(data);
})()
