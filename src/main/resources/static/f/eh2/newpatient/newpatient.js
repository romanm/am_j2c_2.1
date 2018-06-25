init_am_directive.init_newpatient = function($scope, $http, $filter, $route) {
	console.log('------init_newpatient---3--------------')
	init_am_directive.ehealth_declaration($scope, $http);
	console.log($scope.progr_am)
	console.log($scope.progr_am.viewes.j2c_table)
	$scope.include = {
		j2c_table_content:'/f/eh2/newpatient/patient_list_j2c_table_content.html',
	}
	$scope.progr_am.viewes.j2c_table.dataName = 'patient_lists'
	$scope.progr_am.viewes.j2c_table.ngInclude= '/f/eh2/j2c_table.html'
	$scope.progr_am.patient_lists = {
		init_data : {
			col_sort : [ 'doc_id', 'last_name', ],
			include_table_menu:'/f/eh2/table_menu.html',
		},
		httpGet : {
			url : '/r/url_sql_read2',
			params : {
				sql : sql2.sql2_patient_lists(),
			},
			then_fn : function(response) {
				console.log(response.data)
				$scope.patient_lists.data = response.data
				$scope.patient_lists.data
				.col_keys = {
					doc_id : 'ІН',
					last_name : 'Фамілія',
					/*
					pip_patient : 'ПІП',
					birth_date : 'дата народженя',
					pip_phisician : 'декларація з лікарем',
					 * */
				}
				/*
				 * $scope.declaration.data=response.data $scope.declaration.data
				 * .col_keys={ person_id:'ІН', pip_patient:'ПІП',
				 * birth_date:'дата народженя', pip_phisician:'декларація з
				 * лікарем', }
				 */
			}
		},
	}
	console.log($scope.progr_am.viewes.j2c_table)
	if ($scope.request.parameters.person_id) {
		console.log('-------45--------------------')
		exe_fn.jsonEditorRead({
			url_template : '/f/mvp/person_template2.json',
			doc_type:'party',
			docbody_id:$scope.request.parameters.person_id,
		})
	}

}
