init_f74_ngClick = function(icpc2_nakaz74, $scope, $http){
	console.log('-----init_f74_ngClick-----------------------')

	icpc2_nakaz74.closeDropdown=function(){
		if(icpc2_nakaz74.selectedCell)
			icpc2_nakaz74.selectedCell.close=true;
		console.log(icpc2_nakaz74.selectedCell)
	}
													
	icpc2_nakaz74.getColValue=function(row,col_key){
		if(row[col_key]){
			if('col_9775|col_9776|col_10900'.indexOf(col_key)>=0)
				return row[col_key]+':'
				+$scope.icpc2_nakaz74
				.col_values[col_key][row[col_key]]
			else
				return row[col_key]
		}
	}

	icpc2_nakaz74.isRegistryDeleteAllowed = function(){
		if(icpc2_nakaz74.clickToSave.ask_confirm_delete.display == 'block'){
			var isRegistryDeleteAllowed = true
			var row = icpc2_nakaz74.data.list[icpc2_nakaz74.selectedCell.row_k]
			console.log(row)
			var cols = 'col_9775|col_10771|col_10777|col_10807|col_9776|col_10900'
			angular.forEach(cols.split('|'), function(k){
				if(row[k]){
					console.log(k)
					isRegistryDeleteAllowed = false
				}
			})
			return isRegistryDeleteAllowed
		}
	}

	icpc2_nakaz74.isCellSelect=function(row_k, col_k, row){
		if(icpc2_nakaz74.selectedCell && !icpc2_nakaz74.selectedCell.close){
			if(icpc2_nakaz74.selectedCell.row_id==row.row_id)
				return icpc2_nakaz74.selectedCell.row_k==row_k 
				&& icpc2_nakaz74.selectedCell.col_k==col_k
		}
	}
	
	icpc2_nakaz74.selectCell = function(row_k, col_k, row){
		if(icpc2_nakaz74.selectedCell 
			&& icpc2_nakaz74.selectedCell.col_k==col_k 
			&& icpc2_nakaz74.selectedCell.row_k==row_k
		){
			if('col_10766|col_10771|col_10807|col_10777'.indexOf(col_k)>=0){
//				if(icpc2_nakaz74.selectedCell.close)
//					delete icpc2_nakaz74.selectedCell
			}else{
//				delete icpc2_nakaz74.selectedCell
			}
		}else{
			var row = icpc2_nakaz74.data.list[row_k];
			icpc2_nakaz74.selectedCell = {
				row_k:row_k, 
				col_k:col_k, 
				row_id:row.row_id,
				row:row,
			}
			console.log(icpc2_nakaz74)
			console.log(icpc2_nakaz74.isEditRow(row))
		}
		console.log(icpc2_nakaz74.selectedCell)
	}
	
	icpc2_nakaz74.isEditRow = function(row){
		return icpc2_nakaz74.selectedCell &&
		icpc2_nakaz74.selectedCell.row_id==row.row_id
//		return $scope.editRow && row.row_id == $scope.editRow.row_id
	}

	$scope.f74_physician_id = 183;

	icpc2_nakaz74.clickToSave = {}
	$scope.dropdown_data = {seek:{},}
	$scope.dropdown_data
	.seek_placeholder = {
		col_10766:'знайти Пацієнта',
		col_10771:'знайти ICPC2 симптом',
		col_10807:'знайти ICPC2 процес',
		col_11327:'знайти ICPC2 діагноз',
		col_10777:'знайти МКХ10 діагноз',
	},
	$scope.dropdown_data.ngStyle = function(col_k){
		var style={}
		if('col_10777'==col_k){
			style.left='-150px';
			style['min-width']='450px';
		}else if('col_10766'==col_k){
			style['min-width']='400px';
		}else if('col_10900'==col_k){
			style.left='-90px';
		}else if('col_10807|col_10771|col_11327'.indexOf(col_k)>=0){
			style.left='-150px';
			style['min-width']='410px';
		}
		if('col_10807'.indexOf(col_k)>=0){
			style.left='-185px';
		}
		return style;
	},
	
	$scope.$watch('progr_am.icpc2_nakaz74.selectedCell.col_k',function(col_k){if(col_k){
		console.log(col_k)
		if(fn_lib['read_data_'+col_k])
			fn_lib['read_data_'+col_k]()
	}})

	$scope.$watch('dropdown_data.seek.col_10766',function(seek){if(seek){
		console.log(seek)
		fn_lib.read_data_col_10766()
	}})
	
	var url_read2_sql_with_param = '/r/read2_sql_with_param'
	fn_lib.read_data_col_10766=function(){ // Пацієнт
		console.log('--------read----dropdown--Пацієнт-------')
		var params={seekPatient:'%%'}
		if($scope.dropdown_data.seek.col_10766){
			params.seekPatient = '%'+$scope.dropdown_data.seek.col_10766+'%'
		}
		params.sql='sql2.table.select_seekPatient'
		params.table_id=9765
		$http.get(url_read2_sql_with_param, {params:params}).then(function(response) {
			$scope.dropdown_data.list=response.data.list
			$scope.dropdown_data.col_keys=response.data.col_keys
			console.log($scope.dropdown_data)
		})
	}
	
	icpc2_nakaz74.clickToSave.col_10766=function(row){//Patient
		console.log(row)
		var data={
			reference2:row.row_id,
			cell_value : row.col_9766+', '+row.col_9767
		}
		icpc2_nakaz74.clickToSave.ref2Cell(data, 
			'sql2.j2c.insertCellWithConstraint|sql2.j2c.updateCellWithConstraint')
	}
	
	icpc2_nakaz74.clickToSave.ref2Cell=function(data, sqlInsertUpdate){
		var editObj = icpc2_nakaz74.data.list[icpc2_nakaz74.selectedCell.row_k]
		var cell_id = editObj[icpc2_nakaz74.selectedCell.col_k+'_id']
		if(cell_id){
			data.sql = sqlInsertUpdate.split('|')[1]
			data.doc_id = cell_id 
			$http.post('/r/update2_sql_with_param', data).then(function(response) {
				editObj[icpc2_nakaz74.selectedCell.col_k+'_id'] = data.reference2 // cell_id
				editObj[icpc2_nakaz74.selectedCell.col_k] = data.cell_value
				delete icpc2_nakaz74.selectedCell.col_k
			});
		}else{ // insert
			data.sql = sqlInsertUpdate.split('|')[0]
			data.parent_id = editObj.row_id
			var col_id = icpc2_nakaz74.selectedCell.col_k.split('_')[1] 
			data.reference = col_id
			$http.post('/r/update2_sql_with_param', data).then(function(response) {
				editObj[icpc2_nakaz74.selectedCell.col_k+'_id'] = response.data.nextDbId1 // cell_id
				editObj[icpc2_nakaz74.selectedCell.col_k] = data.cell_value
				delete icpc2_nakaz74.selectedCell.col_k
			});
		}
	}

	icpc2_nakaz74.clickToSave.ask_confirm_delete = {display:'none'}
	icpc2_nakaz74.clickToSave.deleteRow = function(){
		var selectedCell =$scope.progr_am.icpc2_nakaz74.selectedCell; 
		console.log(selectedCell)
		var row = $scope.icpc2_nakaz74.data.list[selectedCell.row_k]
		console.log(row)
		var data={
			sql:'sql2.j2c.deleteRowId2',
			row_id:row.row_id,
		}
		console.log(data);
		$http.post('/r/update2_sql_with_param', data).then(function(response) {
			console.log(response.data)
			$scope.icpc2_nakaz74.data.list.splice(selectedCell.row_k, 1)
			icpc2_nakaz74.clickToSave.ask_confirm_delete = {display:'none'}
		});
	}

	icpc2_nakaz74.clickToSave.ngStyleAskDelete = function(){
		console.log(icpc2_nakaz74)
		console.log(icpc2_nakaz74.selectedCell)
		console.log(this.ask_confirm_delete)

		if(icpc2_nakaz74.selectedCell){
			console.log(1)
			if(icpc2_nakaz74.selectedCell.row_k>=0){
				console.log(2)
				this.ask_confirm_delete={display:'block'}
				console.log(this.ask_confirm_delete)

			}
		}
	}

	icpc2_nakaz74.clickToSave.add_row=function(){
		var r0 = icpc2_nakaz74.data.list[0]
		console.log(r0)
		if($scope.physicianData)
			$scope.f74_physician_id = $scope.physicianData.person_id;
		var data={
			sql:'sql2.j2c.insertRow2',
			tbl_id:r0.tbl_id,
			reference2:$scope.f74_physician_id,
		}
		console.log(data);
		$http.post('/r/update2_sql_with_param', data).then(function(response) {
			console.log(response.data);
			response.data.row_id = response.data.nextDbId1
			console.log(response.data.nextDbId1);
			icpc2_nakaz74.data.list.unshift(response.data);
			icpc2_nakaz74.data.list[0].created = response.data.list2[0].created
			icpc2_nakaz74.data.list[0].last_name = response.data.list2[0].last_name
			icpc2_nakaz74.data.list[0].first_name = response.data.list2[0].first_name
			icpc2_nakaz74.data.list[0].second_name = response.data.list2[0].second_name
				
			console.log(icpc2_nakaz74.data.list);
			icpc2_nakaz74.selectedCell = {
				row_k:0, 
				row_id:response.data.row_id,
			}
		});
	}
}

init2_read_f74_tables = function($scope, $http){
	console.log("--init2_read_f74_tables-----")
		$scope.table = {row_indexs:{},
		structure:{
			createdDay:{name:'день',_039o:'A'},
			cnt:{name:'кількість',_039o:'1'},
			village_10900:{name:'село',_039o:'2'},
			and_age017:{name:'вік 0-17',_039o:'3'},
			and_age017_village:{name:'вік 0-17 село',_039o:'4'},
			home_9776:{name:'відвідувань вдома',_039o:'9'},
		}
	};
	
	$scope.modal={
		physicianChoose:{}
	}

	$scope.$watch('modal.physicianChoose.display',function(newValue){if(newValue){
		if(newValue.display){
			console.log(app_fn.getMsp_id())
			$http.get(url_sql_read,{params:{msp_id:$scope.params.msp_id, 
				sql:sql2.f74_msp_physician__select()}}).then(function(response) {
					console.log(response.data)
					$scope.modal.physicianChoose.data = response.data;
				})
		}
	}})

	app_fn = new App_fn($scope, $http);	
	$scope.$watch('principalResponse',function(newValue){if(newValue){
		console.log('----$scope.$watch(principal,function()-----32------');
		var msp_id = app_fn.getMsp_id();
		$scope.params={msp_id:msp_id}
		app_fn.readTable()
	}});

	$scope.$watch('request.parameters.physician',function(newValue){if(newValue){
		console.log(newValue)
		$http.get(url_sql_read,{params:{person_id:newValue, 
			sql:sql2.f74_physician__select()}}).then(function(response) {
				$scope.physicianData = response.data.list[0];
				console.log($scope.physicianData)
			})
	}})

	$scope.keys_use = {}
	$scope.keys_use.keyUp = function($event){
//		console.log($event.key)
		if('Escape'==$event.key){
			if($scope.modal.physicianChoose)
				$scope.modal.physicianChoose.display={}
			if($scope.icpc2_nakaz74)
				if($scope.icpc2_nakaz74.selectedCell)
					delete $scope.icpc2_nakaz74.selectedCell.col_k
		}
	}
}

init_read_j2c_tables = function($scope, $http){
	init2_read_f74_tables($scope, $http);
	$scope.seekParam = {
		year:2018,
		setYear:function(year){this.year=year;},
		setMonth:function(month){
			if(this.month==month)
				delete this.month;
			else
				this.month=month;
		},
		getURL:function(){
			var url = '?year='+this.year 
			if(this.month)
				url += '&month='+this.month; 
			if(this.physician)
				url += '&physician='+this.physician; 

			return url;
		},
		initFromRequest:function(){
			console.log($scope.request.parameters)
			if($scope.request.parameters.physician)
				this.physician=$scope.request.parameters.physician;
			if($scope.request.parameters.month)
				this.setMonth($scope.request.parameters.month)
		}
	};
	$scope.seekParam.initFromRequest();
	//$scope.$watch('seekParam.physician',function(newValue){if(newValue){

	$scope.table.init = {read_cell:0,
		report_table:{select_rows_to_group:'f74_day_rows__select', column_to_group:'year_day', read_cell:0},
		report2_table:{select_rows_to_group:'f74_day_rows__select', column_to_group:'year', read_cell:0},
		data:{
			rows:'f74_case_rows__group',
			cells:{
				home_9776:{sql:'j2c_column_row__group',value:'2',value_type:'integer'},
				village_10900:{sql:'j2c_column_row__group',value:'2',value_type:'integer'},
				and_age017:{sql:'j2c_column_row__group2'},
				and_age017_village:{sql:'j2c_column_row__group2'},
			},
		},
	}
	console.log($scope.table)
	$scope.dayOfYearDate = function(year, dayOfYear){
		return new Date(new Date(year,0).setDate(dayOfYear));
	}
}

function composeSql(sql){// with :: compose make for compile
	var sqlParam = sql;
	var sql_split = spaceClean(sql).split('::');
	sql_split.forEach(function(sql,i){if(i>0){
		var fn_name = sql.split(' ')[0] 
		var sql_inner = sql3[fn_name]()
		sqlParam = sqlParam.replace('::'+fn_name, sql_inner)
		if(sqlParam.indexOf('::')>0)
			sqlParam = composeSql(sqlParam)

	}})
	return sqlParam;
}

function compileGroupSelect(sql, v, $scope){
	sql = composeSql(sql)
	var select_rows_to_group = sql2[v.select_rows_to_group]();
	if($scope.request.parameters.month){
		select_rows_to_group = 
		"SELECT * FROM (" +select_rows_to_group +") WHERE month="+$scope.request.parameters.month
	}
//	console.log(select_rows_to_group)
	sql = sql.replace(':select_rows_to_group',select_rows_to_group);
	sql = sql.replace(':column_to_group',v.column_to_group);
	sql = sql.replace(':column_to_group',v.column_to_group);
	sql = sql.replace(':column_to_group',v.column_to_group);
	sql = sql.replace(':column_to_group',v.column_to_group);
	sql = sql.replace(':column_to_group',v.column_to_group);
	//console.log(sql)
	return sql;
}

var App_fn = function($scope, $http){
	this.getMsp_id = function(){
		var msp_id = 188;
		if($scope.principal && $scope.principal.msp_id){
			var msp_id = $scope.principal.msp_id;
		}
		console.log(msp_id);
		return msp_id;
	}
	this.readTable = function(){
		angular.forEach($scope.table.init, function(report_table, report_table_name){
			if(report_table_name.indexOf('report')==0){
				report_table.data = 'data'+report_table_name.replace('report','').replace('_table','')
				var params = {msp_id:$scope.params.msp_id}
				if($scope.seekParam.physician){
					var sql = report_table.select_rows_to_group.replace('__','_physician__')
					report_table.select_rows_to_group=sql
					params.person_id=$scope.seekParam.physician
				}

				$scope.table.row_indexs[report_table_name]={}
				report_table.rows_select = sql2[$scope.table.init.data.rows]()
				report_table.rows_select = compileGroupSelect(report_table.rows_select, report_table, $scope)
				report_table.rows_select = spaceClean(report_table.rows_select)
				params.sql=report_table.rows_select
				$http.get(url_sql_read,{params:params}).then(function(response) {
					$scope.table[report_table.data] = response.data.list;
					$scope.table[report_table.data].forEach(function(v,k){
						$scope.table.row_indexs[report_table_name][v[report_table.column_to_group]]=k
					})
					
					angular.forEach($scope.table.init.data.cells, function(column_v, column_name){
						report_table[column_name] = sql2[column_v.sql]()
						if(column_name.indexOf('and_')==0){
							var select_cells_to_group =  'f74_'+column_name.replace('and_','')+'__select'  
							report_table[column_name] = compileGroupSelect(report_table[column_name], report_table, $scope)

							report_table[column_name] = report_table[column_name]
							.replace(':select_cells_to_group', composeSql(sql2[select_cells_to_group]()))
						}else{
							var column_id = column_name.split('_')[1]*1
							report_table[column_name] = compileGroupSelect(report_table[column_name], report_table, $scope)
							report_table[column_name] = report_table[column_name]
							.replace(':column_id', column_id)
						}
						report_table[column_name] = report_table[column_name]
						.replace(':column_name', column_name)
						.replace(':value_type', column_v.value_type)
						.replace(':value_type', column_v.value_type)
						.replace(':value', column_v.value);
						report_table[column_name]=spaceClean(report_table[column_name])
						params.sql=report_table[column_name]
//						$http.get(url_sql_read,{params:params}).then(function(response) {
						$http.get(url_sql_read,{params:{msp_id:$scope.params.msp_id, person_id:$scope.seekParam.physician, sql:report_table[column_name]}}).then(function(response) {
							response.data.list.forEach(function(v){
								var parent_v = $scope.table[report_table.data][$scope.table.row_indexs[report_table_name][v[report_table.column_to_group]]]
								parent_v[column_name]=v
								var cellsNames =Object.keys($scope.table.init.data.cells); 
							})
							report_table.read_cell++;
						})
					})
				});
			}
		})
	}
}

var url_sql_read = '/r/url_sql_read2';

function spaceClean(s){return s.replace(/\n/g, " ")}

var sql3= {
	j2c_column_row__group2:function(){
		return "SELECT :column_to_group, count(:column_to_group) :column_name " +
				"FROM (\n" +
				"::j2c_column_row__select2 \n" +
				") x  " +
				"GROUP BY :column_to_group"
	},
	j2c_column_row__select2:function(){
		return "SELECT cell.*,row.* FROM (:select_cells_to_group)  cell,(\n" +
		":select_rows_to_group\n" +
		") row WHERE row_id=cell.parent_id"
	},
	j2c_column_row__group:function(){
		return "SELECT :column_to_group, count(:column_to_group) :column_name " +
				"FROM (\n" +
				"::j2c_column_row__select \n" +
				") x WHERE value=:value " +
				"GROUP BY :column_to_group"
	},
	j2c_column_row__select:function(){
		return "SELECT cell.*,row.* FROM (::j2c_cell_column__select )  cell,(\n" +
		":select_rows_to_group\n" +
		") row WHERE row_id=cell.parent_id"
	},
	j2c_cell_column__select:function(){
		return "SELECT i.*, parent_id FROM :value_type i,doc WHERE :value_type_id=doc_id  AND reference=:column_id"
	},
	f74_case_rows__group:function(){
		return "SELECT :column_to_group createdDay,  " +
				":column_to_group, count(:column_to_group) cnt " +
				"FROM (\n" +
				":select_rows_to_group" +
				") x GROUP BY :column_to_group\n" +
				"ORDER BY :column_to_group"
	},
	f74_age017_village__select:function(){
		return "::f74_age017__select " +
				"AND parent_id IN (SELECT parent_id FROM doc, integer WHERE doc_id=integer_id AND value=2 AND reference=10900)"
	},
	f74_age017__select:function(){
		return "SELECT * FROM ( SELECT datediff('YEAR',value,created) age, age.parent_id  FROM (\n" +
				"SELECT * FROM (\n" +
				"SELECT parent_id ,reference2 row_id_in_ref_table, t.* FROM doc, doctimestamp t " +
				"WHERE parent_id=doctimestamp_id AND reference=10766" +
				") cell, (" +
				"SELECT parent_id row_id, t.* FROM doc, timestamp t WHERE doc_id=timestamp_id AND reference=10823" +
				") refcell \n" +
				"WHERE row_id=row_id_in_ref_table" +
				") age ) age WHERE age<18"
	},
	f74_physician__select:function(){
		return "SELECT * FROM person WHERE person_id=:person_id";
	},
	f74_msp_physician__select:function(){
		return "SELECT * FROM doc, person WHERE parent_id=person_id AND reference=:msp_id";
	},
	f74_day_rows__select:function(){
		return "SELECT day_of_year(created) year_day, month(created) month, year(created) year, x.* FROM (\n" +
				"SELECT doc_id row_id, ds.*, reference2 FROM doc row, doctimestamp ds \n" +
				"WHERE row.doc_id=doctimestamp_id AND row.parent_id=9774 AND NOT row.removed AND row.doctype=9 \n" +
				") x WHERE YEAR(created)=2018 \n" +
				"AND reference2 in (SELECT DISTINCT parent_id FROM doc, person WHERE parent_id=person_id AND reference=:msp_id)"
	},
	f74_day_rows_physician__select:function(){
		return "SELECT day_of_year(created) year_day, month(created) month, year(created) year, x.* FROM (\n" +
				"SELECT doc_id row_id, ds.*, reference2 FROM doc row, doctimestamp ds \n" +
				"WHERE row.doc_id=doctimestamp_id AND row.parent_id=9774 AND NOT row.removed AND row.doctype=9 \n" +
				") x WHERE YEAR(created)=2018 \n" +
				"AND reference2 in (:person_id)"
	},
	f74_icpc2_seek__select:function(){
		return "SELECT * FROM ( \n" +
				"SELECT c1.code||c2.code code, s2.value, d2.doc_id, d2.parent_id, s1.value part, d2.doctype \n" +
				"FROM string s2, doc d1, doc d2, string s1, code c2, code c1 \n" +
				"WHERE d1.doc_id=d2.parent_id AND d1.doctype=57 AND s2.string_id=d2.doc_id AND s1.string_id=d1.doc_id AND c2.code_id=d2.doc_id AND c1.code_id=d1.doc_id \n" +
				") x " +
				"WHERE LOWER(value) LIKE LOWER(:seek) OR LOWER(code) LIKE LOWER(:seek) LIMIT 20";
	},
	f74_icpc2_seekProcess__select:function(){
		return "::f74_icpc2_seek2__select AND parent_id=857  LIMIT 20";
	},
	f74_icpc2_seek3__select:function(){
		return "::f74_icpc2_seek2__select  LIMIT 20";
	},
	f74_icpc2_seekSymptom__select:function(){
		return "::f74_icpc2_seek2__select  AND doctype=59  LIMIT 20";
	},
	f74_icpc2_seekProcess__select:function(){
		return "::f74_icpc2_seek2__select  AND doctype IN (57)  LIMIT 20";
	},
	f74_icpc2_seekDiagnose__select:function(){
		return "::f74_icpc2_seek2__select  AND doctype IN (60,92,93,94,95)  LIMIT 20";
	},
	f74_icpc2_seek2__select:function(){
		//"SELECT c1.code||c2.code code, s2.value, d2.doc_id, d2.parent_id, s1.value part, d2.doctype \n" +
		return "SELECT * FROM ( \n" +
				"SELECT c1.code||c2.code code, s2.value, d2.doc_id, d2.parent_id, d2.doctype \n" +
				"FROM string s2, doc d1, doc d2, string s1, code c2, code c1 \n" +
				"WHERE d1.doc_id=d2.parent_id AND d1.doctype=57 AND s2.string_id=d2.doc_id AND s1.string_id=d1.doc_id AND c2.code_id=d2.doc_id AND c1.code_id=d1.doc_id \n" +
				") x " +
				"WHERE (LOWER(value) LIKE LOWER(:seek) OR LOWER(code) LIKE LOWER(:seek)) ";
	},
	read_f74_select1:function(){
		return " SELECT * FROM (SELECT rws.parent_id tbl_id, rws.doc_id row_id \n" +
				" , col_9775_id, col_9775 , col_9776_id, col_9776 , col_9777_id, col_9777 , col_10766_id, col_10766 , col_10771_id, col_10771 , col_10777_id, col_10777 , col_10807_id, col_10807 , col_10900_id, col_10900 \n" +
				"FROM doc tbl, doc rws \n" +
				"LEFT JOIN (SELECT doc_id col_9775_id, value col_9775, parent_id col_9775_row, reference column_9775_id  FROM doc cd, integer cv \n" +
				" WHERE cd.doc_id=cv.integer_id AND doctype=10) col_9775 ON column_9775_id=9775 AND col_9775_row=rws.doc_id \n" +
				"LEFT JOIN (SELECT doc_id col_9776_id, value col_9776, parent_id col_9776_row, reference column_9776_id  FROM doc cd, integer cv \n" +
				" WHERE cd.doc_id=cv.integer_id AND doctype=10) col_9776 ON column_9776_id=9776 AND col_9776_row=rws.doc_id \n" +
				"LEFT JOIN (SELECT doc_id col_9777_id, value col_9777, parent_id col_9777_row, reference column_9777_id  FROM doc cd, integer cv \n" +
				" WHERE cd.doc_id=cv.integer_id AND doctype=10) col_9777 ON column_9777_id=9777 AND col_9777_row=rws.doc_id \n" +
				"LEFT JOIN (SELECT \n" +
				" cell.doc_id col_10766_id \n" +
				", col_9766||', тел.'||col_9767 col_10766 \n" +
				", cell.parent_id col_10766_row \n" +
				", cell.reference column_10766_id \n" +
				"  FROM ( \n" +
				"SELECT rws.parent_id tbl_id, rws.doc_id row_id \n" +
				" , col_9766_id, col_9766 , col_9767_id, col_9767 \n" +
				"FROM doc tbl, doc rws \n" +
				"LEFT JOIN (SELECT doc_id col_9766_id, value col_9766, parent_id col_9766_row, reference column_9766_id  FROM doc cd, string cv \n" +
				" WHERE cd.doc_id=cv.string_id AND doctype=10) col_9766 ON column_9766_id=9766 AND col_9766_row=rws.doc_id \n" +
				"LEFT JOIN (SELECT doc_id col_9767_id, value col_9767, parent_id col_9767_row, reference column_9767_id  FROM doc cd, string cv \n" +
				" WHERE cd.doc_id=cv.string_id AND doctype=10) col_9767 ON column_9767_id=9767 AND col_9767_row=rws.doc_id \n" +
				"WHERE tbl.doc_id=9765 AND tbl.doc_id=rws.parent_id AND rws.doctype=9 \n" +
				") x, doc cell where cell.reference2=x.row_id) col_10766 ON column_10766_id=10766 AND col_10766_row=rws.doc_id \n" +
				"LEFT JOIN (SELECT \n" +
				"cell.reference column_10771_id \n" +
				", x.code||':'||x.value col_10771 \n" +
				",  cell.doc_id col_10771_id \n" +
				", cell.parent_id col_10771_row \n" +
				"FROM ( \n" +
				"SELECT c1.code||c2.code code, s2.value, d2.doc_id, d2.parent_id, s1.value part, d2.doctype \n" +
				"FROM string s2, doc d1, doc d2, string s1, code c2, code c1 \n" +
				"WHERE d1.doc_id=d2.parent_id AND d1.doctype=57 \n" +
				"AND s2.string_id=d2.doc_id \n" +
				"AND s1.string_id=d1.doc_id \n" +
				"AND c2.code_id=d2.doc_id \n" +
				"AND c1.code_id=d1.doc_id \n" +
				") x, doc cell WHERE cell.reference2=x.doc_id) col_10771 ON column_10771_id=10771 AND col_10771_row=rws.doc_id \n" +
				"LEFT JOIN (SELECT \n" +
				"  cell.doc_id col_10777_id \n" +
				", cell.reference column_10777_id \n" +
				", cell.parent_id col_10777_row \n" +
				", x.icd_code||':'||x.icd_name col_10777 \n" +
				"  FROM ( \n" +
				"SELECT d.doc_id, i.* FROM icd i, doc d, icd10uatree t \n" +
				"where i.icd_id=icd10uatree_id and t.doc_id=d.doc_id and  doctype in (89,91) \n" +
				") x , doc cell WHERE cell.reference2=x.doc_id) col_10777 ON column_10777_id=10777 AND col_10777_row=rws.doc_id \n" +
				"LEFT JOIN (SELECT \n" +
				"cell.reference column_10807_id \n" +
				", x.code||':'||x.value col_10807 \n" +
				",  cell.doc_id col_10807_id \n" +
				", cell.parent_id col_10807_row \n" +
				"FROM ( \n" +
				"SELECT c1.code||c2.code code, s2.value, d2.doc_id, d2.parent_id, s1.value part, d2.doctype \n" +
				"FROM string s2, doc d1, doc d2, string s1, code c2, code c1 \n" +
				"WHERE d1.doc_id=d2.parent_id AND d1.doctype=57 \n" +
				"AND s2.string_id=d2.doc_id \n" +
				"AND s1.string_id=d1.doc_id \n" +
				"AND c2.code_id=d2.doc_id \n" +
				"AND c1.code_id=d1.doc_id \n" +
				") x, doc cell WHERE cell.reference2=x.doc_id) col_10807 ON column_10807_id=10807 AND col_10807_row=rws.doc_id \n" +
				"LEFT JOIN (SELECT doc_id col_10900_id, value col_10900, parent_id col_10900_row, reference column_10900_id  FROM doc cd, integer cv \n" +
				" WHERE cd.doc_id=cv.integer_id AND doctype=10) col_10900 ON column_10900_id=10900 AND col_10900_row=rws.doc_id \n" +
				"WHERE tbl.doc_id=:table_id AND tbl.doc_id=rws.parent_id AND NOT rws.removed AND rws.doctype=9 \n" +
				") x, doctimestamp , (SELECT doc_id r2r_id, reference2, p.* FROM doc,person p WHERE person_id=reference2) p WHERE row_id=doctimestamp_id AND p.r2r_id=row_id \n" +
				"AND reference2 in (SELECT distinct parent_id FROM doc, person where parent_id=person_id  and reference=:msp_id) \n" +
				"" //+"ORDER BY row_id DESC"
	},
	f74_read_allpatient_records:function(){
		return this.read_f74_select1() + 
		" ORDER BY row_id DESC"
	},
	f74_read_patient_records:function(){
		return "SELECT x.* FROM ( " + 
		this.read_f74_select1() + 
		" ) x, doc d, doc d2 WHERE col_10766_id=d.doc_id AND d.reference2=d2.reference2 AND d2.doc_id=:row_patient_cell_id \n" +
		"ORDER BY row_id DESC"
	},
}
