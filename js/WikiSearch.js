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
	console.log("wikipediaSearchShow!");
	console.log(data);
	console.log(data[1]);
	$scope.searchResults = data[1];
	console.log($scope);
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
		titleArray = _.chain(titleArray).shuffle().first(document.getElementById("testNumber").value).value();
	}

	$scope.linkResults = titleArray;
	$scope.$apply() 
}


function wikipediaPageShow($scope, data) {
	$scope.pageText= data;
	$scope.$apply() 
}

function WikiController($scope) {
	$scope.searchText = "Kitten";
	$scope.items = [];
	$scope.wikiName = "http://en.wikipedia.org/w";
	$scope.searchResults = ["a", "b", "c"];
	$scope.textChange = function() {
		$scope.items=[$scope.searchText+' 1',$scope.searchText+' 2',$scope.searchText+' 3']
	};

	$scope.wikipediaSearch = function() {
		wikipediaCallAPI($scope, "action=opensearch&search=", "&limit=10&namespace=0&format=json", _.partial(wikipediaSearchShow, $scope));
		$scope.searchResults = ["a", "b", "sdsdfsd"];
	};

	$scope.wikipediaLinks = function (getRandomLinks) {
		$scope.linkResults= wikipediaAccumulator($scope, "format=json&action=query&titles=", "&redirects&pllimit=500&prop=links", _.partial(wikipediaLinksShow, $scope, getRandomLinks));
	};

	$scope.wikipediaPage = function() {
		$scope.pageText=  wikipediaCallAPI($scope, "action=parse&format=json&page=", "&redirects&prop=text", _.partial(wikipediaPageShow, $scope));
	};

}