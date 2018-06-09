init_am_directive.init_admin = function($scope, $http, $filter){
	console.log('-------admin----2------------')
	$scope.backupDb = function(){
		console.log('$scope.backupDb ')
		var sqlBackupFile = 
			$scope.path_data.backup_db_path + $scope.file_name 

		var data={sqlBackupFile:sqlBackupFile}
		console.log(data)
		console.log(exe_fn)
		exe_fn.httpPost
		({	url:'/backup_db_path',
			then_fn:function(response) {
				console.log(response.data)
			},
			data:data,
		})
	}

	$scope.newDate = new Date()
	var md = $filter('date')($scope.newDate, 'yyyy.MM.dd_hh:mm:ss')
	$scope.file_name = 'backup-sql-' + md +'.sql'
	console.log(md)
	$scope.$watch('principal',function(){
		$http.get('/backup_db_path').then( function(response){
			$scope.path_data=response.data
		})
	});

}