init_am_directive.init_hrm_cards2 = function($scope, $http){
	init_am_directive.ehealth_declaration($scope, $http);
	console.log($scope.progr_am.viewes.j2c_table)
	
	console.log(123)

	var personCols = ['last_name','first_name', 'second_name', 'email', 'birth_date'];
	$scope.progr_am.fn.saveAddData = function(data){
		$scope.progr_am.fn.saveAddParty(data)
	}

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

	$scope.progr_am.fn.j2c.isSelected_row=function(){
		return $scope.editDoc && $scope.editDoc.doc_id==$scope.request.parameters.person_id;
	}
	$scope.progr_am.fn.j2c.remove_row=function(){
		console.log('-------j2c.remove_row--------27----------')
		exe_fn.httpPost
		({	then_fn:function(response) {
				window.location.replace('?division_id='
				+ $scope.request.parameters.division_id
				)
			},
			data:{
				sql:sql2.sql2_docByIdAndParent_delete(),
				doc_id:$scope.request.parameters.person_id,
			},
			url:'/r/url_sql_update2',
		})
	}
	$scope.progr_am.fn.j2c.add_row=function(){
		console.log('------j2c.add_row--------16----------')
		var docbody = {party:{
			last_name:'<Призвище>',
		}}
		exe_fn.httpPost
		({	url:'/r/url_sql_update2',
			data:{
				sql:sql2.sql2_hrmCard_insert(),
				doctypeEmployee:13,
				doctypeMsp:23,
				msp_id:exe_fn.msp.msp_id,
				family_name:docbody.party.last_name,
				docbody:JSON.stringify(docbody), 
				password:guid(),
			},
			then_fn:function(response) 
			{window.location.replace(
				'?person_id=' + response.data.nextDbId1		
			)},
		})
	}

	exe_fn.msp.msp_id=188
	
	$scope.progr_am.hrm_cards={
		init_data:{
//			row_key:'person_id',
			col_sort:['person_id', 'family_name', 'pip']
		},
		httpGet:{ url:'/r/read2_sql_with_param',
			params:{
				sql:'sql.msp_employee.list',msp_id:exe_fn.msp.msp_id //188
			},
			then_fn:function(response) {
//			console.log(response.data)
				$scope.hrm_cards.data=response.data
				delete $scope.hrm_cards[$scope.hrm_cards.sql]
				delete $scope.hrm_cards.sql
//			console.log($scope.hrm_cards)
				$scope.hrm_cards.data
				.col_keys={
					person_id:'ІН',
					family_name:'Фамілія',
					pip:'ПІП'
				}
			}
		},
	}

	$scope.progr_am.fn.row_key='person_id',
	$scope.progr_am.viewes.j2c_table.dataName='hrm_cards'

	$scope.progr_am.viewes.hrm_menu.seek_placeholder
		='пошук картки працівника'
	$scope.progr_am.fn.groupsToEdit='doctor|'

}
