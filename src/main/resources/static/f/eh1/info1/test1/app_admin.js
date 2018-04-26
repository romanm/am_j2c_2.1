var j2c_minus_row = function(editObj){
	console.log($scope.icpc2_patient)
	console.log(editObj)
	var data={
		sql:'sql2.j2c.deleteRowId',
		row_id:editObj.row_id,
	}
	console.log(data);
	$http.post('/r/update2_sql_with_param', data).then(function(response) {
		console.log(response.data);
	});
}

var j2c_cell_constraint_update = function(cell_id,constraint,col_id,row_id, $http, fn_after_update){
	if(cell_id){
		var data={
			sql:'sql2.j2c.updateCellWithConstraint',
			reference2:constraint,
			doc_id:cell_id,
		}
		console.log(data);
		$http.post('/r/update2_sql_with_param', data).then(function(response) {
			console.log(response.data);
			if(fn_after_update)
				fn_after_update();
		});
	}else{
		var data={
			sql:'sql2.j2c.insertCellWithConstraint',
			parent_id:row_id,
			reference:col_id,
			reference2:constraint,
		}
		console.log(data);
		$http.post('/r/update2_sql_with_param', data).then(function(response) {
			console.log(response.data);
			if(fn_after_update)
				fn_after_update();
		});
	}
}

var j2c_add_row = function(tbl_id, $http){
	var data={
			sql:'sql2.j2c.insertRow',
			tbl_id:tbl_id,
	}
	console.log(data);
	$http.post('/r/update2_sql_with_param', data).then(function(response) {
		console.log(response.data);
	});
}

var j2c_persist = function(editObj, k, cln, $http, fn_after_update){
	console.log('j2c_persist');
	console.log(editObj);
	console.log(k);
	console.log(cln)
	var data={
		value:editObj[k],
	}
	if(editObj[k+'_id']){
		data.sql='sql2.'+cln.col_table_name+'.updateById';
		data.data_id=editObj[k+'_id'];
		console.log(data);
		$http.post('/r/update2_sql_with_param', data).then(function(response) {
			console.log(response.data);
			if(fn_after_update)
				fn_after_update();
		});
	}else{
		data.sql='sql2.'+cln.col_table_name+'.insertRowId';
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

init_am_directive.init_onload.icpc2_test=function($scope, $http){
	console.log('--------init_am_directive.init_onload.icpc2_test---------------')

	var reread_nakaz74 = function(){
		var param = $scope.programRun.icpc2_nakaz74.programFile.TablesJ2C.param;
		read_sql_with_param($http, param, function(response){
			$scope.icpc2_nakaz74.list=response.data.list
		});
	}

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
				ht1ml_tableJ2C:{}
			},
			minus_patient:function(){
				j2c_minus_row(this.editObj)
			},
			add_patient:function(){
				var tbl_id = $scope.icpc2_patient.list[0].tbl_id;
				j2c_add_row(tbl_id, $http)
			},
			blur:function(k){
				console.log($scope.icpc2_patient.col_alias)
				var cln = $scope.icpc2_patient.col_alias[k.split('_')[1]];
				var editObj = this.editObj;
				j2c_persist(this.editObj, k, cln, $http);
			},
			addICPC2:function(patient){
				j2c_cell_constraint_update(
					$scope.programRun.icpc2_nakaz74.editObj.col_10766_id, 
					patient.row_id,
					10766,
					$scope.programRun.icpc2_nakaz74.editObj.row_id,
					$http,
					reread_nakaz74
				);
			},
			edit:function(patient){
				if(this.editObj == patient){
					this.editObj = null;
				}else{
					console.log(patient)
					console.log(this)
					this.editObj = patient;
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
						$scope.programRun.icpc2_nakaz74.editObj.col_10807_id, 
						icpc2.doc_id,
						10807,
						$scope.programRun.icpc2_nakaz74.editObj.row_id,
						$http,
						reread_nakaz74
					);
				}else{
					j2c_cell_constraint_update(
						$scope.programRun.icpc2_nakaz74.editObj.col_10771_id, 
						icpc2.doc_id,
						10771,
						$scope.programRun.icpc2_nakaz74.editObj.row_id,
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
						$scope.programRun.icpc2_nakaz74.editObj.col_10777_id, 
						icd10.doc_id,
						10777,
						$scope.programRun.icpc2_nakaz74.editObj.row_id,
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
				TablesJ2C:{param:{sql:'sql2.table2.select',table_id:9774,url:'/r/read2_sql_with_param'}
				},
				html_form_type01:{
					source_path:'/f/eh1/info1/test1/icpc2_nakaz74-table.html',
					init:function(ele, v){
						init_am_directive.ele_v.html_form_type01(ele, v);
					}
				},
			},
			minus_row:function(){
				j2c_minus_row(this.editObj)
			},
			add_row:function(){
				var tbl_id = $scope.icpc2_nakaz74.list[0].tbl_id;
				j2c_add_row(tbl_id, $http)
			},
			click:function(k){
				console.log(k);
				var cln = $scope.icpc2_nakaz74.col_alias[k.split('_')[1]];
				j2c_persist(this.editObj, k, cln, $http);
			},
			edit:function(icpc2){
				if(this.editObj == icpc2){
					this.editObj = null;
				}else{
					console.log(icpc2)
					console.log(this)
					this.editObj = icpc2;
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
				col_9777:'exemption_type',
			},
			exemption_type:{
				values:{
					1:'чорнобелець',
					2:'ветеран',
					3:'мати-героїня',
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
			}
		},
	}
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
