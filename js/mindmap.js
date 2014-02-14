// code that displays the basic mind map in WikiMap.

var didDrag = false;

var width = window.screen.width,
    height = window.screen.height;

var force = d3.layout.force()
    .charge(-1420)
    .linkDistance(150)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var nodes = [ {"name": "Cat", "clickable": true, "activated": false} ];
var links = [];
var node = svg.selectAll(".node");
var link = svg.selectAll(".link");

update();

function update() {
  force
      .nodes(nodes)
      .links(links)
      .start();

  link = link.data(links);
  link
      .enter()
      .insert("line", ".node")  // we want the lines to go *behind* the nodes
      .attr("class", "link");

  node = node.data(nodes);

  node
      .enter()
      .append("g")
      .attr("class", "node")
      .call(force.drag);
  
  force.start();

  node.append("ellipse")
      .attr("rx", 50)
      .attr("ry", 30)
      // (we want to repsond to clicks but not drags.)
      .on("mousedown", function() {didDrag = false;})
      .on("mousemove", function() {didDrag = true;})
      .on("mouseup", function(d) {if (!didDrag) clickNode(d)}); // todo: fire if there was just a tiny drag

  node.append("title")
      .text(function(d) { return d.name; });

  node.append("text")
    .attr("dx", -45)
    .attr("dy", ".35em")
    .text(function(d) { return d.name });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
}

function clickNode(d) {
  if (! d.clickable) return;
  if (d.activated) return;

  var children = [];
  switch (d.name) {
    case "Cat":
      children = ["Feline", "Purring", "Mammal", "Feral Cats", "Tiger"];
      break;
    case "Tiger":
      children = ["Feline", "Bengal Tiger", "Liger", "Sumatra"];
      break;
    default:
      break;
  }

  console.log(children);
  _.each(children, _.partial(addChild,d.index));

  update();
  d.activated = true;
}

function addChild(parentIndex, childName) {
  var childIndex = _.chain(nodes).pluck("name").indexOf(childName).value();

  if (childIndex == -1) // not found!
    childIndex = nodes.push({name: childName, clickable: (childName == "Tiger")}) - 1;

  links.push({"source": childIndex, "target": parentIndex});
}