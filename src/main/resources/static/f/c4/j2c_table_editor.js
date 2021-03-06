app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	init_j2c_table_editor($scope, $http, $filter)

//	console.log('----------calc ФОП------')
//	$scope.calcFOP = 0
//	exe_fn.httpGet({url:'https://api.ehealth-ukraine.org/reports/stats/divisions?page_size=5000&page='+11,
//		then_fn:function(response) {
//			console.log(response.data.data)
//			angular.forEach(response.data.data, function(v) {
//				if(910 == v.legal_entity.legal_form){
//					$scope.calcFOP++
//				}
//			})
//			console.log($scope.calcFOP)
//		}
//	})
	
	$scope.pageVar.pageName = 'j2c TABLE Editor'
	$scope.pageVar.pageParent = {}
	$scope.pageVar.pageParent.url = '/f/c4/dm/doc_manager.html'
	$scope.pageVar.pageParent.params = function(){
		if($scope.table.data)
		return "?folderId=" +
		$scope.table.data.parent +
			""
	}
	
	$scope.pageVar.saveSqlConfig1=function(tableId, doctype, newValue, oldValue){
		var data = { tableId:tableId, value:newValue, doctype:doctype, }
		if(oldValue){
			if(newValue == oldValue){
				console.log('Змін не відбулось перезапис непотрібен')
			}else{
				data.sql = sql_1c.create_table_update_sql()
				writeSql(data)
			}
		}else{
			data.sql = sql_1c.create_table_insert_sql()
			writeSql(data)
		}
	}
	$scope.pageVar.saveSqlConfig=function(){
		var tableId = $scope.create_tables.list[0].table_id
		var sql = $scope.table_data.params_table_data.sql
				.replace( ':table_id' ,tableId)
				.replace( 'LIMIT 50' ,'')
		this.saveSqlConfig1(tableId, 19, sql, $scope.create_tables.table_data_readSql.sql2)
		this.saveSqlConfig1(tableId, 20, this.config.viewJson($scope.create_tables.colMap)
			, $scope.create_tables.table_data_readSql.json_create_table)
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
	$scope.create_tables = {}
	console.log($scope.create_tables)
	$scope.create_tables.saveUpdate=function(){
		if($scope.pageVar.rowKey == -1){
			var data = {
				sql : sql_1c.create_table_insert(),
				tableId : $scope.request.parameters.tableId, 
				fieldtypeId : $scope.pageVar.rowObj.fieldtype_id, 
				value : $scope.pageVar.rowObj.fieldname, 
			}
		}else{
			var data = {
				sql : sql_1c.create_table_update(),
				string_id : $scope.pageVar.rowObj.column_id,
				column_id : $scope.pageVar.rowObj.column_id,
				fieldtype_id : $scope.pageVar.rowObj.fieldtype_id,
				reference2 : $scope.pageVar.rowObj.reference2,
			}
		}
		data.value = $scope.pageVar.rowObj.fieldname
		writeSql(data)
	}
	$scope.create_tables.no_edit=['column_id','tablename']
	$scope.create_tables.col_links={
		column_id:{k:'column_id',vk:'column_id'},
	}
	$scope.create_tables.col_keys = {}
	$scope.create_tables.col_keys.column_id='ІН',
//	$scope.create_tables.col_keys.tablename='Таблиця',
	$scope.create_tables.col_keys.fieldname='Колонка',
	$scope.create_tables.col_keys.fieldtype='Тип даних',
	readSql(params_create_tables, $scope.create_tables)
	$scope.create_tables.colMap = {}
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
		if($scope.create_tables.list[0]){
			if($scope.create_tables.list[0].table_id){
				$scope.create_tables.table_data_readSql = { 
					sql:sql_1c.table_data_readSql(),
					table_id : $scope.create_tables.list[0].table_id,
					afterRead : function(response){
						angular.forEach(response.data.list, function(v){
							if(v.doctype==19){
								$scope.create_tables.table_data_readSql.sql2 = v.docbody
							}else if(v.doctype==20){
								$scope.create_tables.table_data_readSql.json_create_table = v.docbody
							}
						})
					},
				}
				readSql($scope.create_tables.table_data_readSql)
			}}
	}

//	$scope.doc_data.readData()
	$scope.table_data = {}
	$scope.table_data.saveUpdate=function(){
		var rowObj = $scope.pageVar.rowObj
//		var col_data = {nextDbIdCounter : 3, sql_row : '',}
//		angular.forEach($scope.create_tables.list, function(v){
//		col_data[v.column_id] = v
//		})
//		console.log($scope.create_tables.colMap)
		console.log($scope.pageVar.rowObj)
		angular.forEach($scope.create_tables.colMap, function(v,k){
			if('timestamp'==v.fieldtype){
				console.log(k)
				var edTs1 = $scope.pageVar.rowObj['col_'+k]
				console.log(edTs1)
				var edTs = $scope.pageVar.rowObj['col_'+k+'_ed']
				console.log(edTs)
				$scope.pageVar.rowObj['col_'+k] = edTs
				if(false&&edTs){
					var d = str2UaTimestamp(edTs)
					console.log(d)
					var s = $filter('date')(d, 'yyyy-MM-ddTHH:mm:ss')
					console.log(s)
					$scope.pageVar.rowObj['col_'+k] = s
				}
			}
		})
		var col_data = $scope.create_tables.colMap
		col_data.nextDbIdCounter = 3
		col_data.sql_row = ''
			console.log(col_data)
			if($scope.pageVar.rowKey == -1){
				build_sqlJ2c_row_insert(rowObj, col_data)
			}else{
				build_sqlJ2c_row_write(rowObj, col_data, function(v,k,n){
					build_sqlJ2c_cell_write(v,k,n,col_data,rowObj)
				})
				col_data.row_id = $scope.pageVar.rowObj.row_id
			}
		console.log(col_data.sql_row)
		col_data.sql = col_data.sql_row
		console.log(col_data)
		writeSql(col_data)
	}
	$scope.table_data.no_edit=['row_id'],
	$scope.table_data.col_links={
		row_id:{k:'row_id',vk:'row_id', add:[
			{k:'tableId',vk:'tbl_id',} ,
			{k:'tab1',fn:function(){return $scope.pageVar.config.viewDocPart},} ,
		], },
	}
	$scope.table_data.col_keys = {}
	$scope.table_data.col_keys.row_id='ІН'
	$scope.$watch('table_data.columns.list',function(newValue){ if(newValue){
		readTableData(newValue, $scope.request.parameters.tableId, $scope.table_data)
	}})
	$scope.table_data.columns = {}
	$scope.$watch('request.parameters.tableId',function(newValue){ if(newValue){
		var params_table_column = {}
		params_table_column.table_id = $scope.request.parameters.tableId
		params_table_column.sql = sql_1c.table_data_columns()
		readSql(params_table_column, $scope.table_data.columns)
	}})

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

	$scope.table = {}
	var param = {
		sql:'SELECT * FROM doc, string WHERE string_id=doc_id AND doc_id IN (:tableId)',
		tableId:$scope.request.parameters.tableId,
		afterRead:function(responce){
			$scope.table.data = responce.data.list[0]
			$scope.request.parameters.tableId=$scope.table.data.doc_id
		}
	}
	if($scope.request.parameters.column_id){
		param.column_id = $scope.request.parameters.column_id
		param.sql = param.sql.replace(':tableId', sql_1c.column_id_table_id)
	}
//	console.log(param)
	readSqlToObjData(param)
})

sql_1c.column_id_table_id = 'SELECT parent FROM doc where doc_id=:column_id'
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
				") x WHERE table_id=:table_id"
	}
sql_1c.create_table_column = function(){
		return "SELECT * FROM (" +
			this.create_tables() +
			") WHERE table_id in (SELECT parent FROM doc where doc_id=:column_id)"
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
sql_1c.create_table_insert = function(){
		return "INSERT INTO doc (parent, reference, doc_id, doctype) \n" +
			"VALUES (:tableId, :fieldtypeId, :nextDbId1, 8) ;" +
			"INSERT INTO string (value,string_id) VALUES (:value, :nextDbId1) ;"
	}
sql_1c.create_table_update = function(){
		return "UPDATE doc SET " +
				"reference =:fieldtype_id, " +
				"reference2 =:reference2 " +
				"WHERE doc_id=:column_id ;" +
			this.table_update()
	}
sql_1c.create_table_update_sql = function(){
	return "UPDATE docbody SET docbody = :value WHERE docbody_id IN ( \n" +
	"SELECT doc_id FROM doc where doctype=:doctype and parent = :tableId)"
}
sql_1c.table_data_readSql = function(){
	return "SELECT * FROM doc d, docbody s \n" +
	"WHERE parent = :table_id AND s.docbody_id=d.doc_id AND doctype!=4"
}
sql_1c.create_table_insert_sql = function(){
	return "INSERT INTO doc (parent, doc_id, doctype) \n" +
	"VALUES (:tableId, :nextDbId1, :doctype) ;" +
	"INSERT INTO docbody (docbody,docbody_id) VALUES (:value, :nextDbId1) ;"
}
