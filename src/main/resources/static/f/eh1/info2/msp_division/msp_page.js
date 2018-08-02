init_am_directive.init_msp_page3 = function($scope, $http){
	init_am_directive.init_msp_page($scope, $http)	
}
init_am_directive.init_msp_page = function($scope, $http){
	console.log('-------msp_page----2------------')
	init_am_directive.ehealth_declaration($scope, $http);

	$scope.msp_division = {}
	var params = {
		sql:sql2.sql2_msp_divisions_select(),
		msp_id:723,
	}
	$scope.$watch('principal',function(){ 
		if($scope.principal){
			console.log($scope.principal)
			if($scope.principal.user_msp && $scope.principal.user_msp[0]){
				params.msp_id = 
				($scope.principal.user_msp[0].msp_id)
			}
			console.log(exe_fn.msp.msp_id)
			read_msp_division()
		}
	})
	
	function read_msp_division(){
		exe_fn.msp.DataRead(params.msp_id)
		exe_fn.httpGet( exe_fn.httpGet_j2c_table_params_then_fn(
			params,
			function(response) {
				$scope.msp_division.data=response.data
				$scope.msp_division.data
				.col_keys={
						division_id:'ІН',
						name:'Назва',
						address:'Адреса',
				}
				angular.forEach($scope.msp_division.data.list, function(v){
					v.docbody = JSON.parse(v.docbody)
				})
				console.log($scope.msp_division)
			}
		))
/*
		exe_fn.httpGet(
			exe_fn.msp.msp_division.httpGet
		)
 * */
	}
	
	$scope.$watch('editDoc',function(){ if($scope.editDoc){
		$scope.mspDoc=$scope.editDoc
	} });
	
	$scope.progr_am.viewes={
		json_form:{
			ngInclude:'/f/eh1/info2/msp_division/msp_page.html',
			dataName:'jsonTemplate',
//			heightProcent:85,
		},
	}

}
