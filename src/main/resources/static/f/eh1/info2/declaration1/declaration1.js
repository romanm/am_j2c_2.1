init_am_directive.init_declaration = function($scope, $http){
	console.log('------init_declaration1-----------------')
	init_am_directive.ehealth_declaration($scope, $http);

	$scope.progr_am.fn.init_onLoad = function(){
		console.log('-----init_onLoad------------')
		if($scope.request.parameters.person_id){
			exe_fn.jsonEditorRead({
				url_template:'/f/mvp/declaration_template2.json',
				doc_type:'declaration',
				docbody_id:$scope.request.parameters.person_id,
			})
		}
	}
	
	$scope.progr_am.viewes.hrm_menu.seek_placeholder
		='пошук пацієнта'

	$scope.progr_am.viewes.j2c_table.dataName='declaration'
	$scope.progr_am.declaration={
		init_data:{
			row_key:'person'+'_id',
			include_cols:'/f/eh1/info2/declaration1/declaration_cols.html',
			col_sort:['person_id', 'pip', 'birth_date', 'pip_phisician'],
		},
		httpGet:{ url:'/r/url_sql_read2',
			params:{
				sql:sql2.sql2_patient_and_declaration(), //sql2.sql2_patient_persons(),
			},
			then_fn:function(response) {
				$scope.declaration.data=response.data
				console.log($scope.declaration.data)
				$scope.declaration.data
				.col_keys={
					person_id:'ІН',
					pip:'ПІП',
					birth_date:'дата народженя',
					pip_phisician:'декларація з лікарем',
				}
			}
		},
	}

}
