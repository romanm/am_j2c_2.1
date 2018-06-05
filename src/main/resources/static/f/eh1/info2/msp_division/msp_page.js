init_am_directive.init_msp_page = function($scope, $http){
	console.log('-------msp_page----2------------')
	init_am_directive.ehealth_declaration($scope, $http);

	exe_fn.msp.DataRead()
	$scope.msp_division = {}
	exe_fn.httpGet(
		exe_fn.msp.msp_division.httpGet
	)
	
	$scope.$watch('editDoc',function(){ if($scope.editDoc){
		$scope.mspDoc=$scope.editDoc
	} });

	
	$scope.progr_am.viewes={
		json_form:{
			ngInclude:'/f/eh1/info2/msp_division/msp_page.html',
			dataName:'jsonTemplate',
			heightProcent:85,
		},
	}

}
