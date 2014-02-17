var wikiModule = angular.module('wikiApp', ['ngSanitize']);

function wikipediaConstructURL($scope, preString, postString) {
	var wiki = $scope.wikiName + "/api.php?";
	var searchString = $scope.searchText;
	var URL = wiki + preString + searchString + postString + "&callback=JSON_CALLBACK";
	return URL;
}

function wikipediaCallAPI($http, $scope, preString, postString, callback) {
	var URL = wikipediaConstructURL($scope, preString, postString);

	$http.jsonp(URL).
		success(function(data, status){
			callback($scope, data);
		}).
		error(function(data, status){
			console.log("http request failed.");
			console.log("   status = " + status);
			console.log("   data = " + data);
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
		$scope.searchResults = ["a", "b", "sdsdfsd"];
		wikipediaCallAPI($http, $scope, "action=opensearch&search=", "&limit=10&namespace=0&format=json", wikipediaSearchShow);
	};

	$scope.wikipediaLinks = function (getRandomLinks) {
		$scope.linkResults= wikipediaAccumulator($scope, "format=json&action=query&titles=", "&redirects&pllimit=500&prop=links", _.partial(wikipediaLinksShow, $scope, getRandomLinks));
	};

	$scope.wikipediaPage = function() {
		wikipediaCallAPI($http, $scope, "action=parse&format=json&page=", "&redirects&prop=text", wikipediaPageShow);
	};
}]);