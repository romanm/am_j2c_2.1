init_am_directive.init_msp_data = function($scope, $http){
	console.log('-------msp_data----2------------')
	init_am_directive.ehealth_declaration($scope, $http);

	$scope.progr_am.viewes={
		json_form:{ngInclude:'/f/eh1/info2/hrm_cards/json_form1.html',
			dataName:'jsonTemplate',
			heightProcent:85,
		},
	}

}
