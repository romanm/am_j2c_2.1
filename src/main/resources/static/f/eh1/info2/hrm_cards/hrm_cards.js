//console.log('------hrm_cards.js---------------')
init_am_directive.init_hrm_cards = function($scope, $http){
//	console.log('----init_am_directive.hrm_cards------------')
	init_am_directive.ehealth_declaration($scope, $http);
	
	if($scope.request.parameters.person_id){
		console.log(window.innerHeight)
		console.log(procentWindowHeight(74))
		console.log(window.innerHeight*25/100)
		console.log(window.innerHeight*75/100
					+window.innerHeight*25/100)

		console.log(sql2)
		console.log(sql2.sql2_docbody_selectById())

		exe_fn.httpGet({url:'/f/mvp/employee_template2.json',
			then_fn:function(response) {
//				console.log(response.data)
				$scope.data.jsonTemplate=response.data
			}
		})
	}
	
	$scope.progr_am={
		fn:{
			ngStyle:function(component_name){
				var style={}
				if('json_form'==component_name){
					var h = procentWindowHeight(70)
					style.height= h+'px';
					style.overflow='auto';
					style.direction='rtl'
				}
				return style;
			},
			openObjectToEdit:function(o,kp){
				$scope.oToEdit = o;
			},
			amMapValue:function(k){
				return amMap[k]?amMap[k]:k;
			},
		},
		viewes:[
			{ngInclude:'/f/eh1/info2/hrm_cards/j2c_table.html',
				dataName:'hrm_cards'
			},
			{ngInclude:'/f/eh1/info2/hrm_cards/json_form1.html',
				dataName:'jsonTemplate'
			},

		],
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
