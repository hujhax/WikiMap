var wikiModule = angular.module('wikiApp', ['ngSanitize']);

// Angular controller for app

wikiModule.controller('WikiController', ['$scope', '$http', function($scope, $http) {
	$scope.searchText = "Kitten";
	$scope.wikiName = "http://en.wikipedia.org/w";

	var API = new WikipediaAPI();
	var mindMap = new MindMap(400,400);

	$scope.wikipediaSearch = function() {
		API.call($http, $scope, "action=opensearch&search=", $scope.searchText, "&limit=10&namespace=0&format=json", API.searchShow);
	};
	
	$scope.makeGraph = function (searchItem) {
	  mindMap.init(searchItem);
	};

	$scope.expandRandomNode = function () {
		var availableNodes = _.chain(mindMap.nodes).filter(function(obj) {return !obj.activated;}).value();
		if (availableNodes.length > 0) {
			var randomNode = _.sample(availableNodes);
			randomNode.activated = true;
			var randomNodeName = randomNode.name;

			API.call($http, $scope, "format=json&action=query&titles=", randomNodeName, "&redirects&pllimit=500&prop=links",
			             function($scope, data) {
			             	var fourLinks = _.chain(data.query.pages).values().pluck("links").flatten().pluck("title").shuffle().first(4).value();
			             	var parentIndex = mindMap.nodeNameToIndex(randomNodeName);
			             	_.each(fourLinks, function(childName) { mindMap.addChild(parentIndex, childName); });
							mindMap.update();
			             });
		}
	};

	$scope.wikipediaSearch();
}]);
