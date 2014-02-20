(function () {
  'use strict';

  angular.module('wikiApp.directives')
    .directive('stupidDirective', [function() {
      return {
        restrict: 'EA',
        scope: {
          data: "="
        },
        link: function(scope, iElement, iAttrs) {
         // watch for data changes and re-render
          scope.$watch('data', function(newVals, oldVals) {
            var nodes = _.pluck(newVals, "parent");

            // create a link for every pair.
            var links = _.reduce(newVals, function(memo, d) {
              memo = memo.concat(
                  _.map(d.children, function(child) {
                    return [d.parent, child];
                  })
                );
              return memo;
            }, []);

            // sort pairs
            links = _.map(links, function(pair) {
              return pair.sort;
            });

            // eliminate duplicates
            links = _.uniq(links);

          }, true);
        }
      };
    }]);

}());
