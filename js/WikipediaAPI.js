// API object for wikipedia.

angular.module('wikiApp')
	.factory("wikiAPI", ['$http', function ($http) {
		return {
			constructURL: function ($scope, preString, searchString, postString) {
				var wiki = $scope.wikiName + "/api.php?";
				var URL = wiki + preString + searchString + postString + "&callback=JSON_CALLBACK";
				return URL;
			},
			callWithScope: function($scope, preString, searchString, postString, callback) {
				var URL = this.constructURL($scope, preString, searchString, postString);

				$http.jsonp(URL).
					success(function(data, status){
						callback($scope, data);
					}).
					error(function(data, status){
						console.log("http request failed; status = '" + status + "' and data = '" + data + "'.");
					});
			},
			call: function($scope, preString, searchString, postString, callback) {
				var URL = this.constructURL($scope, preString, searchString, postString);

				$http.jsonp(URL).
					success(function(data, status){
						callback($scope, data);
					}).
					error(function(data, status){
						console.log("http request failed; status = '" + status + "' and data = '" + data + "'.");
					});
			},
			search: function($scope, searchText) {
				this.call($scope, "action=opensearch&search=", searchText, "&limit=10&namespace=0&format=json", this.searchShow);
			},
			searchShow: function($scope, data) {
				$scope.searchResults = data[1];
			}
		}
	}]);