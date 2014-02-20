(function () {
  'use strict';

  angular.module('WikiControllers')
 	 .controller('WikiSearch', ['$scope', '$http', function($scope, $http) {
		$scope.searchText = "Kitten";
		$scope.wikiName = "http://en.wikipedia.org/w";
		$scope.mapData = [];

		var API = new WikipediaAPI();

		$scope.wikipediaSearch = function() {
			API.call($http, $scope, "action=opensearch&search=", $scope.searchText, "&limit=10&namespace=0&format=json", API.searchShow);
		};
		
		$scope.createMapData = function (nodeName) {
			$scope.mapData.push({parent: nodeName, children: []});
		};

		$scope.makeGraph = function (searchItem) {
		  $scope.createMapData(searchItem);
		};

		$scope.expandRandomNode = function () {
			var availableNodes = _.chain($scope.mapData).filter(function(obj) {return !obj.expanded;}).value();
			if (availableNodes.length > 0) {
				var randomNode = _.sample(availableNodes);
				randomNode.expanded = true;
				var randomNodeName = randomNode.parent;

				API.call($http, $scope, "format=json&action=query&titles=", randomNodeName, "&redirects&pllimit=500&prop=links",
				             function($scope, data) {
				             	var fourLinks = _.chain(data.query.pages).values().pluck("links").flatten().pluck("title").shuffle().first(4).value();
				             	var parentMapData = _.findWhere($scope.mapData, {parent: randomNodeName});
				             	_.each(fourLinks, function(childName) {
				             			parentMapData.children.push(childName);
				             			$scope.createMapData(childName);
				             		});
				             });
			}
		};

		$scope.wikipediaSearch();
	}]);
}());