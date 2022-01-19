async function followerGraph(id) {
  const neo4jData = await api.getFollowers(id);

  let neo4jNodes = []
  neo4jNodes.push(neo4jData.records[0]._fields[0])

  let edges = []
  for (let record of neo4jData.records) {
    edges.push({
      source: record._fields[1].start.low,
      target: record._fields[1].end.low
    })
    neo4jNodes.push(record._fields[2])
  }

  return {
    dataNodes: neo4jNodes,
    edges: edges,
    source: id
  }
}

async function retweetFollowerNetwork(id) {
  const {users, relationships} = await api.followernetworkFromRetweets(id);

  let edges = []
  for (let rel of relationships) {
    edges.push({
      source: rel.start.low,
      target: rel.end.low
    })
  }

  let src = await api.getUserIDFromTweet(id)

  return {
    dataNodes: users,
    edges: edges,
    source: src
  }
}

async function getRetweets(id) {
  const retweets = await api.findRetweets(id)

  dataNodes = []
  edges = []

  dataNodes.push(retweets.records[0]._fields[0])

  for (let record of retweets.records) {
    edges.push({
      source: record._fields[1].start.low,
      target: record._fields[1].end.low
    })
    dataNodes.push(record._fields[2])
  }

  return {
    dataNodes,
    edges,
    source: id
  }
}

function idFromURL() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("tweetID")
}

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
  const radius = 8;
  const container = document.getElementById("graphContainer");
  
  const toggleTweets = document.querySelector(".switch");
  var tweetsShown = false;

  //let TWEEEEEEEEEET = "1275849404067524611"
  //let TWEEEEEEEEEET = "1275046615510732806"
  //let TWEEEEEEEEEET = "1274639850495340544"
  let TWEEEEEEEEEET = "1275864174309113858"
  //let TWEEEEEEEEEET = "1275854284526149632"
  //let TWEEEEEEEEEET = "1260575550734819328"

  if (idFromURL()) {
    TWEEEEEEEEEET = idFromURL()
  }

  //let followers = await followerGraph("1611503244"); // User id
  let usersThatHaveRetweeted = await retweetFollowerNetwork(TWEEEEEEEEEET); // Tweet id
  let retweets = await retweetFollowerNetwork(TWEEEEEEEEEET);

  var toRemove;
  var popup;
  

  function remover() {
    d3.select(toRemove).transition().duration(350).attr("r", radius);
    popup.style.opacity = 0;
    setTimeout(() => {
      popup.remove();
    }, 300);
    toRemove = null;
    container.removeEventListener('click', remover);
  }
  function showGraph({dataNodes, edges, source}) {
    const chart = () => {
      const links = edges.map(d => Object.create(d));
      const nodes = dataNodes.map(d => Object.create(d));
  
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.identity.low).distance(4 * radius))
        .force("charge", d3.forceManyBody().strength(-400))
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
        .attr("fill", (d) => ((d.properties.id_str == source) ? "green" : "blue"))
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
      node.on('click', async function (a, n) {
        d3.forceSimulation(node).force("charge", d3.forceManyBody().strength(1000))
        console.log(n)
        if (toRemove) {
          d3.select(toRemove).transition().duration(350).attr("r", radius);
          popup.remove();
          container.removeEventListener('click', remover);
        }
        toRemove = this;
        
        //const user = (typeof n.properties.full_text == 'undefined')
      
        popup = (!tweetsShown) ? generateUserDOM(await api.getUser(n.properties.id_str)) : generateTweetDOM(await api.getTweetWithUserData(n.properties.id_str));
  
        popup.id = "graphTweet";
        d3.select(this).transition().duration(350).attr("r", radius * 2.5);
        container.insertAdjacentElement("afterend", popup);
        setTimeout(() => {
          container.addEventListener('click', remover);
        }, 200);
      });
  
      return svg.node();
    }
    container.appendChild(chart())
  }
  
  async function switching() {
    toggleTweets.removeEventListener('click', switching)

    setTimeout(function(){
      toggleTweets.addEventListener("click", switching);
    }, 100);
    
    if (toRemove) {
      d3.select(toRemove).transition().duration(350).attr("r", radius);
      popup.remove();
      container.removeEventListener('click', remover);
    }
    if (!tweetsShown) {
      tweetsShown = true;
      while (container.firstChild) {
        container.removeChild(container.lastChild);
      }
      retweets = await getRetweets(TWEEEEEEEEEET);
      showGraph(retweets);
    } else {
      tweetsShown = false;
      while (container.firstChild) {
        container.removeChild(container.lastChild);
      }
      usersThatHaveRetweeted = await retweetFollowerNetwork(TWEEEEEEEEEET)
      showGraph(usersThatHaveRetweeted);
    }
  }
  toggleTweets.addEventListener("click", switching);

  return showGraph(usersThatHaveRetweeted)
})();

