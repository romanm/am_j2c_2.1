init_am_directive.init_msp_division = function($scope, $http){
	console.log('-------msp_division----2------------')
	init_am_directive.ehealth_declaration($scope, $http);
	
	$scope.eHealth.pageGroup();
	
	$scope.progr_am.viewes.hrm_menu.seek_placeholder
		='пошук амбулаторії'
}
