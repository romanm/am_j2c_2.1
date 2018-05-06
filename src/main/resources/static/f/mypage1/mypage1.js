console.log('------mypage.js-----------------');
init_am_directive.init_mypage = function($scope, $http){
	console.log('------init_am_directive.init_mypage-----------------');
	$scope.tabs1=[
		{f:'seek_physician',t:'Налаштунки'},
		{f:'personal_data_edit',t:'Змінити власні дані'},
		];
	$scope.clickPart1 = function(page1Fragment){
		$scope.page1Fragment=page1Fragment;
//		var page1=$scope.urlFragment();
		console.log(page1Fragment);
		if(init_am_directive['init_part_'+page1Fragment])
			init_am_directive['init_part_'+page1Fragment]($scope, $http)
	}
}
init_am_directive.init_part_personal_data_edit=function($scope, $http){
	console.log('------init_am_directive.init_part_personal_data_edit-----------------');
	init_am_directive.initObj_registry($scope, $http);
	$scope.registry.data=$scope.principalUser
	console.log($scope.registry.data);
	console.log($scope.registry.data.birth_date);
	console.log(new Date($scope.registry.data.birth_date))
	$scope.registry.set_ddmmyyy_param_from_date('birth_date1', new Date($scope.registry.data.birth_date));
	delete $scope.registry.data.birth_date
	$scope.registry.saveRegistryUpdate = function(){
		console.log('------23-----------------------');
		console.log($scope.registry.data);
		this.data.sql='sql2.person.update1'
		this.saveRegistrySql();
	}
}
