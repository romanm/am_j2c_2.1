app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	
	$scope.pageVar.pageName = 'j2c JSON Editor'
	$scope.pageVar.pageParent = {}
	$scope.pageVar.pageParent.url = '/v/create_tables2'
	$scope.pageVar.pageParent.params = function(){
		return "?tableId=" +
				$scope.request.parameters.jsonId +
				""
	}
	init_j2c_json_editor($scope, $http)

	if($scope.request.parameters.tab1){
		$scope.pageVar.config.viewDocPart=$scope.request.parameters.tab1
	}

	if($scope.request.parameters.jsonId)
		var docId = $scope.request.parameters.jsonId
	else if($scope.tables.list[0].doc_id)
		var docId = $scope.tables.list[0].doc_id
	$scope.doc_data_workdata = {docId : docId,}
	console.log($scope.doc_data_workdata)
	$scope.doc_data.docId = docId
	$scope.doc_data.readData({docId:docId}, $scope.doc_data_workdata)
	//$scope.doc_data.readData({docId:docId}, $scope.doc_data)
})
