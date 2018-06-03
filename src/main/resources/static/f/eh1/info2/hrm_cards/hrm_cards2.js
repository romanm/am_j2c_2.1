init_am_directive.init_hrm_cards2 = function($scope, $http){
	init_am_directive.ehealth_declaration($scope, $http);
	
	$scope.progr_am.fn.init_principal = function(){
		if($scope.principal.msp_id){
			$scope.progr_am.hrm_cards.httpGet.params.msp_id
				= $scope.principal.msp_id
		}
	}

	$scope.progr_am.fn.init_onLoad = function(){
		console.log('-----init_onLoad------------')
		if($scope.request.parameters.person_id){
			exe_fn.jsonEditorRead({
				url_template:'/f/mvp/employee_template2.json',
				doc_type:'employee',
				docbody_id:$scope.request.parameters.person_id,
			})

		}
	}

	$scope.progr_am.fn.groupsToEdit='doctor|',
	$scope.progr_am.viewes.j2c_table.dataName='hrm_cards'
	$scope.progr_am.hrm_cards={
		init_data:{
			row_key:'person_id',
			col_sort:['person_id', 'family_name', 'pip']
		},
		httpGet:{ url:'/r/read2_sql_with_param',
			params:{
				sql:'sql.msp_employee.list',msp_id:188
			},
			then_fn:function(response) {
//					console.log(response.data)
				$scope.hrm_cards.data=response.data
				delete $scope.hrm_cards[$scope.hrm_cards.sql]
				delete $scope.hrm_cards.sql
//					console.log($scope.hrm_cards)
				$scope.hrm_cards.data
				.col_keys={
						person_id:'ІН',
						family_name:'Фамілія',
						pip:'ПІП'
				}
			}
		},
	}

}
