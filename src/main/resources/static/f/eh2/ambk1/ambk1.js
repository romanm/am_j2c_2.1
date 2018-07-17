init_am_directive.init_ambk = function($scope, $http, $filter, $route) {
	init_am_directive.patient_doc($scope, $http, $filter, $route)
	$scope.include.copyright = '/f/eh2/abk1/copyright_icpc2.html'
	console.log($scope.progr_am.icpc2_nakaz74)
	console.log($scope.progr_am.viewes)
	console.log($scope.progr_am.patient_lists)
	$scope.progr_am.viewes.json_form.ngInclude = '/f/eh2/abk1/abk1.html'
	$scope.progr_am.viewes.json_form.dataName  = 'icpc2_nakaz74'

	$scope.include.icpc2_cell_dropdown_content =
			'/f/eh2/icpc2_test4/icpc2_cell_dropdown_content_o74.html'
	
	if($scope.request.parameters.person_id){
		var params = {
			sql:sql3.f74_read_patient_records2(),
			table_id:9774,
			msp_id:188,
			person_id:$scope.request.parameters.person_id,
		}
		exe_fn.httpGet(exe_fn.httpGet_j2c_table_params_then_fn(
		params,
		function(response) {
			$scope.isPatientSelected = true
			$scope.icpc2_nakaz74.data = {}

			$scope.icpc2_nakaz74.data.list
				= response.data.list
			var lastDay = ''
			var selectedCell
			angular.forEach($scope.icpc2_nakaz74.data.list,function(v, key){
				var mapDateKey = $filter('date')(v.created, 'longDate')
				if(lastDay!=mapDateKey){
					lastDay=mapDateKey
					v.dayDate = mapDateKey
				}
				selectedCell = {row:v,row_k:key}
			})
			console.log($scope.icpc2_nakaz74)
			$scope.icpc2_nakaz74.selectedCell = selectedCell
			console.log($scope.icpc2_nakaz74.selectedCell)
			init_f74_ngClick($scope.progr_am.icpc2_nakaz74, $scope, $http)
		}))
	}

}
