init_am_directive.init_declaration3 = function($scope, $http){
	console.log('------init_declaration3---2--------------')
	init_am_directive.init_declaration($scope, $http)
	console.log($scope.progr_am.viewes.j2c_table)
	console.log($scope.progr_am)
}

init_am_directive.init_declaration = function($scope, $http){
	console.log('------init_declaration--7---------------')
	init_am_directive.ehealth_declaration($scope, $http);

	exe_fn.init_j2c_table_seek('sql2_patient_and_declaration', $scope.request.parameters.person_id)
	//exe_fn.init_j2c_table_seek('sql2_physician_declaration')

	exe_fn.httpGet_j2c_table_params = function(params){
		return exe_fn.httpGet_j2c_table_params_then_fn(
		params, 
		function(response) {
			$scope.declaration.data = response.data
			console.log($scope.declaration.data)
			$scope.declaration.data
			.col_keys = {
				person_id:'ІН',
				pip_patient:'ПІП Пацієнта',
				birth_date:'дата народженя',
				pip_phisician:'декларація з лікарем',
			}
		})
	}

	var params = {
		sql:sql2.sql2_patient_and_declaration(),
	}

	if($scope.request.parameters.person_id){
		$scope.progr_am.viewes.hrm_menu.seek
			= decodeURIComponent($scope.request.parameters.seek)
		var params = { 
			sql : sql2.sql2_patient_and_declaration_seek_withId(), 
			id:$scope.request.parameters.person_id,
			seek:'%'+$scope.progr_am.viewes.hrm_menu.seek+'%'
		}
	}else
	if($scope.request.parameters.seek){
		$scope.progr_am.viewes.hrm_menu.seek
			= decodeURIComponent($scope.request.parameters.seek)
		params = 
		{
			sql:sql2.sql2_physician_declaration_seek(), 
			seek:'%'+$scope.progr_am.viewes.hrm_menu.seek+'%'
		}
	}
	console.log(params)

	$scope.progr_am.declaration={
		init_data:{
//			row_key:'declaration',
			include_cols:'/f/eh1/info2/declaration1/declaration_cols.html',
			col_sort:['person_id', 'pip_patient', 'birth_date', 'pip_phisician'],
		},
		httpGet:exe_fn.httpGet_j2c_table_params(params),
	}

	$scope.progr_am.fn.init_onLoad = function(){
		console.log('-----init_onLoad------------')
		if($scope.request.parameters.declaration){
			exe_fn.jsonEditorRead({
				url_template:'/f/mvp/declaration_template2.json',
				doc_type:'declaration',
				docbody_id:$scope.request.parameters.declaration,
			})
		}
	}
	
	$scope.progr_am.fn.isEditRow = function(row){
		if($scope.request.parameters.declaration){
			if(row.declaration == $scope.request.parameters.declaration){
				return true
			}
		}else if($scope.request.parameters.person_id){
			if(row.person_id == $scope.request.parameters.person_id){
				console.log('-----74-------------')
				return true
			}
		}
		return false
	}
	
	$scope.progr_am.viewes.j2c_table.dataName='declaration'
	$scope.progr_am.viewes.hrm_menu.seek_placeholder
		='пошук пацієнта'

}
