// set up dimensions
var width = 600,
    height = 400;

// set up svg
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

// load data from data.json
d3.json("data.json").then(function(data) {
  
  // set up sankey generator
  var sankey = d3.sankey()
      .nodeWidth(30)
      .nodePadding(10)
      .size([width, height]);
  
  // set up link color scale
  var linkColor = d3.scaleOrdinal(d3.schemeCategory10);
  
  // set up nodes and links from data
  var {nodes, links} = sankey(data);
  
  // add links to svg
  svg.append("g")
      .selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .style("stroke-width", function(d) { return Math.max(1, d.width); })
      .style("stroke", function(d) { return linkColor(d.source.name); })
      .sort(function(a, b) { return b.width - a.width; });
  
  // add nodes to svg
  var node = svg.append("g")
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
      .call(d3.drag()
          .subject(function(d) { return d; })
          .on("start", function() { this.parentNode.appendChild(this); })
          .on("drag", dragmove));
  
  // add node rectangles to nodes
  node.append("rect")
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return d.color = linkColor(d.name); })
      .style("stroke", "#000");
  
  // add node labels to nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return (d.y1 - d.y0) / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.name; })
      .filter(function(d) { return d.x0 < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");
  
  // dragmove function for dragging nodes
  function dragmove(d) {
    d3.select(this)
        .attr("transform", "translate(" + d.x0 + "," + (d.y0 = d3.event.y) + ")");
    sankey.update(data);
    svg.selectAll(".link")
        .attr("d", d3.sankeyLinkHorizontal());
  }
  
}).catch(function(error) {
  console.log(error);
});