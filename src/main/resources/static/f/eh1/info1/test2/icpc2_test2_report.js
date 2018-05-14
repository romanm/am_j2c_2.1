init_am_directive.init_icpc2_test2_report = function($scope, $http){
	console.log('------init_am_directive.init_init_icpc2_test2_report-----------------');
	init_read_j2c_tables($scope, $http);

	$scope.initExcelData = function(data){
		if(!$scope.excelData){
			$scope.excelData = {rc:{ r0:4, c0:1}}
			$scope.excelData.rcData = {}
			if($scope.seekParam.physician) {
				$scope.excelData.physician={
					r:2, c:1, d:'physitian name'
				}
				var p = $scope.seekParam.physicianData
				$scope.excelData.physician.d =
					p.family_name+ ' '+
					p.first_name+ ' '+
					p.second_name
			}
		}
		angular.forEach(data, function(data_row,k){
			var rowCells= {}
			console.log(data_row)
			if(data_row.year_day){
				var d = $scope.dayOfYearDate(2018,data_row.year_day)
				console.log(d)
				rowCells[0]='=DATE(2018,'+d.getMonth()+','+d.getDate()+')';
			}else{
				rowCells[0]='*';
			}

			angular.forEach(['cnt','village_10900','and_age017','and_age017_village','home_9776'], function(cellName, cellNr){
				if(data_row[cellName]){
					rowCells[$scope.excelData.rc.c0+cellNr]=data_row[cellName]
					if(data_row[cellName][cellName]){
						rowCells[$scope.excelData.rc.c0+cellNr]=data_row[cellName][cellName]
					}
				}
			})
			$scope.excelData.rcData[$scope.excelData.rc.r0+k]=rowCells
			$scope.excelData.rc.k=k;
		})
		$scope.excelData.rc.r0+=$scope.excelData.rc.k+1;
		console.log($scope.excelData)
	}

	$scope.reportToParam = function(){
		var data = JSON.stringify($scope.excelData); 
		return encodeURIComponent(data);
	}

//	$scope.seekParam.initFromRequest();
//	var app_fn = new App_fn($scope, $http);
	
	$scope.$watch('table.init.report2_table.read_cell',function(newValue){
		if(newValue==Object.keys($scope.table.init.data.cells).length){
			$scope.table.init.read_cell++
		}
	})
	$scope.$watch('table.init.report_table.read_cell',function(newValue){
		if(newValue==Object.keys($scope.table.init.data.cells).length){
			$scope.table.init.read_cell++
		}
	})
	$scope.$watch('table.init.read_cell',function(newValue){
console.log($scope.table.init.read_cell)
		if(newValue==2){
			$scope.initExcelData($scope.table.data)
			$scope.initExcelData($scope.table.data2)
		}
	})
	
	$scope.modal={
		physicianChoose:{}
	}


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
