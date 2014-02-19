// API object for wikipedia.

function WikipediaAPI() {
}

WikipediaAPI.prototype.constructURL = function($scope, preString, searchString, postString) {
	var wiki = $scope.wikiName + "/api.php?";
	var URL = wiki + preString + searchString + postString + "&callback=JSON_CALLBACK";
	return URL;
}

WikipediaAPI.prototype.call = function($http, $scope, preString, searchString, postString, callback) {
	var URL = this.constructURL($scope, preString, searchString, postString);

	$http.jsonp(URL).
		success(function(data, status){
			callback($scope, data);
		}).
		error(function(data, status){
			console.log("http request failed; status = '" + status + "' and data = '" + data + "'.");
		});
}

WikipediaAPI.prototype.searchShow = function($scope, data) {
	$scope.searchResults = data[1];
}

WikipediaAPI.prototype.linksShow = function(getRandomLinks, $scope, data) {
	$scope.linkResults = _.chain(data.query.pages).values().pluck("links").flatten().pluck("title").value();
}

WikipediaAPI.prototype.pageShow = function($scope, data) {
	$scope.pageText= data.parse.text['*'];
}