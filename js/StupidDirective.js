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
            console.log(newVals);
          }, true);
        }
      };
    }]);

}());
