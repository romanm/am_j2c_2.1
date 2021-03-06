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
		var sql_inner = sql2[fn_name]()
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

var sql2= {
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
		return "::f74_icpc2_seek2__select AND parent_id=58  LIMIT 20";
	},
	f74_icpc2_seek3__select:function(){
		return "::f74_icpc2_seek2__select  LIMIT 20";
	},
	f74_icpc2_seek2__select:function(){
		return "SELECT * FROM ( \n" +
				"SELECT c1.code||c2.code code, s2.value, d2.doc_id, d2.parent_id, s1.value part, d2.doctype \n" +
				"FROM string s2, doc d1, doc d2, string s1, code c2, code c1 \n" +
				"WHERE d1.doc_id=d2.parent_id AND d1.doctype=57 AND s2.string_id=d2.doc_id AND s1.string_id=d1.doc_id AND c2.code_id=d2.doc_id AND c1.code_id=d1.doc_id \n" +
				") x " +
				"WHERE (LOWER(value) LIKE LOWER(:seek) OR LOWER(code) LIKE LOWER(:seek)) ";
	},
}
