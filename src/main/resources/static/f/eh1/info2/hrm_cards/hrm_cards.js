
//console.log('------hrm_cards.js---------------')
init_am_directive.init_hrm_cards = function($scope, $http){
//	console.log('----init_am_directive.hrm_cards------------')
//	console.log(CRC32(JSON.stringify({a:1})))
	init_am_directive.ehealth_declaration($scope, $http);
	
	$scope.progr_am.fn.init_onLoad = function(){
		console.log('-----init_onLoad------------')
		if($scope.request.parameters.person_id){

			exe_fn.httpGet({url:'/f/mvp/employee_template2.json', //read template
				then_fn:function(response) {
//					console.log(response.data)
					$scope.data.jsonTemplate=response.data
					exe_fn.httpGet({url:'/r/url_sql_read2', //read data
						params:{
							sql:sql2.sql2_docbody_selectById(),
							docbody_id:$scope.request.parameters.person_id},
							then_fn:function(response) {
								var //docbody = response.data.list[0].docbody
								docbody = JSON.parse(response.data.list[0].docbody);
								$scope.editDoc = docbody
								if($scope.editDoc.data)
									$scope.editDoc = $scope.editDoc.data
									console.log($scope.editDoc)
									$scope.progr_am.fn.calcEditDoc_CRC32()
									adaptTemplateToData($scope.editDoc, 
											$scope.data.jsonTemplate.employee_request)
							}
					})
				}
			})

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
	}
	
	if($scope.request.parameters.person_id){

	}
	
	$scope.$watch('progr_am.viewes.hrm_menu.seek',function(seek){if(seek){
		console.log(seek)
	}})
	
	$scope.progr_am.viewes.j2c_table.dataName='hrm_cards'
	$scope.progr_am.hrm_cards={
		init_data:{
			row_key:'person_id',
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

	$scope.progr_am.hrm_cards.fn={}
	$scope.progr_am.hrm_cards.fn.save=function(){
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

	$scope.progr_am.fn.init_principal = function(){
		if($scope.principal.msp_id){
			$scope.progr_am.hrm_cards.httpGet.params.msp_id
				= $scope.principal.msp_id
		}
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


	$scope.progr_am.fn.clear_oToEdit=function(){
		console.log($scope.oToEdit)
		delete $scope.oToEdit
		console.log($scope.oToEdit)
	},
	$scope.progr_am.fn.groupsToEdit='doctor|',
	$scope.progr_am.fn.isGroupToEdit=function(){
		if($scope.oToEdit){
			if(this.groupsToEdit.indexOf($scope.oToEdit.k)>=0)
				return true
		}
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

	$scope.progr_am.fn.keyTranslate=function(k){
		return amMap[k]?amMap[k]:k;
	},

	$scope.progr_am.fn.oToEdit_k_parent=function(){
		var k_parent = $scope.oToEdit.k_parent;
		return k_parent.split('|').splice(-2,1).toString()
	}
	
	$scope.progr_am.fn.removeFromList=function(){
		var d = {
			o:$scope.oToEdit.o.splice($scope.oToEdit.selectedItem,1)[0],
			dataObj:$scope.oToEdit.dataObj.splice($scope.oToEdit.selectedItem,1)[0],
		}
		return d
	}

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

