init_am_directive.init_hrm_cards2 = function($scope, $http){
	init_am_directive.ehealth_declaration($scope, $http);
	
	$scope.progr_am.fn.init_principal = function(){
		if($scope.principal.msp_id){
			$scope.progr_am.hrm_cards.httpGet.params.msp_id
				= $scope.principal.msp_id
		}
	}

	$scope.progr_am.hrm_cards={
		fn:{
			calcEditDoc_CRC32(){
				$scope.editDoc_CRC32 = exe_fn.calcJSON_CRC32($scope.editDoc) 
			},
			isEditRow:function(row){
				return row.person_id
				== $scope.request.parameters.person_id
			},
		},
		init_data:{
			col_sort:['person_id', 'family_name', 'pip']
		},
		httpGet:{
			url:'/r/read2_sql_with_param',
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
