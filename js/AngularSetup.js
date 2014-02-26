(function () {
  'use strict';

  // create the angular app
  angular.module('wikiApp', ['wikiApp.directives']);

  // set up dependency injection
  angular.module('wikiApp.directives', ['d3']);

}());