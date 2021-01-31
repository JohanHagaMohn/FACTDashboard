(async function() {
  const drag = simulation => {

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

  const height = 400;
  const width = 600;

  const data = await $.getJSON("/API/neo4j/example");

  const chart = () => {
    const links = data.edges.map(d => Object.create(d));
    const nodes = data.users.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id_str))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", d => 0.5);

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", 3)
        .attr("fill", (d) => ((d.id_str == data.src) ? "green" : "blue"))
        .call(drag(simulation));

    node.append("title")
        .text(d => d.name);

    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    });

    //invalidation.then(() => simulation.stop());

    return svg.node();
  }

  let divElm = document.getElementById("graphContainer")
  divElm.appendChild(chart())

})();
