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
	$scope.pageVar.openEditRow=function(o){
		console.log(this)
		this.openModal(o)
		this.rowKeyObj = o.col_links[Object.keys(o.col_links)[0]]
		this.rowKey =
			$scope.request.parameters[this.rowKeyObj.k]
		if(this.rowKey){
			angular.forEach(o.list,function(v){
				if($scope.pageVar.rowKey == v[$scope.pageVar.rowKeyObj.vk]){
					$scope.pageVar.rowObj = v
				}
			})
			console.log($scope.pageVar.rowObj)
			angular.forEach($scope.create_tables.colMap,function(v,k){
				if('timestamp' == v.fieldtype){
					var fieldName = 'col_'+v.column_id
					var ds = $scope.pageVar.rowObj[fieldName]
					console.log(ds)
					$scope.pageVar.rowObj[fieldName+'_ed']
					= $filter('date')(ds, 'shortDate')
					+ ' '
					+ $filter('date')(ds, 'HH:mm')
					console.log(k)
					console.log(v)
				}
			})
		}
	}
	$scope.pageVar.addRow=function(o){
		this.openModal(o)
	}
	$scope.pageVar.openModal=function(o){
		console.log(o)
		this.o = o
		this.ngStyleModal = {display:'block'}
		this.rowKey = -1
		$scope.table_types = {}
		readSql({ sql:sql_1c.table_types() }, $scope.table_types)
		console.log(sql_1c.table_types())
		console.log($scope.table_types)
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
	console.log(params_create_tables.sql.replace(':column_id',params_create_tables.column_id))
	$scope.create_tables = {}
	console.log($scope.create_tables)
	$scope.create_tables.saveUpdate=function(){
		console.log($scope.tables)
		console.log($scope.pageVar)
		console.log($scope.pageVar.rowObj)
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
			console.log($scope.pageVar.rowObj)
		}
		data.value = $scope.pageVar.rowObj.fieldname
		console.log(data)
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
	}

//	$scope.doc_data.readData()
	$scope.table_data = {}
	$scope.table_data.no_edit=['row_id'],
	$scope.table_data.col_links={
		row_id:{k:'row_id',vk:'row_id', add:[
			{k:'tableId',vk:'tbl_id',} ,
			{k:'tab1',fn:function(){return $scope.pageVar.config.viewDocPart},} ,
		], },
	}
	$scope.table_data.col_keys = {}
	$scope.table_data.col_keys.row_id='ІН'
	console.log($scope.table_data)
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
			console.log($scope.table.data)
			$scope.request.parameters.tableId=$scope.table.data.doc_id
		}
	}
	if($scope.request.parameters.column_id){
		param.column_id = $scope.request.parameters.column_id
		param.sql = param.sql.replace(':tableId', sql_1c.column_id_table_id)
	}
	readSqlToObjData(param)
	console.log($scope.table)

})

sql_1c.column_id_table_id = 'SELECT parent FROM doc where doc_id=:column_id'
sql_1c.table_types = function(){
		return "SELECT doc_id fieldtype_id, * FROM doc, string " +
				"WHERE doc_id=string_id and reference is null and doctype=8"
	}
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
sql_1c.table_update = function(){
		return "UPDATE string SET value =:value WHERE string_id=:string_id ;"
	}
