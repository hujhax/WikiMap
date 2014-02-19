// code that displays the basic mind map in WikiMap.

function MindMap(width, height) {
  this.didDrag = false;

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
  this.nodes = [ {"name": startNode} ];
  this.links = [];
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

  this.link.exit().remove();

  this.node = this.node.data(this.nodes, this.nodeName);

  var newNodes = this.node.enter().append("g");

  newNodes
    .attr("class", "node")
    .call(this.force.drag);

  newNodes
    .append("ellipse")
    .attr("rx", 50)
    .attr("ry", 30)

  newNodes
    .append("title")
    .text(function(d) { return d.name; });

  newNodes
    .append("text")
    .attr("dx", -45)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });
      
  this.node.exit().remove();

  this.force.start();

  this.force.on("tick", function() {
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