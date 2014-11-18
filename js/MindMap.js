// code that displays the basic mind map in WikiMap.

angular.module('wikiApp')
  .directive('mindMap', ['d3', function(d3) {
    return {  
      restrict: 'EA',
      scope: {
        data: "=",
        onClickNode: "&"
      },
      link: function(scope, iElement, iAttrs) {
        scope.didDrag = false;

        var mapHeight = $(window).height() - 50;
        var mapWidth = $(window).width() - 20;

        var svg = d3.select(iElement[0])
          .append("svg")
          .attr("width", mapWidth)
          .attr("height", mapHeight)
          .attr("style", "background: #f5f5f5")

        var node= svg.selectAll(".node");
        var link= svg.selectAll(".link");

        var force = d3.layout.force()
          .charge(-1420)
          .linkDistance(200)
          .size([mapWidth, mapHeight]);

        scope.$watch('data', function(newVals, oldVals) {
          return scope.updateMindMap(newVals);
        }, true);

        scope.updateMindMap = function(parentData) {
          var nodes = _.pluck(parentData, "parent");

          scope.updateNodes(nodes);

          var links = _.reduce(parentData, function(memo, d) {
            memo = memo.concat(
                _.map(d.children, function(child) {
                  return [d.parent, child];
                })
              );
            return memo;
          }, []);

          scope.updateLinks(links);

          force.start();

          force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                     .attr("y1", function(d) { return d.source.y; })
                     .attr("x2", function(d) { return d.target.x; })
                     .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) {
             return "translate(" + d.x + "," + d.y + ")"; });
          });
        };

        scope.updateNodes = function(nodesAsStringArray) {
          var oldNodes = force.nodes();
          var nodesInD3Format = _.map(nodesAsStringArray, function(string) {
            var existingNode = _.find(oldNodes, {name: string});
            if (existingNode) {
              return existingNode;
            }
            else if (oldNodes.length == 1) {
              return {name: string, x: 300, y: 300};  // hack to fix "second node streaks in from infinity"
            }
            else {
              return {name: string};
            }
          });

          force.nodes(nodesInD3Format);

          node = node.data(nodesInD3Format, function(d) { return d.name; });

          var newNodes = node.enter().append("g");

          newNodes
            .attr("class", "node")
            .call(force.drag);

          newNodes
            .append("title")
            .text(function(d) { return d.name; });

          newNodes
            .append("text")
            .attr("dx", -45)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
              
          newNodes
            .insert("rect", "text")
            .on("mousedown", function(d) {
              scope.startX=d.x; 
              scope.startY=d.y; 
              scope.didDrag= false;
            })
            .on("mousemove", function(d) {
              if ((Math.abs(d.x - scope.startX) + Math.abs(d.y - scope.startY)) > 10) {
                scope.didDrag= true;
              }
            })
            .on("mouseup", function(d, i){
              if (!scope.didDrag) {
                return scope.onClickNode({clickedNode: d});
              }
            })
            
            .attr("width", function(d) {
              return Math.max(this.parentElement.getBBox().width + 10, 60);
            })
            .attr("style", "fill: #fee")
            .attr("height", 50)
            .attr("rx", 20)
            .attr("ry", 20)
            .attr("transform", "translate(-50,-20)");

          node.exit().remove();
        };

        scope.updateLinks = function(linksAsStringPairs) {
          var linksInD3Format = _.map(linksAsStringPairs, function (pair) {
              return {
                source: scope.convertNodeNameToIndex(pair[0]),
                target: scope.convertNodeNameToIndex(pair[1])
              };
            }
          );

          force.links(linksInD3Format);

          link = link.data(linksInD3Format);

          link
              .enter()
              .insert("line", ".node")  // we want the lines to go *behind* the nodes
              .attr("class", "link");

          link.exit().remove();

        };

        scope.convertNodeNameToIndex = function (nodeName) {
          return _.chain(node.data()).pluck("name").indexOf(nodeName).value();
        };
      } // link
    }; // return
  }]); // directive    