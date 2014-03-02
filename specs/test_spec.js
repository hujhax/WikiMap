describe("Dummy test suite", function() {
  it("True should be equal to true.", function() {
    expect(true).toBe(true);
  });
});

describe("Testing the WikiMap controller", function() {
    // create a mock app module
    beforeEach(module('wikiApp'));  
 
    // create a mock wikiAPI service
    beforeEach(module(function ($provide) {
     var mockWikiAPI = $provide.value('wikiAPI', { 
         search: function() {return ['Kitten']}
     });
   	}));

    // test the controller
    describe("WikiSearch", function() {
        var scope;
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            $controller("WikiSearch", { 
                $scope: scope
            });
        }));
 
        it("Default search text should be 'kitten'", function() {
            expect(scope.searchText).toBe("Kitten");
        });
    });
});
