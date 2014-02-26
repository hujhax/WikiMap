angular.module('wikiApp')
	 .controller('WikiSearch', ['$scope', '$http', 'wikiAPI', function($scope, $http, API) {
	$scope.searchText = "Kitten";
	$scope.wikiName = "http://en.wikipedia.org/w";
	$scope.mapData = [];

	$scope.wikipediaSearch = function() {
		API.search($scope.searchText, function (data) { $scope.searchResults = data; });
	};
	
	$scope.mapDataItem = function (nodeName) {
		return {parent: nodeName, children: []};
	};

	$scope.createMapData = function (nodeName) {
		$scope.mapData= [$scope.mapDataItem(nodeName)];
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
			$scope.expandNode(randomNodeName);
		}
	};

	$scope.expandNode = function (nodeName) {
		API.links(nodeName, _.partial($scope.expandNodeCore, nodeName));
	};

	// in our mapData, add four of the links from linksData as children of parentNode
	$scope.expandNodeCore = function (parentNode, linksData) {
		var fourLinks = _.chain(linksData).shuffle().first(4).value();
		var parentMapData = _.findWhere($scope.mapData, {parent: parentNode});

		_.each(fourLinks, function(childName) {
			parentMapData.children.push(childName);
			$scope.mapData.push($scope.mapDataItem(childName));
		});
	};

	$scope.clickMap = function(clickedNode){
		$scope.expandNode(clickedNode.name);
	};

	$scope.wikipediaSearch();
}]);