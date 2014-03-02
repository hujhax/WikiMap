angular.module('wikiApp')
		.controller('WikiSearch', ['$scope', 'wikiAPI', function($scope, wikiAPI) {

	$scope.searchText = "Kitten";
	$scope.mapData = [];

	$scope.wikipediaSearch = function() {
		wikiAPI.search($scope.searchText, function (data) { $scope.searchResults = data; });
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
		wikiAPI.links(nodeName, _.partial($scope.expandNodeCore, nodeName));
	};

	// in our mapData, add four of the links from linksData as children of parentNode
	$scope.expandNodeCore = function (parentNode, linksData) {
		var fourLinks = _.chain(linksData.Main).shuffle().first(4).value();
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