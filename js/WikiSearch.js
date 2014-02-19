var wikiModule = angular.module('wikiApp', ['ngSanitize']);

// Angular controller 

wikiModule.controller('WikiController', ['$scope', '$http', function($scope, $http) {
	$scope.searchText = "Kitten";
	$scope.wikiName = "http://en.wikipedia.org/w";

	var API = new WikipediaAPI();
	var mindMap = new MindMap(400,400);

	$scope.wikipediaSearch = function() {
		API.call($http, $scope, "action=opensearch&search=", $scope.searchText, "&limit=10&namespace=0&format=json", API.searchShow);
	};
	
	$scope.makeGraph = function (searchItem) {
	  mindMap.init(searchItem);
	};

	$scope.expandRandomNode = function () {
		var availableNodes = _.chain(mindMap.nodes).filter(function(obj) {return !obj.activated;}).value();
		if (availableNodes.length > 0) {
			var randomNode = _.sample(availableNodes);
			randomNode.activated = true;
			var randomNodeName = randomNode.name;

			API.call($http, $scope, "format=json&action=query&titles=", randomNodeName, "&redirects&pllimit=500&prop=links",
			             function($scope, data) {
			             	var fourLinks = _.chain(data.query.pages).values().pluck("links").flatten().pluck("title").shuffle().first(4).value();
			             	var parentIndex = mindMap.nodeNameToIndex(randomNodeName);
			             	_.each(fourLinks, function(childName) { mindMap.addChild(parentIndex, childName); });
							mindMap.update();
			             });
		}
	};

	$scope.wikipediaSearch();
}]);

// random test graph

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