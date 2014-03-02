describe("Dummy test suite", function() {
  it("True should be equal to true.", function() {
    expect(true).toBe(true);
  });
});


var fakeSearchResults = ['Kitten', 'Kittenball', 'Kitten Navidad', 'Kitten with a Whip', 
                         'Kitten\'s Joy', 'Kittenpants', 'Kittens Reichert', 'Kitten heel',
                         'Kitten Kong', 'Kittens (band)'];

var fakeLinkResults = { Main: ['Amnion', 'Donksoy', 'Persian', 'Governing Council of the Cat Fancy']};

describe("Testing the WikiMap controller.", function() {
  // create a mock app module
  beforeEach(module('wikiApp'));  

  // create a mock wikiAPI service
  beforeEach(module(function ($provide) {
   var mockWikiAPI = $provide.value('wikiAPI', { 
       search: function(text, callback) {callback(fakeSearchResults);},
       links: function(text, callback) {callback(fakeLinkResults);}
    });
  }));

  // create the controller
  var scope;
  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller("WikiSearch", { 
        $scope: scope
    });
  }));

  // verify its behavior
  it("Default search text should be 'Kitten'.", function() {
      expect(scope.searchText).toBe("Kitten");
  });

  it ("Search results should be provided by the wikiAPI.", function () {
      expect(scope.searchResults).toBe(fakeSearchResults);
  });

  it ("We should be able to create single-node map data.", function () {
    scope.createMapData("Kitten");
    expect(scope.mapData).toEqual([{parent: "Kitten", children: []}]); // arrays require toEqual
  });

  it ("We should be able to expand a node.", function () {
    scope.createMapData("Kitten");
    scope.expandNode("Kitten");

    expect(scope.mapData.length).toBe(5);
    expect(_.chain(scope.mapData).pluck("parent").sortBy().value()).toEqual(_.sortBy(fakeLinkResults.Main.concat("Kitten")));
    expect(_.chain(scope.mapData).pluck("children").flatten().sortBy().value()).toEqual(_.sortBy(fakeLinkResults.Main));
  });
});

describe("Testing the MediaWiki API service.", function() {
  var wikiAPI, $httpbackend;

  // create a mock app module
  beforeEach(module('wikiApp')); 

  // set up the mock http service
  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenJSONP("http://en.wikipedia.org/w/api.php?action=opensearch&search=Kitten&limit=10&namespace=0&format=json&callback=JSON_CALLBACK")
      .respond(["Kitten", fakeSearchResults]); 
   }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // set up the wikiAPI service
  beforeEach(inject(function($injector) {
    wikiAPI = $injector.get('wikiAPI');
  }));

  // create the service
  it("The wikiAPI shouldn't be null.", function () {
    expect(wikiAPI).not.toEqual(null);
  });

  it("The URL constructor should behave predictably.", function () {
    expect(wikiAPI.constructURL('foo', 'bar', 'baz')).toBe("http://en.wikipedia.org/w/api.php?foobarbaz&callback=JSON_CALLBACK");
  });

  it("The search function should work.", function () {
    var results;
    wikiAPI.search("Kitten", function (data) {results = data;});
    $httpBackend.flush();
    expect(results).toEqual(fakeSearchResults);
  });
});