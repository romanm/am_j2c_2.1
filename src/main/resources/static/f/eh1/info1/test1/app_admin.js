var editData_init_obj = function(o,k){
	var d = new Date(o[k]);
	d.setDate(o[k+'Date'].d)
	d.setMonth(-1+o[k+'Date'].m);
	d.setFullYear(o[k+'Date'].y)
	o[k] = d;
	return o[k].toISOString().replace('T',' ').replace('Z','')
}

var setRowEditObj = function(parentObj,obj){
	parentObj.editObj = obj;
	parentObj.editObj_id = obj.row_id;
}

var init_editData_obj = function(o,k){
	var d = new Date(o[k]);
	o[k+'Date'] = {d:d.getDate(),m:1+d.getMonth(),y:d.getFullYear()}
}

var j2c_minus_row = function(parentO, $http, fn_after_update){
	console.log(parentO)

	console.log(parentO.editObj)
	var data={
		sql:'sql2.j2c.deleteRowId2',
		row_id:parentO.editObj.row_id,
	}
	console.log(data);
	$http.post('/r/update2_sql_with_param', data).then(function(response) {
		console.log(response.data);
		parentO.editObj = null;
		parentO.editObj_id = null;
		console.log(parentO)
		if(fn_after_update)
			fn_after_update();
	});
}

var j2c_cell_constraint_update = function(programRunObj,cell_id,constraint,col_id, $http, fn_after_update){
	console.log(programRunObj)
	if(!programRunObj.editObj){
		programRunObj.error = 'для внесення даних пацієнта оберіть стрічку в таблиці '
			+programRunObj.messages.tableName;
		console.log(programRunObj.error)
		return;
	}else{
		delete programRunObj.error;
	}

	if(programRunObj.editObj[cell_id]){
		var data={
			sql:'sql2.j2c.updateCellWithConstraint',
			reference2:constraint,
			doc_id:programRunObj.editObj[cell_id],
		}
		console.log(data);
		$http.post('/r/update2_sql_with_param', data).then(function(response) {
			console.log(response.data);
			if(fn_after_update)
				fn_after_update(programRunObj.editObj.row_id);
		});
	}else{
		var data={
			sql:'sql2.j2c.insertCellWithConstraint',
			parent_id:programRunObj.editObj.row_id,
			reference:col_id,
			reference2:constraint,
		}
		console.log(data);
		$http.post('/r/update2_sql_with_param', data).then(function(response) {
			console.log(response.data);
			var nextDbId1 = response.data.nextDbId1;
			console.log(nextDbId1);
			programRunObj.editObj[cell_id] = nextDbId1;
			console.log(programRunObj.editObj[cell_id]);
			if(fn_after_update)
				fn_after_update(programRunObj.editObj.row_id);
		});
	}
}

var j2c_persist2 = function(editObj, k, value, cln, $http, fn_after_update){
	var data={ value:value }
	if(editObj[k+'_id']){
		data.sql='sql2.'+cln.col_table_name+'.updateCellById';
		data.data_id=editObj[k+'_id'];
		console.log(data);
		$http.post('/r/update2_sql_with_param', data).then(function(response) {
			console.log(response.data);
			if(fn_after_update)
				fn_after_update();
		});
	}else{
		data.sql='sql2.'+cln.col_table_name+'.insertCellId';
		data.row_id=editObj.row_id;
		data.cln_id=cln.cln_id;
		console.log(data);
		$http.post('/r/update2_sql_with_param', data).then(function(response) {
			console.log(response.data);
			console.log(response.data.nextDbId1);
			editObj[k+'_id'] = response.data.nextDbId1;
			console.log(editObj)
			if(fn_after_update)
				fn_after_update();
		});
	}
}

var j2c_persist = function(editObj, k, cln, $http, fn_after_update){
	j2c_persist2 (editObj, k, editObj[k], cln, $http, fn_after_update);
}

init_am_directive.init_onload.icpc2_test_report=function($scope, $http){
	console.log('--------init_am_directive.init_onload.icpc2_test_report---------------')
	console.log($scope.page)

	$scope.programRun = {
		f74_day_count:{
			programFile:{
				commonArgs:{scopeObj:'f74_day_count'},
				TablesJ2C:{param:{sql:'sql2.f74_day_report.select',table_id:9765,url:'/r/read2_sql_with_param'}
				},
				html_form_type01:{
					source_path:'/f/eh1/info1/test1/f74_day_count.html',
					init:function(ele, v){
						init_am_directive.ele_v.html_form_type01(ele, v);
					}
				},
			},
		}
	}
}

var init_icpc2_test = function($scope, $http){

	console.log('--------init_am_directive.init_onload.icpc2_test---------------')
	
		var getMsp_id = function(){
			var msp_id = 188;
			if($scope.principal && $scope.principal.msp_id){
				var msp_id = $scope.principal.msp_id;
			}
			console.log(msp_id);
			return msp_id;
		}

		$scope.$watch('principal',function(){
			console.log('----------39------')
			var param = $scope.programRun.icpc2_nakaz74.programFile.TablesJ2C.param;
			param.msp_id = getMsp_id();
			console.log(param)
			read_sql_with_param($http, param, function(response){
				if(!$scope.icpc2_nakaz74)
					$scope.icpc2_nakaz74={};
				$scope.icpc2_nakaz74.list = response.data.list;
			});
			read_sql_with_param($http, {sql:'sql.msp_employee.list',msp_id:getMsp_id()}, function(response){
				$scope.f74_physician_id = 183;
				console.log(response.data)
				$scope.msp_employee={};
				angular.forEach(response.data.list, function(v, k){
					$scope.msp_employee[v.person_id]=v;
				});
				console.log($scope.msp_employee)
			});
		});


	var j2c_add_row = function(tbl_id, $http, fn_after_update){
		var data={
			sql:'sql2.j2c.insertRow2',
			tbl_id:tbl_id,
			reference2:$scope.f74_physician_id,
		}
		console.log(data);
		$http.post('/r/update2_sql_with_param', data).then(function(response) {
			console.log(response.data);
			var nextDbId1 = response.data.nextDbId1;
			if(fn_after_update)
				fn_after_update(nextDbId1);
		});
	}

	var reread_nakaz74 = function(editObj_id){
		var param = $scope.programRun.icpc2_nakaz74.programFile.TablesJ2C.param;
		read_sql_with_param($http, param, function(response){
			$scope.icpc2_nakaz74.list = response.data.list;
			for(i in $scope.icpc2_nakaz74.list)
				if($scope.icpc2_nakaz74.list[i].row_id==editObj_id){
					setRowEditObj($scope.programRun.icpc2_nakaz74,$scope.icpc2_nakaz74.list[i]);
					break;
				}
		});
	}

	$scope.$watch('seekIcpc2Patient', function(newValue){
//		if(newValue){
			var sql = 'sql2.table.select';
			if(newValue)
				sql +='_seekPatient'
			var seekPatient = '%'+newValue+'%';
			console.log(seekPatient+' -*- '+sql);

			read_sql_with_param($http, {sql:sql, table_id:9765, seekPatient:seekPatient}, function(response){
				if(!$scope.icpc2_patient)
					$scope.icpc2_patient={};
				$scope.icpc2_patient.list=response.data.list;
			});
//		}
	});

	$scope.$watch('seekIcpc2', function(newValue){if(newValue){
		console.log(newValue)
		var sql = 'sql2.icpc2.seek';
		console.log($scope.programRun.icpc2_list.seekInIcpc2Part)
		if($scope.programRun.icpc2_list.seekInIcpc2Part){
			sql +='_'+$scope.programRun.icpc2_list.seekInIcpc2Part; 
		}
		console.log(sql)
		read_sql_with_param($http, {sql:sql,seek:'%'+newValue+'%'}, function(response){
			$scope.icpc2_list.list=response.data.list;
			console.log(response.data)
		});
	}});

	$scope.$watch('seekIcd10', function(newValue){if(newValue){
		console.log(newValue)
		read_sql_with_param($http, {sql:'sql2.icd10.seek',doctype:89,seek:'%'+newValue+'%'}, function(response){
			$scope.icd10.list=response.data.list;
			console.log(response.data)
		});
	}});

	$scope.programRun = {
		icpc2_patient:{
			programFile:{
				commonArgs:{scopeObj:'icpc2_patient'},
				TablesJ2C:{param:{sql:'sql2.table.select',table_id:9765,url:'/r/read2_sql_with_param'}
				},
				html_form_type01:{
					source_path:'/f/eh1/info1/test1/icpc2_patient-table.html',
					init:function(ele, v){
						init_am_directive.ele_v.html_form_type01(ele, v);
					}
				},
			},
			minus_patient:function(){
				j2c_minus_row(this, $http)
			},
			add_patient:function(){
				var tbl_id = $scope.icpc2_patient.list[0].tbl_id;
				j2c_add_row(tbl_id, $http)
			},
			blurDate:function(k){
				console.log(this.editObj)
				console.log(k)
				console.log($scope.icpc2_patient.col_alias)
				var cln = $scope.icpc2_patient.col_alias[k.split('_')[1]];
				console.log(cln)
				var dateToSave = editData_init_obj(this.editObj,k);
				console.log(dateToSave)
				j2c_persist2(this.editObj, k, dateToSave, cln, $http);
			},
			blur:function(k){
				console.log($scope.icpc2_patient.col_alias)
				var cln = $scope.icpc2_patient.col_alias[k.split('_')[1]];
				//var editObj = this.editObj;
				j2c_persist(this.editObj, k, cln, $http);
			},
			addPatientToICPC2:function(patient){
				j2c_cell_constraint_update(
					$scope.programRun.icpc2_nakaz74, 
					'col_10766_id', 
					patient.row_id,
					10766,
					$http,
					reread_nakaz74
				);
				this.edit(patient);
			},
			correctPatientData:function(editObj){
				if(this.patientDataToCorrect == editObj){
					delete this.patientDataToCorrect;
				}else{
					this.patientDataToCorrect = editObj;
				}

			},
			edit:function(editObj){
				if(this.editObj == editObj){
					this.editObj = null;
				}else{
					setRowEditObj(this,editObj);
					init_editData_obj(this.editObj, 'col_10823');
					console.log(this.editObj)
				}
			},
		},
		icpc2_list:{
			programFile:{
				commonArgs:{scopeObj:'icpc2_list'},
				TablesJ2C:{param:{sql:'sql2.icpc2.select',url:'/r/read2_sql_with_param'},
					col_keys:{
						code:'Код',
						value:'Назва',
						doc_id:'ІН',
						part:'Група',
						doctype:'zГрупа',
					},
				},
				html_form_type01:{
					source_path:'/f/eh1/info1/test1/icpc2_list-table.html',
					init:function(ele, v){
						init_am_directive.ele_v.html_form_type01(ele, v);
					}
				},
			},
			setSeek_icpc2:function(seekInIcpc2Part){
				this.seekInIcpc2Part=seekInIcpc2Part;
				console.log(seekInIcpc2Part)
			},
			save_icpc2:function(icpc2){
				console.log(icpc2);
				console.log(10807);
				if(icpc2.parent_id==857){
					j2c_cell_constraint_update(
						$scope.programRun.icpc2_nakaz74, 
						'col_10807_id', 
						icpc2.doc_id,
						10807,
						$http,
						reread_nakaz74
					);
				}else{
					j2c_cell_constraint_update(
						$scope.programRun.icpc2_nakaz74, 
						'col_10771_id', 
						icpc2.doc_id,
						10771,
						$http,
						reread_nakaz74
					);
				}
			}
		},
		icd10:{
			programFile:{
				commonArgs:{scopeObj:'icd10'},
				TablesJ2C:{param:{sql:'sql2.icd10.select',doctype:89},
					col_keys:{
						icd_code:'Код',
						icd_name:'Діагноз',
						doc_id:'ІН',
					},
					col_links:{
						doc_id:{k:'dz_id',vk:'doc_id'},
					},
				},
				html_form_type01:{
					source_path:'/f/eh1/info1/test1/icd10n74-table.html',
					init:function(ele, v){
						console.log('----22------html_form_type01------');
						init_am_directive.ele_v.html_form_type01(ele, v);
					}
				},
			},
			save_icd10Value:function(icd10){
				if($scope.programRun.icpc2_nakaz74.editObj){
					j2c_cell_constraint_update(
						$scope.programRun.icpc2_nakaz74, 
						'col_10777_id', 
						icd10.doc_id,
						10777,
						$http,
						reread_nakaz74
					);
				}else{
					console.log('оберіть стрічку запису в таблиці наказ 74')
				}
			},
			click_icd10Value:function(icd10){
				this.save_icd10Value(icd10)
				if($scope.icd10.values &&
					$scope.icd10.values.parent.doc_id==icd10.doc_id
				){
					delete $scope.icd10.values;
				}else{
					read_sql_with_param($http, {sql:'sql2.icd10value.seek',doctype:91,parent_id:icd10.doc_id}, function(response){
						$scope.icd10.values={parent:icd10};
						$scope.icd10.values.list=response.data.list;
						console.log($scope.icd10)
					});
				}
			}
		},
		icpc2_nakaz74:{
			programFile:{
				commonArgs:{scopeObj:'icpc2_nakaz74'},
				TablesJ2C:{param:{sql:'sql2.j2c_table.selectByIdDesc',msp_id:188,table_id:9774,url:'/r/read2_sql_with_param'}
				},
				html_form_type01:{
					source_path:'/f/eh1/info1/test1/icpc2_nakaz74-table.html',
					init:function(ele, v){
						init_am_directive.ele_v.html_form_type01(ele, v);
					}
				},
			},
			minus_row:function(){
				j2c_minus_row(this, $http, reread_nakaz74)
			},
			add_row:function(){
				var tbl_id = $scope.icpc2_nakaz74.list[0].tbl_id;
				j2c_add_row(tbl_id, $http, reread_nakaz74)
			},
			click:function(k){
				console.log(k);
				var cln = $scope.icpc2_nakaz74.col_alias[k.split('_')[1]];
				j2c_persist(this.editObj, k, cln, $http);
			},
			changeCreateDate:function(){
				created = editData_init_obj(this.editObj,'created');
				var data={
					sql:'sql2.j2c.updateCreatedDate',
					doctimestamp_id:this.editObj.row_id,
					created:created,
				}
				console.log(data);
				$http.post('/r/update2_sql_with_param', data).then(function(response) {
					console.log(response.data);
					reread_nakaz74(data.doctimestamp_id);
				});
			},
			edit:function(icpc2){
				if(this.editObj == icpc2){
					this.editObj = null;
				}else{
					setRowEditObj(this,icpc2);
					init_editData_obj(this.editObj, 'created');
					console.log(this.editObj)
				}
			},
			colValues:function(k, icpc2){
				var vK = this.colValuesKey[k];
				if(vK){
					var values = this[vK].values;
					return values;
				}

			},
			colValue:function(k, icpc2){
				var vK = $scope.programRun.icpc2_nakaz74.colValuesKey[k];
				if(vK){
					var values = $scope.programRun.icpc2_nakaz74[vK].values;
					var icpc2_k = icpc2[k];
					return values[icpc2_k];
				}
			},
			colValuesKey:{
				col_9775:'episode',
				col_9776:'consultare_type',
				col_10900:'town_village',
				col_9777:'exemption_type',
			},
			town_village:{
				values:{
					1:'місто',
					2:'село',
				}
			},
			exemption_type:{
				values:{
					1:'інвалід війни',
					2:'учасник війни',
					3:'учасник бойових дій',
					4:'пільги - ветеранів війни',
					5:'інвалід',
					6:'чорнобилець',
					7:'евакуйований зони відчуженя',
					8:'житель зони радіоекологічного контролю',
					9:'діти батьків 6-8 категорії',
					10:'інша пільгова категорія',
					0:'-',
				}
			},
			consultare_type:{
				values:{
					1:'амбулаторно',
					2:'вдома',
					3:'по телефону',
				}
			},
			episode:{
				values:{
					1:'первинне',
					2:'повторне',
					3:'зевершення епізоду',
				}
			},
			messages:{
				tableName:'ICPC2 наказ Nr 74',
			}
		},
	}
}

init_am_directive.init_onload.icpc2_test2=function($scope, $http){
	init_icpc2_test($scope, $http);
}
init_am_directive.init_onload.icpc2_test=function($scope, $http){
	init_icpc2_test($scope, $http);
}

var url_read_sql_with_param = '/r/read2_sql_with_param';
init_am_directive.init_onload.app_admin=function($scope, $http){
	console.log('--------init_am_directive.init_onload.app_admin---------------')
	console.log($scope)

	$scope.$watch('seekIcd10', function(newValue){if(newValue){
		console.log(newValue)
		read_sql_with_param($http, {sql:'sql2.icd10.seek',doctype:89,seek:'%'+newValue+'%'}, function(response){
			$scope.icd10.list=response.data.list;
			console.log(response.data)
		});
	}});

	$scope.programRun = {
		folders:{
			programFile:{
				commonArgs:{scopeObj:'folders'},
				TablesJ2C:{param:{sql:'sql2.stringDocType.select',doctype:56},
					col_keys:{
						name:'Папки',
						doc_id:'ІН',
					},
					col_links:{
						doc_id:{k:'doc_id',vk:'doc_id'},
					},
				},
				html_tableJ2C:{}
			}
		},
		datadictionary:{
			programFile:{
				commonArgs:{scopeObj:'datadictionary'},
//				TablesJ2C:{param:{sql:'sql2.stringDocType.select',doctype:6},
				TablesJ2C:{param:{sql:'sql2.ddtable.select',doctype:6},
					col_keys:{
						name:'Словник',
						doc_id:'ІН',
					},
					col_links:{
						doc_id:{k:'dd_id',vk:'doc_id'},
					},
				},
				html_tableJ2C:{}
			}
		},
		icpc2:{
			programFile:{
				commonArgs:{scopeObj:'icpc2'},
				TablesJ2C:{param:{sql:'sql2.icpc2.select',doctype:6},
					col_keys:{
						code:'Код',
						value:'Назва',
						doc_id:'ІН',
						part:'Група',
						doctype:'zГрупа',
					},
					col_links:{
						doc_id:{k:'dd_id',vk:'doc_id'},
					},
				},
				html_tableJ2C:{}
			},
			click_icd10Value:function(icd10){

			},
		},
		icd10:{
			programFile:{
				commonArgs:{scopeObj:'icd10'},
				TablesJ2C:{param:{sql:'sql2.icd10.select',doctype:89},
					col_keys:{
						icd_code:'Код',
						icd_name:'Діагноз',
						doc_id:'ІН',
					},
					col_links:{
						doc_id:{k:'dz_id',vk:'doc_id'},
					},
				},
				html_form_type01:{
					source_path:'/f/eh1/info1/test1/icd10-table.html',
					init:function(ele, v){
						console.log('----22------html_form_type01------');
						init_am_directive.ele_v.html_form_type01(ele, v);
					}
				},
			},
			click_icd10Value:function(icd10){
				console.log(icd10)
				console.log(icd10.doc_id)
				if($scope.icd10.values &&
					$scope.icd10.values.parent.doc_id==icd10.doc_id
				){
					delete $scope.icd10.values;
				}else{
					read_sql_with_param($http, {sql:'sql2.icd10value.seek',doctype:91,parent_id:icd10.doc_id}, function(response){
						$scope.icd10.values={parent:icd10};
						$scope.icd10.values.list=response.data.list;
						console.log($scope.icd10)
					});
				}
			}
		},
	}

}
