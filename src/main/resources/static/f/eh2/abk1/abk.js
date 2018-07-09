init_am_directive.init_abk = function($scope, $http, $filter, $route) {
	init_am_directive.ehealth_declaration($scope, $http, $filter);
	console.log($scope.progr_am.viewes.objKeys())
	console.log($scope.progr_am.viewes)
	$scope.progr_am.viewes={
		json_form:{
			ngInclude:'/f/eh2/abk1/abk1.html',
			dataName:'abk',
			heightProcent:65,
		},
	}
	addViews_abk_MenuJ2c()
	$scope.include.add_j2c_menu = '/f/eh2/abk1/add_j2c_menu.html'
	$scope.include.copyright = '/f/eh2/abk1/copyright_icpc2.html'

	$scope.progr_am.abk = {}
	init_f74_ngClick($scope.progr_am.abk, $scope, $http)
	console.log($scope.progr_am.abk)
		
	$scope.work_abk_record = function(){
		console.log($scope.icpc2_nakaz74.selectedCell)
		console.log('-----17-------')
	}
	
	$scope.read_allpatient_records = function(){
		var params = {
			sql:sql3.f74_read_allpatient_records(),
			table_id:9774,
			msp_id:188,
		}
		exe_fn.httpGet(exe_fn.httpGet_j2c_table_params_then_fn(
		params,
		function(response) {
			$scope.icpc2_nakaz74.data.list
				= response.data.list
		}))
		$scope.isPatientSelected = false;
	}

	$scope.$watch('progr_am.icpc2_nakaz74.selectedCell',function(newValue){if(newValue){
		console.log('-------- read patient racords --------------')
		console.log($scope.progr_am.icpc2_nakaz74.selectedCell)
		$scope.read_patient_records()
	}})
	
	$scope.isPatientSelected = false;
	
	$scope.read_patient_records = function(){
		$scope.isPatientSelected = true;
		console.log($scope.icpc2_nakaz74.selectedCell)
		var row_patient_cell_id = $scope.icpc2_nakaz74.selectedCell.row.col_10766_id
		console.log(row_patient_cell_id)
		var params = {
			sql:sql3.f74_read_patient_records(),
			table_id:9774,
			msp_id:188,
			row_patient_cell_id:row_patient_cell_id,
		}
		exe_fn.httpGet(exe_fn.httpGet_j2c_table_params_then_fn(
		params,
		function(response) {
			$scope.icpc2_nakaz74.data.list
				= response.data.list
				var lastDay = ''
				angular.forEach($scope.icpc2_nakaz74.data.list,function(v, key){
					console.log(key)
					var mapDateKey = $filter('date')(v.created, 'longDate')
					if(lastDay!=mapDateKey){
						lastDay=mapDateKey
						console.log(mapDateKey)
						v.dayDate = mapDateKey
					}

				})
			/*
				console.log($scope.icpc2_nakaz74)
				console.log($scope.icpc2_nakaz74.data.list)
				console.log(response.data)
				console.log(response.data.list)
			 * */
		}))
	}
}
