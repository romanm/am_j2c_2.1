//console.log('----ehealth_declaration.js------------')
init_am_directive.ehealth_declaration = function($scope, $http){
//	console.log('----init_am_directive.ehealth_declaration------------')
	
//	$scope.data.jsonTemplate={x:'y'}

	$scope.$watch('principal',function(){ if($scope.principal){
		console.log('---watch-principal------8------');
		if($scope.progr_am.fn.init_principal)
			$scope.progr_am.fn.init_principal()
		exe_fn.run_progr_am()
	} });

	$scope.progr_am.fn.isEditRow = function(row){
		return this.row_key
		&& row[this.row_key]
			== $scope.request.parameters[this.row_key]
	}
	exe_fn.msp = {msp_id:723}
	exe_fn.msp.msp_division = {
		init_data:{
//			row_key:'division_id',
			include_cols:'/f/eh1/info2/msp_division/division_cols.html',
			col_sort:['division_id', 'name', 'address'],
			fn_col:{
				name1:function(row){
					return row.docbody.name
				},
			},
		},
		httpGet:{ url:'/r/url_sql_read2',
			params:{
				sql:sql2.sql2_msp_divisions_select(),
				msp_id:exe_fn.msp.msp_id,
			},
			then_fn:function(response) {
				$scope.msp_division.data=response.data
				$scope.msp_division.data
				.col_keys={
					division_id:'ІН',
					name:'Назва',
					address:'Адреса',
				}
				angular.forEach($scope.msp_division.data.list, function(v){
					v.docbody = JSON.parse(v.docbody)
				})
				console.log($scope.msp_division)
			}
		},
	}

	exe_fn.msp.DataRead = function(){
		var docbody_id = 723
		exe_fn.jsonEditorRead({
			url_template:'/f/mvp/legalEntity_new_template.json',
			doc_type:'msp',
			docbody_id:docbody_id,
		})
	}

	exe_fn.jsonEditorRead = function(jsonEditorReadParams){
				console.log(jsonEditorReadParams)
		exe_fn.httpGet({url:jsonEditorReadParams.url_template, //read template
			then_fn:function(response) {
				console.log(response.data)
				$scope.data.jsonTemplate=response.data
				exe_fn.httpGet({url:'/r/url_sql_read2', //read data
					params:{
						sql:sql2.sql2_docbody_selectById(),
						docbody_id:jsonEditorReadParams.docbody_id},
						then_fn:function(response) {
							console.log(response.data)
							if(response.data.list[0]){
								var docbody = JSON.parse(response.data.list[0].docbody);
								$scope.editDoc = docbody
								if($scope.editDoc.data)
									$scope.editDoc = $scope.editDoc.data
								if(!$scope.editDoc.doc_id)
									$scope.editDoc.doc_id = response.data.docbody_id
								console.log($scope.editDoc)
								
								$scope.progr_am.fn.calcEditDoc_CRC32()
								$scope.data.jsonTemplateBody
									= $scope.data.jsonTemplate[jsonEditorReadParams.doc_type+'_request']
								console.log($scope.data.jsonTemplateBody)
								adaptTemplateToData($scope.editDoc, $scope.data.jsonTemplateBody)
							}
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
				
				$scope.eh_dictionaries.getValues = function(k, k_parent){
					if(k_parent){
						if('type'.indexOf(k)>=0){
							var kk = k_parent.split('|')
							var i = kk.length==2?-1:-2
							var kki = kk.splice(i,1)
							var kk0 = kki[0]
							if(kk0.indexOf('_request')>=0){
								kk0 = kk0.replace('_request','')
							}else if(kk0.indexOf('addresses')>=0){
								kk0 = kk0.replace('addresses','address')
							}else{
								kk0 = kk0.slice(0, -1)
							}
							k = kk0+'_'+k
						}else if('speciality'.indexOf(k)>=0){
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
					}
					var valuesObject = this.ehMap[k.toUpperCase()]
					if(valuesObject){
						return valuesObject.values 
					}
				};

			}
		})

	}

	$scope.progr_am.fn.openObjectToEdit=function(o,k_parent,k){
		var dataObj=this.getEditDocObj(k_parent)
		if(!dataObj){//create empty object
			var kkk = this.clearPathToObj(k_parent)	
			var jsonTemplateObj = $scope.data.jsonTemplateBody

			var dataObj = $scope.editDoc
			kkk.forEach(function(k){
				jsonTemplateObj = jsonTemplateObj[k]

				if(!dataObj[k]){
					if(jsonTemplateObj.isArray()){
						dataObj[k] = [{}]
					}else{
						dataObj[k] = {}
					}
				}
				dataObj = dataObj[k]
			})
		}

		if('working_hours'==k){
			if(dataObj.isEmpty())
				angular.forEach(o, function(v,k){
					dataObj[k]=v
				})			
			if(!$scope.progr_am.fn.working_hours){
				$scope.progr_am.fn.working_hours = {}
				$scope.progr_am.fn.working_hours.addPaar 
				= function(v){
					v.push(['',''])
				}
				$scope.progr_am.fn.working_hours.minusEmpty 
				= function(o){
					angular.forEach(o, function(v,k){
						if(v[1] && '' == (v[1][0]+v[1][1]) )
							v = v.splice(1,2)
					})
				}
			}
		}

		$scope.oToEdit = {k_parent:k_parent,k:k,o:o,dataObj:dataObj};
		
		$scope.oToEdit.editFormType = $scope.progr_am.fn.editFormType(dataObj, k)
	}
	
	$scope.progr_am.fn.editFormType=function(dataObj, k){
		var editFormType
		if($scope.progr_am.fn.isGroupToEdit())	editFormType = 'isGroupToEdit'
		else if(dataObj.isArray())	editFormType = 'isArray'
		else if('working_hours'==k)	editFormType = 'isInclude'
		return editFormType
	}
	
	$scope.progr_am.fn.getEditDocObj=function(kk){
		var dataObj=$scope.editDoc
		if(kk){
			var kkk = this.clearPathToObj(kk)
			if(!this.editDocObjMap)
				this.editDocObjMap = {}
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
		}
		return dataObj
	}

	$scope.progr_am.fn.clear_oToEdit=function(){
		delete $scope.oToEdit
	},

	$scope.progr_am.fn.clearPathToObj = function(kk){
		var kkk = kk.split('|')
		kkk.splice(0,2)
		return kkk
	}

	$scope.progr_am.fn.groupsToEdit='null|',//setted in page.js
	$scope.progr_am.fn.isGroupToEdit=function(){
		if($scope.oToEdit){
			if(this.groupsToEdit.indexOf($scope.oToEdit.k)>=0)
				return true
		}
	},

	$scope.progr_am.fn.oToEdit_k_parent=function(){
		var k_parent = $scope.oToEdit.k_parent;
		return k_parent.split('|').splice(-2,1).toString()
	}

	$scope.progr_am.fn.keyTranslate=function(k){
		if(k*1==k)
			return k+1
		return amMap[k]?amMap[k]:k;
	},
	
	$scope.progr_am.fn.valueTranslate=function(k_parent, k){
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
//		console.log(docbody)
		console.log($scope.editDoc)
		var docbody_id = $scope.editDoc.docbody_id
		if(!docbody_id)
			docbody_id = $scope.editDoc.doc_id
		var data = {sql:sql2.sql2_docbody_updateById(), docbody:docbody, docbody_id:docbody_id}
//		console.log(data)
		exe_fn.httpPost
		({	url:'/r/url_sql_update2',
			then_fn:function(response) {
//				console.log(response.data)
			},
			data:data,
		})
	}
	
	$scope.progr_am.fn.calcEditDoc_CRC32=function(){
		$scope.editDoc_CRC32 = exe_fn.calcJSON_CRC32($scope.editDoc) 
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
	
	$scope.progr_am.fn.firstInList=function(){
		var d = this.removeFromList()
		$scope.oToEdit.dataObj.splice(0,0,d.dataObj)
		$scope.oToEdit.o.splice(0,0,d.o)
	}

	$scope.progr_am.fn.addToList=function(){
		var dataObj=this.getEditDocObj($scope.oToEdit.k_parent)
		var listElement0 = $scope.oToEdit.o[0],
		listElement1 = JSON.parse(JSON.stringify(listElement0));
		delete listElement1.$$hashKey
		$scope.oToEdit.o.push(listElement1)
		$scope.oToEdit.dataObj.push({})
	}

	$scope.progr_am.fn.removeFromList=function(){
		var d = {
			o:$scope.oToEdit.o.splice($scope.oToEdit.selectedItem,1)[0],
			dataObj:$scope.oToEdit.dataObj.splice($scope.oToEdit.selectedItem,1)[0],
		}
		return d
	}
	$scope.progr_am.fn.j2c = {}
	$scope.progr_am.fn.j2c.remove_row=function(){
		console.log('----interface---j2c.remove_row--------324----------')
	}
	$scope.progr_am.fn.j2c.isSelected_row=function(){
		return false;
	}
	$scope.progr_am.fn.j2c.add_row=function(){
		console.log('----interface---j2c.add_row--------327----------')
	}

	$scope.progr_am.viewes={
		json_form:{ngInclude:'/f/eh1/info2/hrm_cards/json_form1.html',
			dataName:'jsonTemplate',
			heightProcent:65,
		},
		hrm_menu:{ngInclude:'/f/eh1/info2/hrm_cards/hrm_menu.html',
			seek:null,
		},
		j2c_table:{ngInclude:'/f/eh1/info2/hrm_cards/j2c_table.html',
			dataName:'j2c_table-dataName-h123rm_cards',
			heightProcent:22,
		},
	}

	exe_fn.init_j2c_table_seek = function(params, id){
		$scope.$watch('progr_am.viewes.hrm_menu.seek', function(newValue){ if(newValue){
			console.log('---progr_am.viewes.hrm_menu.seek----');
			console.log(newValue)
			var withId = id?'_withId':''
			console.log(withId)
			exe_fn.httpGet(exe_fn.httpGet_j2c_table_params({
				sql:sql2[params+'_seek'+withId](),
				seek:'%'+newValue+'%',
				id:id,
			}))
		} });
		$scope.progr_am.viewes.hrm_menu.seekClean = function(){
			console.log('---interface---progr_am.viewes.hrm_menu.seekClean---')
			$scope.progr_am.viewes.hrm_menu.seek = null
			exe_fn.httpGet(exe_fn.httpGet_j2c_table_params({
				sql:sql2[params](),
			}))
		}

	}

	exe_fn.httpGet_j2c_table_params_then_fn = function(params, then_fn){
		return {
			url : '/r/url_sql_read2',
			params : params,
			then_fn : then_fn,
		}
	}
	
	$scope.progr_am.viewes.hrm_menu.seekClean = function(){
		console.log('---interface---progr_am.viewes.hrm_menu.seekClean---')
	}
	$scope.pageGroup = {
		saveButtonPages:[
			'declaration','msp_division','msp_data','hrm_cards2',
			'declaration3', 'msp_division3', 'newpatient'
		]
	}
	$scope.pageGroup.misAlgoritmed3 = {
		registry:{parent:{name:'Регістратура', url:'info3' },
			reception:'запис на прийом',
			queue:'черга',
			newpatient:'новий пацієнт',
			registry_calendar:'календар',

		},
		physician:{parent:{name:'Кабінет лікаря', url:'info3' },
			ak:'амб-на картка №025/о',
			declaration3:'декларація',
			physician_calendar:'календар',
		},
		analytics:{parent:{name:'Аналітіка', url:'info3' },
			icpc2_test3:'ф.074/о', //f074
			icpc2_test2_report:'ф.039/о',//f039
		},
		msp:{parent:{name:'ЛЗ', url:'info3' },
			msp_page3:'сторінка ЛЗ',
			msp_data3:'данні',
			msp_registry3:'реєстрація',
			msp_division3:'підрозділи',
		},
		dev:{parent:{name:'DEVELOPMENT', url:'info3' },
			icpc2_test4:'ICPC2 таблиця c.v.3.0.1',
		},
	}
	$scope.pageGroup.eHealth = {
		msp:{parent:{name:'ЛЗ', url:'info2' },
			msp_page:'сторінка ЛЗ',
			msp_data:'данні',
			msp_registry:'реєстрація',
			msp_division:'підрозділи',
		},
		hrm:{parent:{name:'Відділ кадрів', url:'info2' },
			hrm_cards2:'карточки',
		},
		physician:{parent:{name:'Кабінет лікаря', url:'info2' },
			declaration:'декларація'
		},
	}

	$scope.pageGroup.thisPageGroup = function(){
		var r,r_k
		angular.forEach(this, function(v0,k0){
			angular.forEach(v0, function(v,k){
				angular.forEach(v, function(v1,k1){
//					if($scope.request.viewKey.indexOf(k1)==0)
//					r={v:v,k:k}
					if($scope.request.viewKey==k1){
						r=v
						r_k=k
					}
				})
			})
		})
		return r
	}

	$scope.keys_use = {}
	$scope.keys_use.keyUp = function($event, dataName){
//		console.log($event.key)
		if('Escape'==$event.key){
			if($scope.modal && $scope.modal.physicianChoose)
				$scope.modal.physicianChoose.display={}
			if($scope.progr_am[dataName]){
				console.log($scope.progr_am[dataName].selectedCell)
				if($scope.progr_am[dataName].selectedCell){
					delete $scope.progr_am[dataName].selectedCell.col_k
				}
			}
		}
	}

}

adaptTemplateToData = function(data, template){
	if(template){
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
}

var sql2 = {
	sql2_patient_lists_seek_withId:function(){
		return "SELECT * FROM ( SELECT 0 sort, x.* FROM (" +
			this.sql2_patient_persons() +" \n" +
			") x WHERE person_id = :id \n" +
			"UNION \n" +
			"SELECT 1 sort, x.* FROM (\n" +
			this.sql2_patient_lists_seek() +
			" ) x ) ORDER BY sort"
	},
	sql2_patient_lists_seek:function(){
		return "SELECT * FROM ( \n" +
				this.sql2_patient_persons() +
				"\n ) x WHERE " +
				" LOWER(pip_patient) LIKE LOWER(:seek) "
	},
	sql2_patient_lists:function(){
		return this.sql2_patient_persons()
	},
	sql2_patient_and_declaration_seek_withId:function(){
		return "SELECT * FROM ( SELECT 0 sort, x.* FROM (" +
				this.sql2_patient_and_declaration() +
				") x WHERE person_id = :id \n" +
				"UNION \n" +
				"SELECT 1 sort, x.* FROM (\n" +
				this.sql2_patient_and_declaration_seek() + 
				" ) x ) ORDER BY sort"
	},
	sql2_patient_and_declaration_seek:function(){
		//sql2_physician_declaration_seek:function(){
		return "SELECT * FROM ( \n" +
				this.sql2_patient_and_declaration() +
				"\n ) x WHERE " +
				" LOWER(pip_patient) LIKE LOWER(:seek) " +
				" OR LOWER(pip_phisician) LIKE LOWER(:seek)"
	},
	sql2_patient_and_declaration:function(){
		return "SELECT pip_patient, person_id, d.* FROM (\n" + 
		this.sql2_patient_persons() + ") p \n" +
		"LEFT JOIN (\n" +
		this.sql2_physician_declaration() +
		"\n)  d ON d.patient=p.person_id"
	},
	sql2_physician_declaration:function(){
		return "SELECT de.reference physician, de.doc_id declaration, dd.parent_id  patient" +
				", last_name||' '||first_name||' '||second_name pip_phisician \n" +
				"FROM doc dd,doc de, person p \n" +
				"WHERE dd.doc_id=de.parent_id AND dd.doctype=14 AND de.doctype=13 AND p.person_id=de.reference "
	},
	sql2_patient_persons:function(){
		return "SELECT last_name||' '||first_name||' '||second_name pip_patient, person_id row_id, p.* \n" +
				"FROM person p,doc d WHERE doc_id=person_id AND doctype=1 "
	},
	sql2_hrmCard_insert:function(){ 
	return 	"INSERT INTO doc (doc_id, doctype) \n" +
			"VALUES (:nextDbId1, :doctypeEmployee); \n" +
			"INSERT INTO doc (parent_id, reference,  doctype) \n" +
			"VALUES (:nextDbId1, :msp_id, :doctypeMsp); \n" +
			"INSERT INTO person (person_id, family_name) \n" +
			"VALUES (:nextDbId1,  :family_name); \n" +
			"INSERT INTO users (user_id, username, password) \n" +
			"VALUES (:nextDbId1, :nextDbId1, :password); \n" +
			this.sql2_docbody_insert()
	},
	sql2_docbody_insert:function(){
	return	"INSERT INTO docbody (docbody_id, docbody) \n" +
			"VALUES (:nextDbId1, :docbody);"
	},
	sql2_docDocbody_insert:function(){
	return "INSERT INTO doc (parent_id, doc_id, doctype) \n" +
		"VALUES (:parent_id, :nextDbId1, :doctype);\n" +
		this.sql2_docbody_insert()
	},
	sql2_docByIdAndParent_delete:function(){
		return "DELETE FROM doc WHERE parent_id=:doc_id; \n"+
			this.sql2_docById_delete()
	},
	sql2_docById_delete:function(){
		return "DELETE FROM doc WHERE doc_id=:doc_id"
	},
	sql2_msp_divisions_select:function(){
		return "SELECT doc_id division_id, d.*,b.* FROM doc d, docbody b " +
				"WHERE doc_id=docbody_id AND doctype=16  AND parent_id=:msp_id"
	},
	sql2_docbody_selectById:function(){
		return "SELECT * FROM docbody WHERE docbody_id=:docbody_id"
	},
	sql2_created_update:function(){
		return "UPDATE doctimestamp SET created=:created " +
		" WHERE doctimestamp_id=:doctimestamp_id"
	},
	sql2_docbody_updateById:function(){
		return "UPDATE docbody SET docbody=:docbody " +
		" WHERE docbody_id=:docbody_id"
	},
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
	doctor:'лікар',
	
	employee_request:'картка співробітника',
	division_request:'амбулаторія - філіал',

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
	location:'місце знаходження',
	mon:'пн',
	tue:'вт',
	wed:'ср',
	thu:'чт',
	fri:'пт',
	sat:'сб',
	sun:'нд',
}

