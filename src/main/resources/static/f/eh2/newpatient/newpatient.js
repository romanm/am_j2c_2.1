init_am_directive.init_newpatient = function($scope, $http, $filter, $route) {
	console.log('------init_newpatient---3--------------')
	init_am_directive.ehealth_declaration($scope, $http);
	console.log($scope.progr_am)
	$scope.include = {
		j2c_table_content:'/f/eh2/newpatient/patient_list_j2c_table_content.html',
	}
	$scope.progr_am.viewes.j2c_table.dataName = 'patient_lists'
	$scope.progr_am.viewes.j2c_table.ngInclude= '/f/eh2/j2c_table.html'

	exe_fn.init_j2c_table_seek('sql2_patient_lists', $scope.request.parameters.person_id)
	exe_fn.httpGet_j2c_table_params = function(params){
		return exe_fn.httpGet_j2c_table_params_then_fn(
		params,
		function(response) {
			$scope.patient_lists.data = response.data
			$scope.patient_lists.data
			.col_keys = {
				person_id : 'ІН',
				pip_patient : 'ПІП',
				birth_date : 'дата народженя',
				email: 'e-mail'
			}
			init_f74_ngClick($scope.patient_lists, $scope, $http);
		})
	}

	var params = { sql : sql2.sql2_patient_lists(), }
	if($scope.request.parameters.person_id){
		var seek = $scope.request.parameters.seek?$scope.request.parameters.seek:''
		var params = { 
			sql : sql2.sql2_patient_lists_seek_withId(), 
			id:$scope.request.parameters.person_id,
			seek:'%'+seek+'%'
		}
		exe_fn.jsonEditorRead({
			url_template : '/f/mvp/party_template2.json',
			doc_type:'party',
			docbody_id:$scope.request.parameters.person_id,
		})
	}

	$scope.progr_am.patient_lists = {
		init_data:{
			col_sort:['person_id',  'pip_patient', 'birth_date', 'email'],
			include_table_menu:'/f/eh2/table_menu.html',
		},
		httpGet : exe_fn.httpGet_j2c_table_params(params),
	}

	$scope.initDocToPerson = false
	$scope.$watchGroup(['editDoc', 'patient_lists.data'],
	function(newValue, oldValue){
		if(newValue[0]&&newValue[1]&&!$scope.initDocToPerson){
			$scope.initDocToPerson = true;
			console.log(newValue)
			if($scope.request.parameters.person_id){
				$scope.patient_lists.selectedCell={
					row_id:$scope.request.parameters.person_id,
				}

				angular.forEach($scope.patient_lists.data.list,function(v){
					if(v.row_id==$scope.request.patient_lists.selectedCell.row_id){
						$scope.patient_lists.selectedCell.row=v
					}
				})
				var e = $scope.editDoc,
					r = $scope.patient_lists.selectedCell.row
				personCols.forEach(function(k){ e[k]=r[k] })
			}
		}
	});
	
	var personCols = ['last_name','first_name', 'second_name'];

	$scope.progr_am.fn.saveAddData=function(data){
		console.log('-----------------------')
		console.log(data)
		personCols.forEach(function(k){
			data[k]=$scope.editDoc[k]
		})
		data.sql=sql2.sql2_docbodyPerson_updateById()
		data.dataAfterSave = function(response){
			var e = response.data.list2[0],
				r = $scope.patient_lists.selectedCell.row
			r.pip_patient = e.pip_patient
		}
	}

}
