app.controller('ControllerDB', function($scope, $http) {
	console.log('-------ControllerDB--------');
	console.log({
		fn_lib:fn_lib
		, init_am_directive:init_am_directive
	});
	$scope.algoritmed = { programs:{} ,htmls:{} ,dbs:{} ,inits:{} };
	var programGUI = new ProgramGUI($scope, $http);
	programGUI.program_folder.http_get();
});
