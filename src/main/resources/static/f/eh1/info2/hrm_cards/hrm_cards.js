
//console.log('------hrm_cards.js---------------')
init_am_directive.init_hrm_cards = function($scope, $http){
//	console.log('----init_am_directive.hrm_cards------------')
//	console.log(CRC32(JSON.stringify({a:1})))
	init_am_directive.ehealth_declaration($scope, $http);
	
	if($scope.request.parameters.person_id){
		exe_fn.httpGet({url:'/f/mvp/employee_template2.json',
			then_fn:function(response) {
//				console.log(response.data)
				$scope.data.jsonTemplate=response.data
				exe_fn.httpGet({url:'/r/url_sql_read2',
					params:{
						sql:sql2.sql2_docbody_selectById(),
						docbody_id:$scope.request.parameters.person_id},
					then_fn:function(response) {
						var //docbody = response.data.list[0].docbody
						docbody = JSON.parse(response.data.list[0].docbody);
						$scope.editDoc = docbody
						console.log($scope.editDoc)
						$scope.progr_am.hrm_cards.fn.calcEditDoc_CRC32()
					}
				})
			}
		})

	}
	
	$scope.$watch('progr_am.viewes.hrm_menu.seek',function(seek){if(seek){
		console.log(seek)
	}})
	
	$scope.$watch('principal',function(){
		if($scope.principal){
			console.log('----$scope.$watch(principal,function()------109------');
			if($scope.principal.msp_id){
				$scope.progr_am.hrm_cards.httpGet.params.msp_id
					= $scope.principal.msp_id
			}
			exe_fn.run_progr_am()
		}
	});

	$scope.progr_am.hrm_cards={
		fn:{
			calcEditDoc_CRC32(){
				$scope.editDoc_CRC32 = exe_fn.calcJSON_CRC32($scope.editDoc) 
			},
			isEditRow:function(row){
				return row.person_id
					== $scope.request.parameters.person_id
			},
		},
		init_data:{
			col_sort:['person_id', 'family_name', 'pip']
		},
		httpGet:{
			url:'/r/read2_sql_with_param',
			params:{
				sql:'sql.msp_employee.list',msp_id:188
			},
			then_fn:function(response) {
//				console.log(response.data)
				$scope.hrm_cards.data=response.data
				delete $scope.hrm_cards[$scope.hrm_cards.sql]
				delete $scope.hrm_cards.sql
//				console.log($scope.hrm_cards)
				$scope.hrm_cards.data
				.col_keys={
						person_id:'ІН',
						family_name:'Фамілія',
						pip:'ПІП'
				}
			}
		},
	}

	$scope.progr_am.hrm_cards.fn.save=function(){
		console.log('-----save------79-------')
		this.calcEditDoc_CRC32()
		console.log($scope.editDoc_CRC32)
		console.log($scope.editDoc)
	}
	
	$scope.progr_am.viewes={
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
			heightProcent:22,
		},
	},
	
	$scope.progr_am.fn={
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
		clear_oToEdit:function(){
			console.log($scope.oToEdit)
			delete $scope.oToEdit
			console.log($scope.oToEdit)

		},
		groupsToEdit:'doctor|',
		isGroupToEdit:function(){
			if($scope.oToEdit){
				if(this.groupsToEdit.indexOf($scope.oToEdit.k)>=0)
					return true
			}
		},
		
		amMapValue:function(k){
			return amMap[k]?amMap[k]:k;
		},
	}
	$scope.progr_am.fn.oToEdit_k_parent=function(){
		var k_parent = $scope.oToEdit.k_parent;
		return k_parent.split('|').splice(-2,1).toString()
	}
	$scope.progr_am.fn.openObjectToEdit=function(o,k_parent,k){
		var dataObj=this.getEditDocObj(k_parent)
		if(!dataObj){//create empty object
			var kkk = this.clearPathToObj(k_parent)	
			var jsonTemplateObj = $scope.data.jsonTemplate.employee_request
			var dataObj = $scope.editDoc
			kkk.forEach(function(k){
				jsonTemplateObj = jsonTemplateObj[k]
				if(dataObj[k]){
					dataObj = dataObj[k]
				}else{
					if(jsonTemplateObj.isArray()){
						dataObj[k] = [{}]
					}else{
						dataObj[k] = {}
					}
					dataObj = dataObj[k]
				}
			})
		}
		$scope.oToEdit = {k_parent:k_parent,k:k,o:o,dataObj:dataObj};
	}
	$scope.progr_am.fn.getEditDocObj=function(kk){
		var kkk = this.clearPathToObj(kk)
		if(!this.editDocObjMap)
			this.editDocObjMap = {}
		var dataObj=$scope.editDoc
		if(!this.editDocObjMap[kkk.toString()]){
			kkk.forEach(function(k){
				if(dataObj)
					if(dataObj[k])
						dataObj = dataObj[k]
					else
						dataObj = null
			})
			this.editDocObjMap[kkk.toString()] = dataObj
		}else
			dataObj = this.editDocObjMap[kkk.toString()]
		return dataObj
	}
	$scope.progr_am.fn.clearPathToObj = function(kk){
		var kkk = kk.split('|')
		kkk.splice(0,2)
		return kkk		
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
