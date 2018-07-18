//console.log('------hrm_cards.js---------------')
init_am_directive.init_hrm_cards = function($scope, $http){
//	console.log('----init_am_directive.hrm_cards------------')
//	console.log(CRC32(JSON.stringify({a:1})))
	init_am_directive.ehealth_declaration($scope, $http);
	
	$scope.progr_am.fn.init_onLoad = function(){
		console.log('-----init_onLoad------------')
		if($scope.request.parameters.person_id){
			
			exe_fn.jsonEditorRead({
				url_template:'/f/mvp/employee_template2.json',
				doc_type:'employee',
				docbody_id:$scope.request.parameters.person_id,
			});

		}
	}
	
	$scope.$watch('progr_am.viewes.hrm_menu.seek',function(seek){if(seek){
		console.log(seek)
	}})
	
	$scope.progr_am.viewes.j2c_table.dataName='hrm_cards'
	$scope.progr_am.hrm_cards={
		init_data:{
			row_key:'person_id',
			col_sort:['person_id', 'family_name', 'pip']
		},
		httpGet:{
			url:'/r/read2_sql_with_param',
			params:{
				sql:'sql.msp_employee.list',msp_id:188
			},
			then_fn:function(response) {
//				console.log(response.data)
				$scope.hrm_cards.data=response.data
				delete $scope.hrm_cards[$scope.hrm_cards.sql]
				delete $scope.hrm_cards.sql
//				console.log($scope.hrm_cards)
				$scope.hrm_cards.data
				.col_keys={
						person_id:'ІН',
						family_name:'Фамілія',
						pip:'ПІП'
				}
			}
		},
	}

	$scope.progr_am.hrm_cards.fn={}

	$scope.progr_am.fn.init_principal = function(){
		if($scope.principal.msp_id){
			$scope.progr_am.hrm_cards.httpGet.params.msp_id
				= $scope.principal.msp_id
		}
	}

	$scope.progr_am.viewes={
		json_form:{ngInclude:'/f/eh1/info2/hrm_cards/json_form1.html',
			dataName:'jsonTemplate',
			heightProcent:65,
		},
		hrm_menu:{ngInclude:'/f/eh1/info2/hrm_cards/hrm_menu.html',
			seek_placeholder:'пошук картки працівника',
			seek:null,
		},
		j2c_table:{ngInclude:'/f/eh1/info2/hrm_cards/j2c_table.html',
			dataName:'hrm_cards',
			heightProcent:22,
		},
	},

	$scope.progr_am.fn.groupsToEdit='doctor|',

}

