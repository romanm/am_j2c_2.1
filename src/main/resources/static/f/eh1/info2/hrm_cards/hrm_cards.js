//console.log('------hrm_cards.js---------------')
init_am_directive.init_hrm_cards = function($scope, $http){
//	console.log('----init_am_directive.hrm_cards------------')
//	console.log(CRC32(JSON.stringify({a:1})))
	init_am_directive.ehealth_declaration($scope, $http);

	if($scope.request.parameters.person_id){
		exe_fn.httpGet({url:'/r/url_sql_read2',
			params:{
				sql:sql2.sql2_docbody_selectById(),
				docbody_id:$scope.request.parameters.person_id},
			then_fn:function(response) {
				var //docbody = response.data.list[0].docbody
				docbody = JSON.parse(response.data.list[0].docbody);
				console.log(docbody)
			}
		})

		exe_fn.httpGet({url:'/f/mvp/employee_template2.json',
			then_fn:function(response) {
//				console.log(response.data)
				$scope.data.jsonTemplate=response.data
			}
		})

	}
	
	$scope.$watch('progr_am.viewes.hrm_menu.seek',function(seek){if(seek){
		console.log(seek)
	}})
	
	$scope.progr_am={
		viewes:{
			json_form:{ngInclude:'/f/eh1/info2/hrm_cards/json_form1.html',
				dataName:'jsonTemplate',
				heightProcent:65,
			},
			hrm_menu:{ngInclude:'/f/eh1/info2/hrm_cards/hrm_menu.html',
				seek_placeholder:'пошук картки працівника',
				seek:null,
			},
			j2c_table:{ngInclude:'/f/eh1/info2/hrm_cards/j2c_table.html',
				dataName:'hrm_cards',
				heightProcent:25,
			},
		},
		fn:{
			ngStyle:function(component_name, add_style){
				var style={}
				if('json_form|j2c_table'
					.indexOf(component_name)>=0
				){
					var hp = $scope.progr_am
					.viewes[component_name].heightProcent
					var h = procentWindowHeight(hp)
					style.height= h+'px';
					style.overflow='auto';
				}
				if(add_style)
				angular.forEach(add_style, function(value, style_name){
					style[style_name]=value;
				})
				return style;
			},
			openObjectToEdit:function(o,kp){
				$scope.oToEdit = o;
			},
			amMapValue:function(k){
				return amMap[k]?amMap[k]:k;
			},
		},
		hrm_cards:{
			fn:{
				isEditRow:function(row){
					return row.person_id
					== $scope.request.parameters.person_id
				},
			},
			init_data:{
				col_sort:['person_id', 'family_name']
			},
			httpGet:{
				url:'/r/read2_sql_with_param',
				params:{
					sql:'sql.msp_employee.list',msp_id:188
				},
				then_fn:function(response) {
//					console.log(response.data)
					$scope.hrm_cards.data=response.data
					delete $scope.hrm_cards[$scope.hrm_cards.sql]
					delete $scope.hrm_cards.sql
//					console.log($scope.hrm_cards)
					$scope.hrm_cards.data
					.col_keys={
						person_id:'ІН',
						family_name:'Фамілія',
					}
				}
			},
		},
	}
	exe_fn.run_progr_am()
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
