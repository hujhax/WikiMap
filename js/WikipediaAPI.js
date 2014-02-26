// API object for wikipedia.

angular.module('wikiApp')
	.factory("wikiAPI", function () {
		return {
			constructURL: function ($scope, preString, searchString, postString) {
				var wiki = $scope.wikiName + "/api.php?";
				var URL = wiki + preString + searchString + postString + "&callback=JSON_CALLBACK";
				return URL;
			},
			call: function($http, $scope, preString, searchString, postString, callback) {
				var URL = this.constructURL($scope, preString, searchString, postString);

				$http.jsonp(URL).
					success(function(data, status){
						callback($scope, data);
					}).
					error(function(data, status){
						console.log("http request failed; status = '" + status + "' and data = '" + data + "'.");
					});
			},
			searchShow: function($scope, data) {
				$scope.searchResults = data[1];
			},
			linksShow: function(getRandomLinks, $scope, data) {
				$scope.linkResults = _.chain(data.query.pages).values().pluck("links").flatten().pluck("title").value();
			},
			pageShow: function($scope, data) {
				$scope.pageText= data.parse.text['*'];
			}
		}
	});