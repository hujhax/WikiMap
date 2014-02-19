// code that displays the basic mind map in WikiMap.

function MindMap(width, height) {
  this.didDrag = false;
  this.links = [];

  this.svg = d3.select(".mind-map").append("svg")
    .attr("width", width)
    .attr("height", height);

  this.node = this.svg.selectAll(".node");
  this.link = this.svg.selectAll(".link");

  this.force = d3.layout.force()
  .charge(-1420)
  .linkDistance(150)
  .size([width, height]);
};

MindMap.prototype.init = function(startNode) {
  this.nodes = [ {"name": startNode, "clickable": true, "activated": false} ];
  this.update();
}

MindMap.prototype.nodeName = function(d) {
  return d.name;
}

MindMap.prototype.update = function() {
  var self= this; // for closures

  this.force
      .nodes(this.nodes)
      .links(this.links)
      .start();

  this.link = this.link.data(this.links);
  this.link
      .enter()
      .insert("line", ".node")  // we want the lines to go *behind* the nodes
      .attr("class", "link");

  this.node = this.node.data(this.nodes, this.nodeName);

  this.node
      .enter()
      .append("g")
      .attr("class", "node")
      .call(this.force.drag);
      
  this.node.exit().remove();

  this.force.start();

  this.node.append("ellipse")
      .attr("rx", 50)
      .attr("ry", 30)
      // (we want to repsond to clicks but not drags.)
      .on("mousedown", function() {didDrag = false;})
      .on("mousemove", function() {didDrag = true;})
      .on("mouseup", function(d) {if (!didDrag) mindMapClickNode(d);}); // todo: fire if there was just a tiny drag

  this.node.append("title")
      .text(function(d) { return d.name; });

  this.node.append("text")
    .attr("dx", -45)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

  this.force.on("tick", function() {
    // debugger;
    self.link.attr("x1", function(d) { return d.source.x; })
             .attr("y1", function(d) { return d.source.y; })
             .attr("x2", function(d) { return d.target.x; })
             .attr("y2", function(d) { return d.target.y; });
    
    self.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
}

MindMap.prototype.addChild = function(parentIndex, childName) {
  var childIndex = this.nodeNameToIndex(childName);

  if (childIndex == -1) // not found!
    childIndex = this.nodes.push({name: childName}) - 1;

  this.links.push({"source": childIndex, "target": parentIndex});
}

MindMap.prototype.nodeNameToIndex = function(nodeName) {
  return _.chain(this.nodes).pluck("name").indexOf(nodeName).value();
}