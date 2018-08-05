init_am_directive.init_msp_division4 = function($scope, $http){
	console.log('-------msp_division4----2------------')
	init_am_directive.ehealth_declaration($scope, $http);
	$scope.progr_am.viewes.j2c_table.ngInclude = '/f/eh2/j2c_table.html'
	$scope.progr_am.viewes.j2c_table.dataName  = 'msp_division'
	init_msp_division_data($scope, $http)
	if($scope.request.parameters.division_id){
		exe_fn.jsonEditorRead
		({	
			url_template:'/f/mvp/division_template3.json',
			doc_type:'division',
			docbody_id:$scope.request.parameters.division_id,
		})
	}
}
var init_msp_division_data = function($scope, $http){
	$scope.msp_division = {}
	$scope.msp_division.include_table_menu = '/f/eh2/table_menu2.html'
	// /f/eh1/lib/table_menu.html
//	$scope.progr_am.msp_division.include = {
	$scope.msp_division.include = {
		j2c_table_content : '/f/eh1/info2/msp_division/msp_division_content.html',
	}
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
//		exe_fn.msp.DataRead(params.msp_id)
		console.log(params)
		exe_fn.httpGet( exe_fn.httpGet_j2c_table_params_then_fn(
			params,
			function(response) {
				$scope.msp_division.data=response.data
				$scope.data.msp_division = $scope.msp_division
				$scope.msp_division.
				col_sort = ['division_id', 'name', 'address'],
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
	return params
}
init_am_directive.init_msp_page3 = function($scope, $http){
	init_am_directive.init_msp_page($scope, $http)	
}
init_am_directive.init_msp_page = function($scope, $http){
	console.log('-------msp_page----2------------')
	init_am_directive.ehealth_declaration($scope, $http);
	var params = init_msp_division_data($scope, $http)
	exe_fn.msp.DataRead(params.msp_id)
	
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
