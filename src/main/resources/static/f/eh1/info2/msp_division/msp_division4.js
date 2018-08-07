init_am_directive.init_msp_division4 = function($scope, $http){
	console.log('-------msp_division4----2------------')
	init_am_directive.ehealth_declaration($scope, $http);
	var data = {
		msp_id:723,
		sql:sql2.sql2_msp_divisions_select(),
	}
	$scope.$watch('principal',function(){ if($scope.principal){
		if($scope.principal.principal){
			data.msp_id = $scope.principal.msp_id; 
		}
		console.log(data)
	} });
}
