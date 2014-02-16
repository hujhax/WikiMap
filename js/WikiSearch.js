function WikiController($scope) {
	$scope.searchText = "Kitten";
	$scope.items = [];
	$scope.textChange = function() {
		$scope.items=[$scope.searchText+' 1',$scope.searchText+' 2',$scope.searchText+' 3']
	};
}