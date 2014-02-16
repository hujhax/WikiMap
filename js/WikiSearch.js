function WikiController($scope) {
	$scope.searchText = "Angular Text";
	$scope.textChange = function() {
		alert($scope.searchText);
	};
}