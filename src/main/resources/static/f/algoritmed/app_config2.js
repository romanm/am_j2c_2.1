//the code for configuration

app_config.programRun = {
	eh_dictionaries:{
		programFile:{
			TablesJ2C:{
				param:{url:'/f/eh1/dictionaries.json'}
				,init:function($scope, response){
					$scope.eh_dictionaries.amMapValue=function(k){
						return amMap[k]?amMap[k]:k;
					};
					// path for object opened to edit
					$scope.eh_dictionaries.amPathValue=function(k){
						if(k){
							var r='';
							var ks = k.split('.');
							for (var i = 1; i < ks.length; i++) {
								if(1*ks[i]==ks[i]){
									r+= ' '+(1+1*ks[i])
								}else{
									r += (r.length>0?' / ':'') 
										+ (amMap[ks[i]]?amMap[ks[i]]:ks[i]);
								}
							}
							return r;
						}
					};
					$scope.eh_dictionaries.ehMap={};
					angular.forEach(response.data.data, function(v, k){
						$scope.eh_dictionaries.ehMap[v.name]=v;
					});
				}
			}
		}
	}
}


app_config.fn.pages = function($scope){
	console.log('--------app_config.fn.pages--------')
	this.head=function(){
		init_am_directive.init_app.init_page_head($scope);
		if(!$scope.page.pageHeadMenuWidth){
			$scope.page.initHeadMenu = function(){
				$scope.page.pageHeadMenuWidth = 600;
				while (window.innerWidth-step <= $scope.page.pageHeadMenuWidth) 
					$scope.page.pageHeadMenuWidth -= step;
			}
			var step=20;
			$scope.page.selectedTab = function($index, k_page_head_tabs){
				if($scope.page.head.tabs_key==k_page_head_tabs)
						return $scope.page.pageKey()==$scope.app_config.page_head_tabs[k_page_head_tabs].links[$index];
				return $index==0;
			}
		}
		if(!$scope.page.pageKey){
			$scope.page.pageKey=function(){
				if($scope.programRun)
					return $scope.programRun.objKeys()[0];
				else
					return request.viewKey;
			}
		}
	}
	
	$scope.openObjectToEdit=function(o,kp){
		console.log(o)
		console.log(kp)

		if(!$scope.oToEdit)
			$scope.oToEdit={maxSaveCount:4};
		$scope.oToEdit.o = o;
		$scope.oToEdit.kp = kp;
		if(!$scope.oToEdit.changeCalc){
			$scope.oToEdit.changeCalc=0;
			$scope.$watch('oToEdit.changeCalc',function(newValue){
				console.log(newValue)
				if(newValue>$scope.oToEdit.maxSaveCount){
					console.log('-------32-----save-----------')
					$scope.oToEdit.changeCalc=0;
				}
			})
		}
	};

	app_config.principal = {
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
			ROLE_WAITING_FOR_CONFIRMATION:{name:'Заявка на користування програмою: medic.algoritmed.com',fns:['J']},
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

var amMap={
 id:'Ідентифікаційний №',
 name:'Назва лікувального закладу',
 short_name:'Коротка назва ЛЗ',
 public_name:'Публічена назва ЛЗ',
 edrpou:'ЄДРПОУ',
 is_active:'активне',
 kveds:'КВЕДи',
 medical_service_provider:'постачальник медичних послуг',
 licenses:'ліцензії',
 license_number:'№ ліцензії',
 expiry_date:'дійсний до',
 order_date:'дата замовлення',
 active_from_date:'активний з',
 what_licensed:'що ліцензовано',
 order_no:'номер замовлення',
 accreditation:'акредитація',
 category:'категорія',
 working_hours:'часи роботи',
 number:'№',
 first_name:"Ім'я",
 last_name:'Призвище',
 family_name:'Призвище+',
 second_name:'По батькові',
 party:'паспортна частина',
 phones:'телефони',
 employee_request:'картка співробітника',
 doctor:'лікар',
 confidant_person:'опікун',
 documents_person:'документи осіб',
 authentication_methods:'методи перевірки автентичності',
 documents_relationship:'документи взаємовідносин',
 confident_persons:'довірені особа',
 documents:'документи',
 educations:'освіта документи',
 qualifications:'кваліфікація документи',
 specialities:'спеціалізація документи',
 science_degree:'наукова ступінь',
 birth_date:'д.н.',
 birth_country:'країна народження',
 gender:'стать',
 no_tax_id:'ІПН відсутній',
 type:'тип',
 tax_id:'ІПН',
 data:'/',
 division_id:'ІН підрозділу',
 legal_entity_id :'ІН лікувального закладу',
 phone_number:'№ тел.',
 emergency_contact:"для екстреного зв'язку",
 addresses:'адреси',
 country:'країна',
 area:'обл.',
 region:'р-н.',
 city:'місто',
 settlement:'поселення',
 settlement_id:'ІН поселення',
 street_type:'тип вул.',
 street:'вулиця',
 building:'буд.',
 apartment:'кв.',
 zip:'п.індекс',
 issued_by:'ким виданий',
 issued_at:'коли виданий',
 issued_date:'дата видачі',
 start_date:'дата початку',
 end_date:'дата завершеня',
 valid_to :'дійсний до',
 additional_info:'додаткова інформація',
 diploma_number :'№ діплома',
 certificate_number :'№ сертифіката',
 speciality :'спеціальність',
 degree:'рівень',
 position :'позиція',
 status:'статус',
 employee_type:'тип робітника',
 institution_name:'назва інститута',
}

app_config.page_head_tabs = {
	physician:{
		links:['ph_seek', 
			'ph_ambulatory_card', 'ph_patient_driving',
			'ph_calendar',
			'ph_declaration',
		]
		,name:'Кабінет лікаря'
	}
	,hrm:{
		links:['employees_cards', 'employee', 'new_employee']
		,name:'Відділ кадрів'
	}
	,hf_admin:{
		links:['hf_data', 'hf_registry'
			, 'hf_divisions', 'hf_division'
			, 'hf_capitatio_data', 'hf_declaration']
		,name:'Сторінка адміністратора'
	}
}

