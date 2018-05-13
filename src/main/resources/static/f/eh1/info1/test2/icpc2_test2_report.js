init_am_directive.init_icpc2_test2_report = function($scope, $http){
	console.log('------init_am_directive.init_init_icpc2_test2_report-----------------');
	init_read_j2c_tables($scope, $http);

	$scope.initExcelData = function(){
		var r0=3, c0=1;
		$scope.rcData = {}
		angular.forEach($scope.table.data,function(data_row,k){
			var rowCells= {}
			console.log(data_row)
			var d = $scope.dayOfYearDate(2018,data_row.year_day)
			console.log(d)
			rowCells[0]='=DATE(2018,'+d.getMonth()+','+d.getDate()+')';
			console.log(rowCells[0])

			angular.forEach(['cnt','village_10900','and_age017','and_age017_village','home_9776'], function(cellName, cellNr){
				if(data_row[cellName]){
					rowCells[c0+cellNr]=data_row[cellName]
					if(data_row[cellName][cellName]){
						rowCells[c0+cellNr]=data_row[cellName][cellName]
					}
				}
			})
			$scope.rcData[r0+k]=rowCells
		})
		console.log($scope.rcData)
	}

	$scope.reportToParam = function(){
		var data = JSON.stringify($scope.rcData); 
		return encodeURIComponent(data);
	}

//	$scope.seekParam.initFromRequest();
//	var app_fn = new App_fn($scope, $http);
	
	$scope.$watch('table.init.report_table.read_cell',function(newValue){
		if(newValue==Object.keys($scope.table.init.data.cells).length){
			$scope.initExcelData()
		}
	})
	
	$scope.modal={
		physicianChoose:{}
	}
	$scope.$watch('seekParam.physician',function(newValue){if(newValue){
		console.log(newValue)
		$http.get(url_sql_read,{params:{person_id:newValue, 
			sql:sql2.f74_physician__select()}}).then(function(response) {
				console.log(response.data)
				$scope.seekParam.physicianData = response.data.list[0];
			})
	}})

	$scope.$watch('modal.physicianChoose.display',function(newValue){if(newValue){
		if(newValue.display){
			console.log(app_fn.getMsp_id())
			$http.get(url_sql_read,{params:{msp_id:$scope.params.msp_id, 
				sql:sql2.f74_msp_physician__select()}}).then(function(response) {
					console.log(response.data)
					$scope.modal.physicianChoose.data = response.data;
			})

		}
	}})

}
