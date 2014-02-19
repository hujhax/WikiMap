(function () {
  'use strict';

  // create the angular app
  angular.module('wikiApp', ['WikiControllers', 'wikiApp.directives']);

  // set up dependency injection
  // angular.module('d3', []);
  angular.module('WikiControllers', []);
  angular.module('wikiApp.directives', []);

}());