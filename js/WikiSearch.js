var wikiModule = angular.module('wikiApp', ['ngSanitize']);

function wikipediaCallAPI($scope, preString, postString, callback) {
	var searchString = $scope.searchText;
	var wiki = $scope.wikiName + "/api.php?";
	var URL = wiki + preString + searchString + postString + "&callback=?&";

	$.getJSON(URL, function (data) {
		callback(data);
	});
}

function wikipediaAccumulator($scope, preString, postString, callback) {
	var searchString = $scope.searchText;
	var wiki = $scope.wikiName + "/api.php?";
	console.log("$scope.wikiName = '" + $scope.wikiName +"'");
	var URL = wiki + preString + searchString + postString + "&callback=?&";

	$.getJSON(URL + "continue=", _.partial(wikipediaAccumulatorCore, URL, callback, []));
}

function wikipediaAccumulatorCore(URL, callback, results, data) {
	results.push(data);
	if (data.continue)
		$.getJSON(URL + $.param(data.continue), _.partial(wikipediaAccumulatorCore, URL, callback, results));
	else
		callback(results);
}

function wikipediaSearchShow($scope, data) {
	$scope.searchResults = data[1];
	$scope.$apply() 
}

function wikipediaLinksShow($scope, getRandomLinks, results) {
	var titleArray = _.chain(results)
						.pluck("query")
						.pluck("pages")
						.map(function(array) {
							return _.chain(array)
										.flatten()
										.first()
										.value();
									})
						.pluck("links")
						.flatten()
						.pluck("title")
						.value();

	if (getRandomLinks) {
		titleArray = _.chain(titleArray).shuffle().first($scope.numberOfLinks).value();
	}

	$scope.linkResults = titleArray;
	$scope.$apply() 
}


function wikipediaPageShow($scope, data) {
	$scope.pageText= data.parse.text['*'];
	$scope.$apply() 
}

wikiModule.controller('WikiController', ['$scope', '$http', function($scope, $http) {
	$scope.searchText = "Kitten";
	$scope.wikiName = "http://en.wikipedia.org/w";
	$scope.searchResults = ["a", "b", "c"];

	$scope.wikipediaSearch = function() {
		wikipediaCallAPI($scope, "action=opensearch&search=", "&limit=10&namespace=0&format=json", _.partial(wikipediaSearchShow, $scope));
		$scope.searchResults = ["a", "b", "sdsdfsd"];
	};

	$scope.wikipediaLinks = function (getRandomLinks) {
		$scope.linkResults= wikipediaAccumulator($scope, "format=json&action=query&titles=", "&redirects&pllimit=500&prop=links", _.partial(wikipediaLinksShow, $scope, getRandomLinks));
	};

	$scope.wikipediaPage = function() {
		var wiki = $scope.wikiName + "/api.php?";
		var preString = "action=parse&format=json&page=";
		var searchString = $scope.searchText;
		var postString = "&redirects&prop=text";
		var URL = wiki + preString + searchString + postString + "&callback=JSON_CALLBACK";

		$http.jsonp(URL).
			success(function(data, status){
				$scope.pageText= data.parse.text['*'];
			}).
			error(function(data, status){
				console.log("http request failed.");
				console.log("   status = " + status);
				console.log("   data = " + data);
			});
	};
}]);