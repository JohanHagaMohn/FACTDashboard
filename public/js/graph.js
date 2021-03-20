(async function () {
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

  const height = window.innerHeight * 0.78;
  const width = window.innerWidth * 0.78;
  const radius = 6;

  const neo4jData = await $.getJSON("/API/neo4j/example2");

  let edges = []
  for (let edge of neo4jData.edges) {
    edges.push({
      source: edge.start.low,
      target: edge.end.low
    })
  }

  const chart = () => {
    const links = edges.map(d => Object.create(d));
    const nodes = neo4jData.nodes.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.identity.low).distance(4 * radius))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.create("svg")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("viewBox", [0, 0, width, height]);

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => radius / 3);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", radius)
      .attr("fill", (d) => ((d.properties.id_str == neo4jData.src) ? "green" : "blue"))
      .call(drag(simulation));

    node.append("title")
      .text(d => d.name);

    simulation.on("tick", () => {

      node
        .attr("cx", function (d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function (d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    });

    var toRemove;
    var tweet;

    const container = document.getElementById("graphContainer");

    function remover() {
      d3.select(toRemove).transition().duration(350).attr("r", radius);
      tweet.style.opacity = 0;
      setTimeout(() => {
        tweet.remove();
      }, 300);
      toRemove = null;
      container.removeEventListener('click', remover);
    }

    twttr.ready(() => {
      node.on('click', function (a, n) {
        if (toRemove) {
          d3.select(toRemove).transition().duration(350).attr("r", radius);
          tweet.remove();
          container.removeEventListener('click', remover);
        }
        toRemove = this;
        tweet = document.createElement("DIV");

        twitterLogo = '<svg id="twitterLogo" viewBox="0 0 24 24" color="rgb(29, 161, 242)" class="r-13gxpu9 r-4qtqp9 r-yyyyoo r-1ve99a9 r-19fsva8 r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-23tnvd"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>';

<<<<<<< HEAD
        tweet.innerHTML = `<div id="tweetTop"><div id="tweetProfile"><img id="tweetProfileImage" src=""></img></div><div id="tweetUser"><h6 id="tweetUsername">${n.properties.name}</h6><h6 id="tweetTag">@${n.properties.screen_name}</h6></div><div id="tweetLogo">${twitterLogo}</div></div><div id="tweetMessage"></div><div id="tweetDetails" class="border-bottom"><h6 id="tweetTime"></h6></div><div id="tweetReactions"></div>`;
=======
        console.log(n.properties)
>>>>>>> 63a59baf701b7fb09e75b23a95847b85c3fdb559

        console.log(n)
        console.log(n.properties.id_str)

        tweet.id = "graphTweet";
        d3.select(this).transition().duration(350).attr("r", radius * 3);
        tweet.style.zIndex = "-1";
        container.insertAdjacentElement("afterend", tweet);
        setTimeout(() => {
          container.addEventListener('click', remover);
        }, 200);
      });
    })

    //invalidation.then(() => simulation.stop());

    return svg.node();
  }

  let divElm = document.getElementById("graphContainer")
  divElm.style.height = "50vh";
  divElm.style.width = "auto";
  divElm.style.maxWidth = "100%";
  divElm.appendChild(chart())

})();
