console.log('------login1.js-----------------');
init_am_directive.init_registry2=function($scope, $http){
	console.log('------init_am_directive.init_registry2-----------------');
	var data={sql:'sql2.users.activateLogin',uuid:$scope.request.parameters.uuid}
	$http.post('/r/update2_sql_with_param', data).then(function(response) {
		console.log(response.data);
	});
}

init_am_directive.init_registry1=function($scope, $http){
	
	init_am_directive.initObj_registry($scope, $http);
	$scope.registry.saveRegistry=function(){
		console.log('-------14----------------')
		this.data.sql='sql2.users.insert'
		this.data.doctype=13 //employee
		this.data.role='ROLE_WAITING_FOR_CONFIRMATION'
		this.data.uuid='uuid'
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
