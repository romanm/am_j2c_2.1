init_am_directive.init_msp_division = function($scope, $http){
	console.log('-------msp_division----2------------')
	init_am_directive.ehealth_declaration($scope, $http);

	$scope.testDate = new Date()
	
	$scope.progr_am.fn.init_onLoad = function(){
		console.log('-----init_onLoad------------')
		if($scope.request.parameters.division_id){
			exe_fn.jsonEditorRead({
				url_template:'/f/mvp/division_template3.json',
				doc_type:'division',
				docbody_id:$scope.request.parameters.division_id,
			})
		}
	}

	$scope.progr_am.viewes.hrm_menu.seek_placeholder
		='пошук амбулаторії'
	$scope.progr_am.viewes.j2c_table.dataName = 'msp_division'
	$scope.progr_am.msp_division = exe_fn.msp.msp_division

}
