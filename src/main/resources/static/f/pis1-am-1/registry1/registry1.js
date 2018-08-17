console.log('------login1.js-----------------');
init_am_directive.init_hrm_new_hr=function($scope, $http){
	console.log('------3----------------')
	init_am_directive.ehealth_declaration($scope, $http);
	init_am_directive.init_registry1($scope, $http);	
	$scope.progr_am.employee_role = 'ROLE_USER'

	$scope.registry.saveRegistry = function(){
		console.log('-------14----------------')
		this.data.sql='sql2.add_user_with_msp'
		this.data.doctype=13 //employee
		this.data.role = $scope.progr_am.employee_role
		this.data.uuid = 'uuid'
		this.data.msp_id = $scope.principal.user_msp[0].msp_id
		this.data.enable = true
		
		this.saveRegistrySql();
	}

	$scope.registry.generatePassword = function(){
		console.log("---------generatePassword------------------")
		console.log(this.data)
		$scope.registry.generatePasswordError = {}
		if(!this.data.family_name){
			$scope.registry.generatePasswordError.family_name 
				= 'Фамілія не введена'
		}
		if(!this.data.first_name){
			$scope.registry.generatePasswordError.first_name 
				= 'Імʼя не введена'
		}
		if(!this.data.second_name){
			$scope.registry.generatePasswordError.second_name 
				= 'По батькові не введена'
		}
		console.log($scope.registry.generatePasswordError)
		if(0 == Object.keys($scope.registry.generatePasswordError)){
			delete $scope.registry.generatePasswordError
			this.data.username = ''
			+ this.data.family_name.substring(0,1)
			+ this.data.first_name.substring(0,1)
			+ this.data.second_name.substring(0,1)
			this.data.password1 = this.data.username  + '123'
		}
	}

	exe_fn.roles_data_list()

}

init_am_directive.init_registry2=function($scope, $http){
	console.log('------init_am_directive.init_registry2-----------------');
	var data={sql:'sql2.users.activateLogin',uuid:$scope.request.parameters.uuid}
	$http.post('/r/update2_sql_with_param', data).then(function(response) {
		console.log(response.data);
	});
}

init_am_directive.init_registry1=function($scope, $http){

	init_am_directive.initObj_registry($scope, $http);
	$scope.registry.saveRegistry = function(){
		console.log('-------14----------------')
		this.data.sql='sql2.users.insert'
		this.data.doctype=13 //employee
		this.data.role='ROLE_WAITING_FOR_CONFIRMATION'
		this.data.uuid='uuid'
		this.data.enable = false

		this.saveRegistrySql();
	}

	var url_read_sql_with_param = '/r/read2_sql_with_param';

	$scope.registry.checkUserName=function(){
		var thisDataObj = this;
		console.log(thisDataObj.data.username)
		$http.get(url_read_sql_with_param,{params:{sql:'sql2.users.selectUserName', username:this.data.username}}).then(function(response) {
			console.log(response.data.list)
			if(response.data.list.length){
				thisDataObj.error.username='Імʼя користувача "'+thisDataObj.data.username+'" вже використовується, обиріть інший логін.'
			}else{
				delete thisDataObj.error.username
			}
		});
	}
	
	$scope.registry.passwordControlle=function(){
		console.log(this.data.password1)
		console.log(this.data.password2)
		if(this.data.password1!=this.data.password2){
			this.error.password='Пароль повторне введенн не співпадає з першим.'
		}else{
			delete this.error.password
		}
	}

}
