var app = angular.module('app', ['ngSanitize']);
var init_am_directive = {};
app.controller('ControllerApp1', function($scope, $http) {
	console.log('-------ControllerApp1--------');
	console.log($scope)
	
//	console.log(request)
	init_am_directive.init_programRuns($scope, $http);
});

init_am_directive.init_programRuns=function($scope, $http){
	console.log('-------init_am_directive.init_programRuns--------');
	onLoadPage($scope);
	console.log(request.viewKey)
	if(init_am_directive['init_'+request.viewKey])
		init_am_directive['init_'+request.viewKey]($scope, $http);
	$http.get('/r/principal').then(function(response) {
		$scope.principal = response.data.principal;
		$scope.principalUser = response.data.user;

		console.log($scope.principal)
		if($scope.principal){
			$scope.principal.authorities.forEach(function(v){
				if(v.authority=='ROLE_PATIENT'){
					$scope.hasRolePatient=true;
				}
			})
		}
	});
}

function onLoadPage($scope){
	$scope.request={};
	request = $scope.request
	request.parameters={};
	console.log(window.location);

	$scope.urlFragment=function(){
		var urlFragmentSplit = window.location.href.split('#')
		var urlFragment = urlFragmentSplit[urlFragmentSplit.length-1];
		return urlFragment;
	}
	
	if(window.location.search.split('?')[1]){
		angular.forEach(window.location.search.split('?')[1].split('&'), function(value, index){
			var par = value.split("=");
			request.parameters[par[0]] = par[1];
		});
	}
//	console.log(request);
	request.viewKey = window.location.pathname.split('/v/')[1];
	if(!request.viewKey){
		var splitHtml = window.location.pathname.split('.')
		if('html'==splitHtml[1]){
			var x = splitHtml[0].split('/')
			request.viewKey = x[x.length-1];
		}
		if(!request.viewKey){
			request.viewKey='index';
		}
	}
}

init_am_directive.initObj_registry= function($scope, $http){
	$scope.registry={data:{},error:{}};

	$scope.registry.saveRegistrySql=function(){
		var isToSave = true;
		if(!this.data.birth_date){
			if(!this.data.bd){
				isToSave = false;
				this.error.birth_date='Дата народження обов´язкова'
			}else{
				delete this.error.birth_date
				console.log(this.data.birth_date1)
				console.log(this.data.bd)
//				this.data.birth_date = this.data.bd.toISOString().replace('T',' ').replace('Z','')
				this.data.birth_date = this.data.bd.toISOString().split('T')[0]
				console.log(this.data.birth_date)
			}

		}
		if(!this.data.email){
			isToSave = false;
			this.error.email='Введіть ваш eMail. Після успішної реєстрації вам буде вислано лист для активації входу в систему.'
		}
		if(isToSave){
			this.data.password = '{noop}'+this.data.password1;
			var thisData = this.data;
			['family_name', 'first_name', 'second_name'].forEach(function(v){
				console.log(v)
				if(!thisData[v]) 
					thisData[v]=''
			})
			$http.post('/r/update2_sql_with_param', this.data).then(function(response) {
				console.log(response.data);
				console.log('send mail to new user for activate login');
				$http.post('/r/send_eMail', response.data).then(function(response) {
					console.log(response.data);
				});
			});
		}
	};
	
	$scope.registry.set_ddmmyyy_param_from_date=function(key, d1){
		var mm = d1.getMonth()+1;
		var ddmmyyyy = (d1.getDate()<10?'0':'')+d1.getDate()
			+'-'+(mm<10?'0':'')+mm+'-'+d1.getFullYear();
		this.data[key] = ddmmyyyy;
		this.data.bd = d1;
	}

	$scope.registry.dateControlle=function(key){
		var dateString = this.data[key];
		
		var d1 = new Date();
		var y = d1.getFullYear()-2000;
		var m = dateString.match(/([1-9]|1\d|2\d|3[01])([-|,|.| |\/]+)([1-9]|1[012]|0[1-9])([-|,|.| |\/]+)(19|20)(\d{2})/)
		if(m){
			y = m[5]*100+m[6]*1;
		}else{
			m = dateString.match(/([1-9]|1\d|2\d|3[01])([-|,|.| |\/]+)([1-9]|1[012]|0[1-9])([-|,|.| |\/]+)(\d{1,2})/)
			if(m){
				var y0 = m[5]*1;
				y = (y0>y?1900:2000) + y0
			}
		}
		console.log(m)
		if(m){
			d1.setMonth(m[3]*1-1);
			d1.setDate(m[1]);
			d1.setFullYear(y);
			$scope.registry.set_ddmmyyy_param_from_date(key, d1);
			delete this.error.birth_date;
		}else{
			this.error.birth_date='Введіть дату в форматі "день-місяць-рік", розділяючі символи між цифрами -/., або пробіл.';
		}
	}

}
