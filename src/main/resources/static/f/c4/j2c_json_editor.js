app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	init_j2c_json_editor($scope, $http)
	
	$scope.doc_data.readData()
	
	$scope.pageVar.pageName = 'j2c JSON Editor'
	$scope.pageVar.pageParent = {}
	$scope.pageVar.pageParent.url = '/v/create_tables2'
	$scope.pageVar.pageParent.params = function(){
		return "?tableId=" +
				$scope.request.parameters.jsonId +
				""
	} 
})
