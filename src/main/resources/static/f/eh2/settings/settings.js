console.log('------settings.js---------------')
init_am_directive.init_hrm_settings3 = function($scope, $http){
	console.log('----init_am_directive.init_hrm_settings3------------')
	init_am_directive.init_settings($scope, $http)
}

var init_principal_edit = function($scope, principal_edit){
	$scope.principal_edit = principal_edit
	console.log($scope.principal_edit)
	$scope.add_to_msp = function(msp, user_id){
		console.log(user_id)
		console.log(msp)
		var data = {
			sql:sql_settings.add_msp_to_user(), 
			user_id:user_id, 
			msp_id:msp.msp_id,
		}
		console.log(data)
		exe_fn.httpPost
		({	url:'/r/url_sql_update2',
			then_fn:function(response) {
				location.reload();
			},
			data:data,
		})

			/*
	 * */
	}	
}

init_am_directive.init_settings = function($scope, $http){
	console.log('----init_am_directive.init_settings------------')
	init_am_directive.ehealth_declaration($scope, $http);
	
	$scope.progr_am.passwordChange = {data:{},error:{}}
	console.log($scope.progr_am.passwordChange)
	$scope.progr_am.passwordChange.save = function(){
		var data = {
			sql:sql_settings.userpass_add(), 
			password:'{noop}'+this.data.password,
			user_id:$scope.principal.user.user_id,
		}
		console.log(data)
		exe_fn.httpPost
		({	url:'/r/url_sql_update2',
			then_fn:function(response) {
				location.reload();
			},
			data:data,
		})

	}
	$scope.progr_am.passwordChange.p2p1equals = function(){
		console.log(this)
		console.log(this.data)
		if(this.data.password != this.data.password2){
			this.error.password2 = 'Перший пароль не дорівнює другому.'
		}else{
			delete this.error.password2
		}
	}
	$scope.progr_am.roles = {data:{}}
	$scope.progr_am.roles.add_msp = function(role){
		console.log(123)
		if($scope.progr_am.roles.data.msp_name){
			var msp_docbody = {
				name:$scope.progr_am.roles.data.msp_name,
				short_name:$scope.progr_am.roles.data.msp_name,
				public_name:$scope.progr_am.roles.data.msp_name,
			}
			var data = {
				user_id:$scope.principal.user_id,
				msp_name:$scope.progr_am.roles.data.msp_name,
				sql:sql_settings.add_msp(),
				msp_docbody:JSON.stringify(msp_docbody),
			}
			console.log(data)
			exe_fn.httpPost
			({	url:'/r/url_sql_update2',
				then_fn:function(response) {
					console.log(data)
				},
				data:data,
			})
		}
	}
	$scope.progr_am.roles.fn_plus_role = function(role){
		if($scope.principal && $scope.principal.principal){
			console.log($scope.principal.principal.name)
			var data = {
				sql:sql_settings.role_add(), 
				username:$scope.principal.principal.name, 
				role_id:role.role_id,
			}
			console.log(data)
			exe_fn.httpPost
			({	url:'/r/url_sql_update2',
				then_fn:function(response) {
					location.reload();
				},
				data:data,
			})
		}
	}

	$scope.progr_am.roles.hasLoginRole3 = function(role){
		var hasLoginRole3 = false
		if($scope.principal && $scope.principal.principal){
			angular.forEach($scope.principal.principal.authorities, function(value, index){
				if(value.authority == role)
					hasLoginRole3 = true
			})
		}
		return hasLoginRole3
		
	}
	$scope.progr_am.roles.hasLoginRole2 = function(role){
		var hasLoginRole2 = false
//		if($scope.principal && $scope.principal.principal){
//		var my_authority = $scope.principal.principal.authorities[0].authority;
		if($scope.principal_edit){
			if(!$scope.principal_edit.authorities)
				$scope.principal_edit.authorities = $scope.principal.principal.authorities 
			var my_authority = $scope.principal_edit.authorities[0].authority;
			hasLoginRole2 = (role.role_id == my_authority)
		}
		return hasLoginRole2
	}
	$scope.progr_am.roles.hasLoginRole = function(r,r_o,r_a){
		if(!r_a) r_a='role_id';
		var hasRole = false;
		angular.forEach(r_o, function(value, index){
			if(value[r_a]==r){
				hasRole = true;
			}
		});
		return hasRole;
	}
	console.log($scope.progr_am.roles)
	exe_fn.roles_data_list()
	console.log($scope.request.parameters)
	if($scope.request.parameters.id){
		console.log($scope.request.parameters)
		console.log($scope.request.parameters.id)
		exe_fn.httpGet({url:'/r/principal/'+$scope.request.parameters.id, //read principal by id
			then_fn:function(response) {
				console.log(response.data)
				init_principal_edit($scope, response.data.principal)
			}
		})
	}
	$scope.$watch('principal',function(){
		console.log('----$scope.$watch(principal,function()------118------');
		if($scope.principal){
			if($scope.principal.principal){
				var authority = $scope.principal.principal.authorities[0].authority;
				console.log(authority)
				console.log(principal_config.role[authority])
				$scope.progr_am.roles.hasLoginRole2($scope.progr_am.roles.data.list[0])
				if(!$scope.request.parameters.id){
					init_principal_edit($scope, $scope.principal)
				}
			}
		}
	});

	$scope.$watch('page', function(newValue,oldValue){if(newValue){
		console.log(123)
		console.log($scope.page.getPrincipalRole())
	}})
	

	var principal_config = {
		db_role:{ },
		dbRoles:null,
		dbRolesMap:{},
		fn_readDbRoles:function(){
			if(!this.dbRoles){
				var thisObj = this;
				$scope.commonDbRest.read_sql_with_param(
				{sql:'sql.roles.select'
				},function(response) {
					thisObj.dbRoles = response.data.list;
					angular.forEach(thisObj.dbRoles, function(v, i){
						thisObj.dbRolesMap[v.role_id] = v;
					});
					console.log(thisObj.dbRoles);
				});
			}
		},
		role:{
			ROLE_USER:{name:'Лікар',fns:['A','E','B','H'],page_head_tabs:'physician'},
			ROLE_REGISTRY_NURSE:{name:'м/с Реєстратури',fns:['A','H']},
			ROLE_HEAD_HUMAN_RESOURCES:{name:'Зав.Кадрами',fns:['C','B','D'],page_head_tabs:'hrm'},
			ROLE_ADMIN_MSP:{name:'Адмін. Лікарні',fns:['A','B','C','D','E','H']},
			ROLE_HEAD_MSP:{name:'Гол.Лікар',fns:['C','B','D','I'],page_head_tabs:'hf_admin'},
			ROLE_ADMIN_REGION:{name:'Адмін. Регіону',fns:['F']},
			ROLE_ADMIN_APP:{name:'Адмін.програми',fns:['A','B','C','D','E','F','H','I']},
			ROLE_WAITING_FOR_CONFIRMATION:{name:'Заявка на користування МІС-АЛГОРІТМЕД',fns:['J']},
		},
		fns:{
			A:{name:'Заведеня хворого'},
			B:{name:'Підписання декларації - eHealth'},
			C:{name:'Реєстрація лікаря - eHealth'},
			D:{name:'Реєстрація лікувального закладу - eHealth'},
			E:{name:'Вести хворого'},
			F:{name:'Підтвердження існування лікувального закладу'},
			H:{name:'Запис пацієнта до лікаря'},
			I:{name:'Звільненя лікаря'},
			J:{name:'Очікування підтвердження доступу'},
		},
		myMaxRole:null,
		fn_myMaxRole:function(){
			if(!this.myMaxRole){
	//				console.log(this.dbRolesMap);
				if(this.dbRolesMap){
					var thisObj = this;
	//					console.log(this.dbRolesMap);
					this.myMaxRole = 0;
					angular.forEach($scope.principal.principal.authorities, function(v, i){
						var role_id = v.authority;
	//						console.log(v.authority);
	//						console.log(thisObj.dbRolesMap[v.authority]);
						var role_sort = thisObj.dbRolesMap[v.authority].role_sort;
	//						console.log(role_sort);
						if(thisObj.myMaxRole<role_sort)
							thisObj.myMaxRole=role_sort;
					});
				}else{
					this.fn_readDbRoles();
				}
			}
			return this.myMaxRole;
		}
		,hasAdminMSPRole:function(){//доступ до створення MSP
			var hasHumanResourcesRole
			= app_config.principal.hasRole('ROLE_HEAD_MSP')
			|| app_config.principal.hasRole('ROLE_ADMIN_MSP')
			|| app_config.principal.hasRole('ROLE_ADMIN_APP');
			return hasHumanResourcesRole;
		}
		,hasHumanResourcesRole:function(){//доступ до картотеки
			var hasHumanResourcesRole
			= this.hasRole('ROLE_HEAD_HUMAN_RESOURCES')
			|| this.hasRole('ROLE_HEAD_MSP')
			|| this.hasRole('ROLE_ADMIN_MSP')
			|| this.hasRole('ROLE_ADMIN_APP');
			return hasHumanResourcesRole;
		}
		,hasRole:function(r){
	//			console.log(r);
			var hasRole = false;
			if($scope.principal && $scope.principal.principal){
				hasRole = this.hasLoginRole(r, $scope.principal.principal.authorities, 'authority');
				
			}
			return hasRole;
		}
		,hasLoginRole:function(r,r_o,r_a){
			if(!r_a) r_a='role_id';
			var hasRole = false;
			angular.forEach(r_o, function(value, index){
				if(value[r_a]==r){
					hasRole = true;
				}
			});
			return hasRole;
		}
	}
}

var sql_settings = {
	add_msp_to_user:function(){
		return "INSERT INTO doc (parent_id, doctype, reference) VALUES (:user_id, 23, :msp_id);"
	},
	add_msp:function(){
		return "INSERT INTO doc (doc_id, doctype) VALUES (:nextDbId1, 23); \n" +
				"INSERT INTO docbody (docbody_id, docbody) VALUES (:nextDbId1, :msp_docbody); \n" +
				"INSERT INTO msp (msp_id, msp_name, msp_public_name) VALUES (:nextDbId1, :msp_name, :msp_name); \n" +
				"INSERT INTO doc (doc_id, parent_id, reference, doctype) VALUES (:nextDbId2, :user_id, :nextDbId1, 23)"
	},
	userpass_add:function(){
		return "UPDATE users SET password=:password WHERE user_id=:user_id"
	},
	role_add:function(){
		return "INSERT INTO user_roles (username, role) VALUES (:username, :role_id); \n" +
				"DELETE FROM user_roles WHERE username=:username AND role='ROLE_WAITING_FOR_CONFIRMATION'"
	},
	user_roles_select:function(){
		return "SELECT * FROM user_roles"
	}
}
