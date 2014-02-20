// code that displays the basic mind map in WikiMap.

(function () {
  'use strict';

  angular.module('wikiApp.directives')
    .directive('mindMap', ['d3', function(d3) {
      return {
        restrict: 'EA',
        scope: {
          data: "=",
          onClick: "&"
        },
        link: function(scope, iElement, iAttrs) {
          scope.didDrag = false;

          var svg = d3.select(iElement[0])
            .append("svg")
            .attr("width", 400)
            .attr("height", 400);

          var node= svg.selectAll(".node");
          var link= svg.selectAll(".link");

          var force = d3.layout.force()
            .charge(-1420)
            .linkDistance(150)
            .size([400, 400]);

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
            var nodesInD3Format = _.map(nodesAsStringArray, function(string) {return {name: string};});

            force.nodes(nodesInD3Format);

            node = node.data(nodesInD3Format, function(d) { return d.name; });

            var newNodes = node.enter().append("g");

            newNodes
              .attr("class", "node")
              .call(force.drag);

            newNodes
              .append("ellipse")
              .on("click", function(d, i){return scope.onClick({item: d});})
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
}()); // function