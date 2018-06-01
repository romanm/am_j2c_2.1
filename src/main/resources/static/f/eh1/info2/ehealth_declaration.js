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

	exe_fn.jsonEditorRead = function(jsonEditorReadParams){

		exe_fn.httpGet({url:jsonEditorReadParams.url_template, //read template
			then_fn:function(response) {
//					console.log(response.data)
				$scope.data.jsonTemplate=response.data
				exe_fn.httpGet({url:'/r/url_sql_read2', //read data
					params:{
						sql:sql2.sql2_docbody_selectById(),
						docbody_id:jsonEditorReadParams.docbody_id},
						then_fn:function(response) {
							var //docbody = response.data.list[0].docbody
							docbody = JSON.parse(response.data.list[0].docbody);
							$scope.editDoc = docbody
							if($scope.editDoc.data)
								$scope.editDoc = $scope.editDoc.data
								console.log($scope.editDoc)
								$scope.progr_am.fn.calcEditDoc_CRC32()
								
								var jsonTemplate = $scope.data.jsonTemplate 
								if(jsonTemplate.employee_request)
									jsonTemplate = $scope.data.jsonTemplate.employee_request 
									
								console.log(jsonTemplate)

								adaptTemplateToData($scope.editDoc, jsonTemplate)
						}
				})
			}
		})


			exe_fn.httpGet({url:'/f/eh1/dictionaries.json', //read eHealth dictionary
				then_fn:function(response) {
					$scope.eh_dictionaries={ehMap:{},};
					angular.forEach(response.data.data, function(v, k){
						$scope.eh_dictionaries.ehMap[v.name]=v;
					});
					console.log($scope.eh_dictionaries.ehMap)
					$scope.eh_dictionaries.getValues=function(k, k_parent){
						if('type'.indexOf(k)>=0)
							k = k_parent.split('|')
							.splice(-2,1)[0].slice(0, -1)+'_'+k
							else if('speciality'.indexOf(k)>=0){
								k='speciality_type'
							}else if('status'.indexOf(k)>=0){
								k = k_parent.split('|')[1]+'_'+k
							}else if('degree'.indexOf(k)>=0){
								k = k_parent.split('|')
								.splice(-2,1)[0].slice(0, -1)+'_'+k
								k = k.replace('docto_degree','science_degree')
							}else if('level'.indexOf(k)>=0){
								k = k_parent.split('|')
								.splice(-2,1)[0].slice(0, -1)+'_'+k
								k = k.replace('specialitie_level','speciality_level')
							}
						var valuesObject = this.ehMap[k.toUpperCase()]
						if(valuesObject){
							return valuesObject.values 
						}
					}
				}
			})
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

	$scope.progr_am.fn.keyTranslate=function(k){
		return amMap[k]?amMap[k]:k;
	},
	
	$scope.progr_am.fn.valueTranslate=function(k_parent, k){
		if(!k_parent){
			console.log(k)
			return '???'			
		}

		var editDocObject = $scope.progr_am.fn.getEditDocObj(k_parent)
		var dictionarieValues = $scope.eh_dictionaries.getValues(k, k_parent)
		if(!editDocObject)
			return '___'
			else if(!dictionarieValues)
				return editDocObject[k]
			else 
				return dictionarieValues[editDocObject[k]]
	},

	$scope.progr_am.fn.save=function(){
		console.log('-----save------79-------')
		$scope.progr_am.fn.calcEditDoc_CRC32()
		console.log($scope.editDoc_CRC32)
//		console.log($scope.editDoc)
		var docbody = JSON.stringify($scope.editDoc)
		console.log(docbody)
		var data = {sql:sql2.sql2_docbody_updateById(), docbody:docbody, docbody_id:$scope.editDoc.docbody_id}
		exe_fn.httpPost({url:'/r/url_sql_update2',
			then_fn:function(response) {
//				console.log(response.data)
			},
			data:data,
		})
	}

	
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

