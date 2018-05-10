
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
		angular.forEach($scope.table.init, function(read_table_v, read_table_k){
			if(read_table_k.indexOf('read')==0){
				read_table_v.data = 'data'+read_table_k.replace('read','')
				console.log(read_table_v)
				console.log(read_table_k)
				$scope.table.row_indexs[read_table_k]={}
				read_table_v.rows_select = sql2[$scope.table.init.data.rows]()
				read_table_v.rows_select = compileGroupSelect(read_table_v.rows_select, read_table_v)
				read_table_v.rows_select = spaceClean(read_table_v.rows_select)
				$http.get(url_sql_read,{params:{msp_id:$scope.params.msp_id,sql:read_table_v.rows_select}}).then(function(response) {
					$scope.table[read_table_v.data] = response.data.list;
					$scope.table[read_table_v.data].forEach(function(v,k){
						$scope.table.row_indexs[read_table_k][v[read_table_v.column_to_group]]=k
					})
					angular.forEach($scope.table.init.data.cells, function(v, k_cell){
						console.log(k_cell)
						read_table_v[k_cell] = sql2[v]()
						read_table_v[k_cell]= compileGroupSelect(read_table_v[k_cell], read_table_v)
						read_table_v[k_cell]=spaceClean(read_table_v[k_cell])
						$http.get(url_sql_read,{params:{msp_id:$scope.params.msp_id, sql:read_table_v[k_cell]}}).then(function(response) {
							console.log(response.data)
							response.data.list.forEach(function(v){
								console.log($scope.table[read_table_v.data])
								console.log(read_table_v.column_to_group)
								console.log(v)
								console.log(v[read_table_v.column_to_group])
								var parent_v = $scope.table[read_table_v.data][$scope.table.row_indexs[read_table_k][v[read_table_v.column_to_group]]]
								parent_v[k_cell]=v
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
		setMonth:function(month){this.month=month;},
		getURL:function(){
			return '?year='+this.year+'&month='+this.month;
		},
		initFromRequest:function(){
			console.log($scope.request.parameters)
		}
	};
	$scope.seekParam.initFromRequest();
	var app_fn = new App_fn($scope, $http);
	$scope.$watch('principalResponse',function(newValue){if(newValue){
		console.log('----$scope.$watch(principal,function()------118------');
		var msp_id = app_fn.getMsp_id();
		$scope.params={msp_id:msp_id}
		app_fn.readTable()
return;
		var select_to_group = sql2.f74_day_rows__select();
		var f74_case_rows = sql2.f74_case_rows__group()
		.replace(':select_to_group',select_to_group);
		var params={msp_id:msp_id, sql:spaceClean(f74_case_rows)}
		var sql = sql2.f74_rowColumn_consultare_type__group()
		sql = composeSql(sql).replace(':select_to_group',select_to_group)
//		var sql = sql2.f74_rowColumn_consultare_type__select()
//					.replace(':select_to_group',select_to_group);
		sql = composeSql(sql)
		console.log(sql)
		$http.get(url_sql_read,{params:params}).then(function(response) {
			$scope.table.data = response.data.list;
			$scope.table.data.forEach(function(v,k){
				$scope.table.row_indexs[v.year_day]=k
			})
			params.sql=sql;
			$http.get(url_sql_read,{params:params}).then(function(response) {
				response.data.list.forEach(function(v){
					var k = v.year_day
					var parent_v = $scope.table.data[$scope.table.row_indexs[k]]
					parent_v['home_9776']=v
				})

			});
		});
	}});
	$scope.dayOfYearDate = function(year, dayOfYear){
		return new Date(new Date(year,0).setDate(dayOfYear));
	}
	$scope.table = {row_indexs:{},
	structure:{
		createdDay:{name:'день'},
		cnt:{name:'кількість'},
		home_9776:{name:'відвідувань вдома'}
	}};
	$scope.table.init = {
		read:{select_to_group:'f74_day_rows__select', column_to_group:'year_day'},
		read2:{select_to_group:'f74_day_rows__select', column_to_group:'year'},
		data:{
			rows:'f74_case_rows__group',
			cells:{
				home_9776:'f74_rowColumn_consultare_type__group',
			}
		},
	}
	console.log($scope.table)
}

var sql2= {
	f74_rowColumn_consultare_type__group:function(){
		return "SELECT " +
				":column_to_group, count(:column_to_group) home_9776 " +
				"FROM (\n" +
				"::f74_rowColumn_consultare_type__select \n" +
				") x WHERE value=2 " +
				"GROUP BY :column_to_group"
	},
	f74_rowColumn_consultare_type__select:function(){
		return "SELECT cell.*,row.* FROM (::f74_cell_consultare_type__select )  cell,(\n" +
		":select_to_group\n" +
		//"::f74_day_rows__select\n" +
		") row WHERE row_id=cell.parent_id"
	},
	f74_cell_consultare_type__select:function(){
		return "SELECT i.*, parent_id FROM integer i,doc WHERE integer_id=doc_id  AND reference=9776"
	},
	f74_case_rows__group:function(){
		//return "SELECT PARSEDATETIME(year_day||' '||2018, 'D yyyy') createdDay,  " +
		return "SELECT :column_to_group createdDay,  " +
				":column_to_group, count(:column_to_group) cnt " +
				"FROM (\n" +
				":select_to_group" +
				") x GROUP BY :column_to_group\n" +
				"ORDER BY :column_to_group"
				//"ORDER BY year_day"
	},
	f74_day_rows__select:function(){
		return "SELECT day_of_year(created) year_day, x.*, month(created) month, year(created) year FROM (\n" +
				"SELECT doc_id row_id, ds.*, reference2 FROM doc row, doctimestamp ds \n" +
				"WHERE row.doc_id=doctimestamp_id AND row.parent_id=9774 AND NOT row.removed AND row.doctype=9 \n" +
				") x WHERE YEAR(created)=2018 \n" +
				"AND reference2 in (SELECT distinct parent_id FROM doc, person where parent_id=person_id  and reference=:msp_id)"
	},
}

function compileGroupSelect(sql, v){
	sql = composeSql(sql)
	var select_to_group = sql2[v.select_to_group]();
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
