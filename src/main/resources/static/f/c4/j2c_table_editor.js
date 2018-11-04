app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	
	$scope.pageVar.pageName = 'j2c TABLE Editor'
	$scope.pageVar.pageParent = {}
	$scope.pageVar.pageParent.url = '/v/create_tables2'
	$scope.pageVar.pageParent.params = function(){
		return "?tableId=" +
				$scope.request.parameters.tableId +
				""
	}

	var params_create_tables = { sql:sql_1c.create_tables() }
	if($scope.request.parameters.column_id){
		params_create_tables.sql = sql_1c.create_table_column()
		params_create_tables.column_id = $scope.request.parameters.column_id
	}else
	if($scope.request.parameters.tableId){
		params_create_tables.sql = sql_1c.create_table()
		params_create_tables.table_id = $scope.request.parameters.tableId
	}
	console.log(params_create_tables)
	$scope.create_tables = {}
	$scope.create_tables.colMap = {}
	console.log($scope.create_tables.colMap)
	$scope.create_tables.col_keys = {}
	$scope.create_tables.col_keys.column_id='ІН',
//	$scope.create_tables.col_keys.tablename='Таблиця',
	$scope.create_tables.col_keys.fieldname='Колонка',
	$scope.create_tables.col_keys.fieldtype='Тип даних',
	readSql(params_create_tables, $scope.create_tables)
	$scope.create_tables.afterRead = function(){ 
		angular.forEach($scope.create_tables.list, function(v){
			$scope.create_tables.colMap[v.column_id] = v
			if($scope.request.parameters.column_id){
				if($scope.request.parameters.column_id == v.column_id){
					$scope.create_tables.selectedObj = v
					$scope.request.parameters.tableId = v.table_id
					console.log($scope.create_tables.selectedObj)
				}}
		})
	}

//	$scope.doc_data.readData()
	$scope.table_data = {}
	$scope.table_data.col_keys = {}
	console.log($scope.table_data)
	$scope.$watch('table_data.columns.list',function(newValue){ if(newValue){
		readTableData(newValue, $scope.request.parameters.tableId, $scope.table_data)
	}})
	$scope.table_data.columns = {}
	var params_table_column = {}
	params_table_column.sql = sql_1c.table_data_columns()
	params_table_column.table_id = $scope.request.parameters.tableId
	readSql(params_table_column, $scope.table_data.columns)

	var readTableData = function(listSqlJoin, table_id, o){
		var add_sql = {add_joins:'', add_columns:''}
		angular.forEach(listSqlJoin, function(v){
			add_sql.add_joins += v.add_joins + ' \n'
			add_sql.add_columns += v.add_columns
			o.col_keys[v.col_key] = v.col_alias
		})

		var sql = sql_1c.table_data_read()
		.replace(':add_columns', add_sql.add_columns)
		.replace(':add_joins', add_sql.add_joins)
//console.log(sql.replace(':table_id',table_id))
		var params_table_data = {
			sql : sql+' LIMIT 50',
			table_id : table_id,
		}
		o.params_table_data = params_table_data
		readSql(params_table_data, o)
//			console.log(params_table_data)
//			console.log(sql)
	}

})

sql_1c.table_data_read = function(){
		return "SELECT rws.parent tbl_id, rws.doc_id row_id \n" +
				":add_columns \n" +
				"FROM doc tbl, doc rws \n" +
				":add_joins " +
				"WHERE tbl.doc_id=:table_id AND tbl.doc_id=rws.parent AND rws.doctype=4"
	}
sql_1c.create_table = function(){
		return "SELECT * FROM (" +
				this.create_tables() +
				") WHERE table_id=:table_id"
	}
sql_1c.create_tables = function(){
		return "SELECT d2.parent table_id, d2.doc_id column_id, s1.value tablename ,s2.value fieldname \n" +
				",rs2.value fieldtype, d2.reference2 ,d2.reference fieldtype_id \n" +
				" FROM  doc d2, string rs2, string s1, string s2 WHERE d2.doctype=8 \n" +
				" AND s1.string_id=d2.parent AND s2.string_id=d2.doc_id AND  rs2.string_id=d2.reference "
	}
sql_1c.table_data_columns = function(){
		return "SELECT '" +
				"LEFT JOIN ('||x.joins_select||') '||col_key||' " +
				"ON column_'||cln_id||'_id='||cln_id||' AND '||col_key||'_row=rws.doc_id ' add_joins, " +
				" ', '||col_key||'_id, '||col_key add_columns " +
				", x.* FROM ( " +
				"SELECT 'SELECT doc_id '||col_key||'_id, value '||col_key||', parent '||col_key||'_row, reference column_'||cln_id||'_id ' " +
				"||' FROM doc cd, '||col_table_name||' cv ' ||' " +
				" WHERE cd.doc_id=cv.'||col_table_name||'_id AND doctype=5' joins_select " +
				", value col_alias " +
				", x.* FROM ( " +
				this.table_data_columntyps() +
				") x, string WHERE cln_id=string_id) x "
	}
sql_1c.table_data_columntyps = function(){
		return "SELECT tbl.doc_id table_id, cln.doc_id cln_id, 'col_'||cln.doc_id col_key " +
		", typevalue.value col_table_name, clntype.doc_id clntype_id " +
		"FROM doc tbl, doc cln , doc clntype, string typevalue " +
		"WHERE tbl.doc_id=:table_id AND tbl.doc_id=cln.parent AND cln.doctype=8 " +
		"AND clntype.doc_id=cln.reference AND typevalue.string_id=clntype.doc_id "
	}
