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

function wikipediaSearchShow($scope, data) {
	$scope.searchResults = data[1];
}

function wikipediaLinksShow(getRandomLinks, $scope, data) {
	$scope.linkResults = _.chain(data.query.pages).values().pluck("links").flatten().pluck("title").value()
}

function wikipediaPageShow($scope, data) {
	$scope.pageText= data.parse.text['*'];
}

wikiModule.controller('WikiController', ['$scope', '$http', function($scope, $http) {
	$scope.searchText = "Kitten";
	$scope.wikiName = "http://en.wikipedia.org/w";
	$scope.searchResults = ["a", "b", "c"];

	$scope.wikipediaSearch = function() {
		wikipediaCallAPI($http, $scope, "action=opensearch&search=", "&limit=10&namespace=0&format=json", wikipediaSearchShow);
	};

	$scope.wikipediaLinks = function (getRandomLinks) {
		wikipediaCallAPI($http, $scope, "format=json&action=query&titles=", "&redirects&pllimit=500&prop=links", _.partial(wikipediaLinksShow, getRandomLinks));
	};

	$scope.wikipediaPage = function() {
		wikipediaCallAPI($http, $scope, "action=parse&format=json&page=", "&redirects&prop=text", wikipediaPageShow);
	};
}]);