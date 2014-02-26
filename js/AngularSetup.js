(function () {
  'use strict';

  // create the angular app
  angular.module('wikiApp', ['wikiApp.directives']);

  // set up dependency injection
  angular.module('d3', []);
  angular.module('wikiApp.directives', ['d3']);

}());