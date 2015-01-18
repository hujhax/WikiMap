angular.module('wikiApp')
		.controller('WikiSearch', ['$scope', 'wikiAPI', function($scope, wikiAPI) {

	$scope.searchText = "";
	$scope.curWiki = "http://en.wikipedia.org/w/api.php?";
	$scope.mapData = [];

	$scope.wikipediaSearch = function() {
		wikiAPI.search($scope.searchText, function (data) { $scope.searchResults = data; });
	};

	$scope.resetWiki = function() {
		wikiAPI.setWiki($scope.curWiki);
		$scope.wikipediaSearch();
	}
	
	$scope.mapDataItem = function (nodeName) {
		return {parent: nodeName, children: [], exhausted: false};
	};

	$scope.createMapData = function (nodeName) {
		$scope.mapData= [$scope.mapDataItem(nodeName)];
	};

	$scope.makeGraph = function (searchItem) {
		$scope.createMapData(searchItem);
	};

	$scope.expandRandomNode = function () {
		var availableNodes = _.where($scope.mapData, {exhausted: false});
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

	// in our mapData, add one of the links from linksData as a child of parentNode
	$scope.expandNodeCore = function (parentNode, linksData) {
		var parentMapData = _.findWhere($scope.mapData, {parent: parentNode});
		var childName = _(linksData.Main).difference(parentMapData.children).shuffle().first();

		if (childName) {
			var childMapData = _.findWhere($scope.mapData, {parent: childName});
			if (childMapData) {
				if (_.contains(childMapData.children, parentNode)) { // if that link already exists
					linksData.Main = _.without(linksData.Main, childName); // pick one of the other links
					$scope.expandNodeCore(parentNode, linksData); 
				}
				else {
					parentMapData.children.push(childName);
				}
			}
			else {
				parentMapData.children.push(childName);
				$scope.mapData.push($scope.mapDataItem(childName));
			}
		}
		else {
			parentMapData.exhausted = true;
		}
	};

	$scope.clickMap = function(clickedNode){
		$scope.expandNode(clickedNode.name);
	};

	$scope.openArticle = function(clickedNode){
		wikiAPI.getArticleURL(clickedNode.name, function (articleURL) { window.open(articleURL); });
	};

	$scope.wikipediaSearch();
}]);