init_am_directive.init_declaration = function($scope, $http){
	console.log('------init_declaration1-----------------')
	init_am_directive.ehealth_declaration($scope, $http);

	$scope.progr_am.viewes.hrm_menu.seek_placeholder
		='пошук пацієнта'

	$scope.progr_am.viewes.j2c_table.dataName='declaration'
	$scope.progr_am.declaration={
		init_data:{
			row_key:'person'+'_id',
			include_cols:'/f/eh1/info2/declaration1/declaration_cols.html',
			col_sort:['person_id', 'pip', 'birth_date'],
		},
		httpGet:{ url:'/r/url_sql_read2',
			params:{
				sql:sql2.sql2_patient_persons()
			},
			then_fn:function(response) {
				$scope.declaration.data=response.data
				$scope.declaration.data
				.col_keys={
					person_id:'ІН',
					pip:'ПІП',
					birth_date:'дата народженя'
				}
			}
		},
	}

}
