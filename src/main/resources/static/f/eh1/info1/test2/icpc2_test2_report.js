
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
		console.log($scope.table.init)
		angular.forEach($scope.table.init, function(report_table, report_table_name){
			if(report_table_name.indexOf('report')==0){
				report_table.data = 'data'+report_table_name.replace('report','').replace('_table','')
				$scope.table.row_indexs[report_table_name]={}
				report_table.rows_select = sql2[$scope.table.init.data.rows]()
				report_table.rows_select = compileGroupSelect(report_table.rows_select, report_table, $scope)
				report_table.rows_select = spaceClean(report_table.rows_select)
				$http.get(url_sql_read,{params:{msp_id:$scope.params.msp_id,sql:report_table.rows_select}}).then(function(response) {
					$scope.table[report_table.data] = response.data.list;
					$scope.table[report_table.data].forEach(function(v,k){
						$scope.table.row_indexs[report_table_name][v[report_table.column_to_group]]=k
					})
					angular.forEach($scope.table.init.data.cells, function(column_v, column_name){
//						console.log(column_v)
//						console.log(column_v.value)
						var column_id = column_name.split('_')[1]*1  
						console.log(column_id)
						report_table[column_name] = sql2[column_v.sql]()
//						console.log(report_table[column_name])
						report_table[column_name]= compileGroupSelect(report_table[column_name], report_table, $scope)
//						console.log(report_table[column_name])
						report_table[column_name]=report_table[column_name]
						.replace(':column_name', column_name)
						.replace(':column_id', column_id)
						.replace(':value_type', column_v.value_type)
						.replace(':value_type', column_v.value_type)
						.replace(':value', column_v.value);
//						console.log(report_table[column_name])
						report_table[column_name]=spaceClean(report_table[column_name])
						$http.get(url_sql_read,{params:{msp_id:$scope.params.msp_id, sql:report_table[column_name]}}).then(function(response) {
							response.data.list.forEach(function(v){
								var parent_v = $scope.table[report_table.data][$scope.table.row_indexs[report_table_name][v[report_table.column_to_group]]]
								parent_v[column_name]=v
							})
						})
					})
				});
			}
		})
	}
}

init_am_directive.init_icpc2_test2_report = function($scope, $http){
	console.log('------init_am_directive.init_init_icpc2_test2_report-----------------');
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
			return url;
		},
		initFromRequest:function(){
			console.log($scope.request.parameters)
			if($scope.request.parameters.month)
				$scope.seekParam.setMonth($scope.request.parameters.month)
		}
	};
	$scope.seekParam.initFromRequest();
	var app_fn = new App_fn($scope, $http);
	$scope.$watch('principalResponse',function(newValue){if(newValue){
		console.log('----$scope.$watch(principal,function()------118------');
		var msp_id = app_fn.getMsp_id();
		$scope.params={msp_id:msp_id}
		app_fn.readTable()
	}});
	$scope.dayOfYearDate = function(year, dayOfYear){
		return new Date(new Date(year,0).setDate(dayOfYear));
	}
	$scope.table = {row_indexs:{},
	structure:{
		createdDay:{name:'день'},
		cnt:{name:'кількість'},
		home_9776:{name:'відвідувань вдома'},
		village_10900:{name:'село'},
	}};
	$scope.table.init = {
		report_table:{select_to_group:'f74_day_rows__select', column_to_group:'year_day'},
		report2_table:{select_to_group:'f74_day_rows__select', column_to_group:'year'},
		data:{
			rows:'f74_case_rows__group',
			cells:{
				home_9776:{sql:'j2c_column_row__group',value:'2',value_type:'integer'},
				village_10900:{sql:'j2c_column_row__group',value:'2',value_type:'integer'},
			}
		},
	}
	console.log($scope.table)
}

var sql2= {
	j2c_column_row__group:function(){
		return "SELECT :column_to_group, count(:column_to_group) :column_name " +
				"FROM (\n" +
				"::j2c_column_row__select \n" +
				") x WHERE value=:value " +
				"GROUP BY :column_to_group"
	},
	j2c_column_row__select:function(){
		return "SELECT cell.*,row.* FROM (::j2c_cell_column__select )  cell,(\n" +
		":select_to_group\n" +
		") row WHERE row_id=cell.parent_id"
	},
	j2c_cell_column__select:function(){
		return "SELECT i.*, parent_id FROM :value_type i,doc WHERE :value_type_id=doc_id  AND reference=:column_id"
	},
	f74_case_rows__group:function(){
		return "SELECT :column_to_group createdDay,  " +
				":column_to_group, count(:column_to_group) cnt " +
				"FROM (\n" +
				":select_to_group" +
				") x GROUP BY :column_to_group\n" +
				"ORDER BY :column_to_group"
	},
	f74_day_rows__select:function(){
		return "SELECT day_of_year(created) year_day, month(created) month, year(created) year, x.* FROM (\n" +
				"SELECT doc_id row_id, ds.*, reference2 FROM doc row, doctimestamp ds \n" +
				"WHERE row.doc_id=doctimestamp_id AND row.parent_id=9774 AND NOT row.removed AND row.doctype=9 \n" +
				") x WHERE YEAR(created)=2018 \n" +
				"AND reference2 in (SELECT distinct parent_id FROM doc, person where parent_id=person_id  and reference=:msp_id)"
	},
}

function compileGroupSelect(sql, v, $scope){
	sql = composeSql(sql)
	var select_to_group = sql2[v.select_to_group]();
	if($scope.request.parameters.month){
		select_to_group = 
		"SELECT * FROM (" +select_to_group +") WHERE month="+$scope.request.parameters.month
	}
//	console.log(select_to_group)
	sql = sql.replace(':select_to_group',select_to_group);
	sql = sql.replace(':column_to_group',v.column_to_group);
	sql = sql.replace(':column_to_group',v.column_to_group);
	sql = sql.replace(':column_to_group',v.column_to_group);
	sql = sql.replace(':column_to_group',v.column_to_group);
	sql = sql.replace(':column_to_group',v.column_to_group);
	//console.log(sql)
	return sql;
}

function composeSql(sql){
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

function spaceClean(s){return s.replace(/\n/g, " ")}
var url_sql_read = '/r/url_sql_read2';
