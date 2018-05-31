//console.log('----ehealth_declaration.js------------')
init_am_directive.ehealth_declaration = function($scope, $http){
//	console.log('----init_am_directive.ehealth_declaration------------')
	
//	$scope.data.jsonTemplate={x:'y'}

	$scope.$watch('principal',function(){ if($scope.principal){
		console.log('----$scope.$watch(principal,function()------8------');
		if($scope.progr_am.fn.init_principal)
			$scope.progr_am.fn.init_principal()
		exe_fn.run_progr_am()
	} });

	$scope.progr_am.fn.keyTranslate=function(k){
		return amMap[k]?amMap[k]:k;
	},

	$scope.progr_am.fn.calcEditDoc_CRC32=function(){
		$scope.editDoc_CRC32 = exe_fn.calcJSON_CRC32($scope.editDoc) 
	},

	$scope.progr_am.fn.isEditRow=function(row){
		return row.person_id
			== $scope.request.parameters.person_id
	},

	$scope.progr_am.fn.ngStyle=function(component_name, add_style){
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
			dataName:'j2c_table-dataName-h123rm_cards',
			heightProcent:22,
		},
	},

	$scope.eHealth = {
		msp:{name:'ЛЗ',
			msp_data:'данні ЛЗ',
			msp_registry:'реєстрація ЛЗ',
			msp_division:'підрозділи',
		},
		hrm:{name:'Відділ кадрів',
			hrm_cards:'карточки',
		},
		physician:{name:'Кабінет лікаря',
			declaration:'декларація'
		},
	}

	$scope.eHealth.pageGroup = function(){
		var r
		angular.forEach(this, function(v,k){
			angular.forEach(v, function(v1,k1){
				if($scope.request.viewKey.indexOf(k1)==0)
					r=v
			})
		})
		return r
	}

}

adaptTemplateToData = function(data, template){
	angular.forEach(data, function(v, k){
		if(v.isObject()){
			var v_template = template[k]
			if(v.isArray()){
				/*duplicate the template  array element 
				 *to the number of data elements in array*/
				for (var i = v_template.length; i < v.length; i++) {
					v_template[i]=
						JSON.parse(JSON.stringify(v_template[0]));
				}
			}
			adaptTemplateToData(v, v_template)
		}
	});
}

var sql2= {
	sql2_msp_divisions_select:function(){
		return "SELECT doc_id division_id, d.*,b.* FROM doc d, docbody b " +
				"WHERE doc_id=docbody_id AND doctype=16  AND parent_id=:msp_id"
	},
	sql2_docbody_selectById:function(){
		return "SELECT * FROM docbody WHERE docbody_id=:docbody_id"
	},
	sql2_docbody_updateById:function(){
		return "UPDATE docbody SET docbody=:docbody " +
				" WHERE docbody_id=:docbody_id"
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
	second_name:'По‑батькові',
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
	issued_date:'дата‑видачі',
	start_date:'дата‑початку',
	end_date:'дата‑завершеня',
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

