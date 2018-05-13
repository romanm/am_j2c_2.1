
init_am_directive.init_icpc2_test2_report_print = function($scope, $http){
	console.log('------init_icpc2_test2_report_print-----------------');
	init_read_j2c_tables($scope, $http);
	
	$scope.columnNumbers = ['A',1,2,3,4,5,6,7,8,9,10,11,12]
	$scope.columnDataKey = {
		A:'createdDay',
		1:'cnt',
		2:'village_10900',
		3:'and_age017',
		4:'and_age017_village',
		9:'home_9776',
	}
}
