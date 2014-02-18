var wikiModule = angular.module('wikiApp', ['ngSanitize']);

function wikipediaConstructURL($scope, preString, searchString, postString) {
	var wiki = $scope.wikiName + "/api.php?";
	var URL = wiki + preString + searchString + postString + "&callback=JSON_CALLBACK";
	return URL;
}

function wikipediaCallAPI($http, $scope, preString, searchString, postString, callback) {
	var URL = wikipediaConstructURL($scope, preString, searchString, postString);

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
	var allLinks = _.chain(data.query.pages).values().pluck("links").flatten().pluck("title").value();

	if (getRandomLinks) {
		allLinks = _.chain(allLinks).shuffle().first($scope.numberOfLinks).value();
	}
	$scope.linkResults = allLinks;
}

function wikipediaPageShow($scope, data) {
	$scope.pageText= data.parse.text['*'];
}

wikiModule.controller('WikiController', ['$scope', '$http', function($scope, $http) {
	$scope.searchText = "Kitten";
	$scope.wikiName = "http://en.wikipedia.org/w";

	$scope.wikipediaSearch = function() {
		wikipediaCallAPI($http, $scope, "action=opensearch&search=", $scope.searchText, "&limit=10&namespace=0&format=json", wikipediaSearchShow);
	};

	$scope.wikipediaLinks = function (getRandomLinks) {
		wikipediaCallAPI($http, $scope, "format=json&action=query&titles=", $scope.searchText, "&redirects&pllimit=500&prop=links", _.partial(wikipediaLinksShow, getRandomLinks));
	};

	$scope.wikipediaPage = function() {
		wikipediaCallAPI($http, $scope, "action=parse&format=json&page=", $scope.searchText, "&redirects&prop=text", wikipediaPageShow);
	};

	$scope.makeGraph = function (searchItem) {
	  createMindMap(searchItem,400,400);
	};

	$scope.expandRandomNode = function () {
		var availableNodes = _.chain(nodes).filter(function(obj) {return !obj.activated;}).value();
		if (availableNodes.length > 0) {
			var randomNode = _.sample(availableNodes);
			randomNode.activated = true;
			var randomNodeName = randomNode.name;

			wikipediaCallAPI($http, $scope, "format=json&action=query&titles=", randomNodeName, "&redirects&pllimit=500&prop=links",
				             function($scope, data) {
				             	var fourLinks = _.chain(data.query.pages).values().pluck("links").flatten().pluck("title").shuffle().first(4).value();
				             	_.each(fourLinks, _.partial(mindMapAddChild, nodeNameToIndex(randomNodeName)));
								mindMapUpdate();
				             });
		}
	};

	$scope.wikipediaSearch();
}]);

// code for test graph
wikiModule.directive('ngSparkline', function() {
  return {
    restrict: 'A',
    require: '^ngCity',
    scope: {
      ngCity: '@'
    },
    template: '<div class="sparkline"><h4>Weather for {{ngCity}}</h4><div class="graph"></div></div>',
    controller: ['$scope', '$http', function($scope, $http) {
      $scope.getTemp = function(city) {
      	var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=7&callback=JSON_CALLBACK&q="

      	$http({
      	    method: 'JSONP',
      	    url: url + city
      	  }).success(function(data) {
      	    var weather = [];
      	    angular.forEach(data.list, function(value){
      	      weather.push(value);
      	    });
      	    $scope.weather = weather;
      	  });
      }
    }],
    link: function(scope, iElement, iAttrs, ctrl) {
      scope.getTemp(iAttrs.ngCity);
      scope.$watch('weather', function(newVal) {
        if (newVal) {
        	scope.highs= _.chain(newVal).pluck("temp").pluck("max").value();
      		chartGraph(iElement, scope.highs, iAttrs);
        } // newval
      }); // watch
    } // link
  } // return
});


var chartGraph = function(element, data, opts) {
	var w = opts.width || 200;
	var	h = opts.height || 80;

	// chart
	var graph = d3.select(".graph")
		.append('svg:svg')
		.attr('width', w)
		.attr('height', h)
		.append('g')

	graph.selectAll('*').remove();

	var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
	var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

	var line = d3.svg.line()
				.x(function(d,i) { return x(i); })
				.y(function(d) {return y(d); });

	var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
	graph.append("svg:g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + h + ")")
		      .call(xAxis);

	var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
	graph.append("svg:g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(-25,0)")
		      .call(yAxisLeft);

	graph.append("svg:path")
			.attr("d", line(data))
			.attr('fill', 'none')
			.attr('stroke-width', '1');
}

wikiModule.directive('ngCity', function() {
  return {
    controller: function($scope) {}
  }
});