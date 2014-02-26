// API object for wikipedia.

angular.module('wikiApp')
	.factory("wikiAPI", ['$http', function ($http) {
		var wiki = "http://en.wikipedia.org/w/api.php?";
		return {
			constructURL: function (preString, searchString, postString) {
				var URL = wiki + preString + searchString + postString + "&callback=JSON_CALLBACK";
				return URL;
			},
			call: function(preString, searchString, postString, processData, callback) {
				var URL = this.constructURL(preString, searchString, postString);

				$http.jsonp(URL).
					success(function(data, status){
						data = processData(data);
						callback(data);
					}).
					error(function(data, status){
						console.log("http request failed; status = '" + status + "' and data = '" + data + "'.");
					});
			},
			search: function(searchText, callback) {
				this.call("action=opensearch&search=", searchText, "&limit=10&namespace=0&format=json", this.processSearchData, callback);
			},
			processSearchData: function(data) {
				return data[1];
			},
			links: function(linksText, callback) {
				this.call("format=json&action=query&titles=", linksText, "&redirects&pllimit=500&prop=links", this.processLinksData, callback);
			},
			processLinksData: function(data) {
				return _.chain(data.query.pages).values().pluck("links").flatten().pluck("title").value();
			}
		}
	}]);