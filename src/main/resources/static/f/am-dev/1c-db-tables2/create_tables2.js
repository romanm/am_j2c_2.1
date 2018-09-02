init_am_directive.init_create_tables2 = function($scope, $http, $filter, $route) {
	init_am_directive.ehealth_declaration($scope, $http, $filter);
	console.log(123)
	console.log($scope.request.parameters)

	$scope.pageVar = {
		rowKey:null,
		rowKeyObj:null,
		rowObj:null,
		ngStyleModal:{},
		colLink:function(cl,tr){
			var l = '?'+cl.k+'='+tr[cl.vk]
			angular.forEach(cl.add,function(v){
				l += '&'+v.k+'='+tr[v.vk]
			})
			return l
		},
		minusRow:function(o){
			var doc_id = 0
			/*
			console.log(o)
			 * */
			console.log(o.selectedObj)
			if(o.selectedObj.column_id)
				doc_id = o.selectedObj.column_id
			var data = {
				sql : sql_1c.remove_row(),
				doc_id : doc_id,
			}
			writeSql(data)
		},
		addRow:function(o){
			this.openModal(o)
		},
		openModal:function(o){
			console.log(o)
			this.o = o
			this.ngStyleModal = {display:'block'}
			this.rowKey = -1
			$scope.pageVar.rowObj  = {}
			$scope.table_types = {}
			readSql({ sql:sql_1c.table_types() }, $scope.table_types)
			console.log($scope.table_types)
		},
		openEditRow:function(o){
			console.log(this)
			this.openModal(o)
			this.rowKeyObj = o.col_links[Object.keys(o.col_links)[0]]
			this.rowKey =
				$scope.request.parameters[this.rowKeyObj.k]
			if(this.rowKey){
				angular.forEach(o.list,function(v){
					if($scope.pageVar.rowKey == v[$scope.pageVar.rowKeyObj.vk]){
						$scope.pageVar.rowObj  = v
					}
				})
			}
		}
	}

	$scope.folders = {
		afterRead:function(){
			$scope.folders.selectedObj = $scope.folders.list[0]
			if($scope.request.parameters.folderId){
				angular.forEach($scope.folders.list, function(v){
					console.log(v)
					if($scope.request.parameters.folderId == v.folderId){
						$scope.folders.selectedObj = v
					}
				})
			}
		},
		saveUpdate:function(){
			console.log($scope.pageVar.rowObj)
			if($scope.pageVar.rowKey == -1){
				var data = {
					sql : sql_1c.folder_insert(),
					value : $scope.pageVar.rowObj.value,
				}
			}else{
				var data = {
					sql : sql_1c.table_update(),
					string_id : $scope.pageVar.rowObj.string_id,
					value : $scope.pageVar.rowObj.value,
				}
			}
			console.log(data)
			writeSql(data)
		},
		no_edit:['folderId'],
		col_keys:{
			folderId:'ІН',
			value:'Папка',
		},
		col_links:{
			folderId:{k:'folderId',vk:'folderId'},
		},
	}

	$scope.tables = {
		saveUpdate:function(){
			console.log($scope.pageVar.rowObj)
			if($scope.pageVar.rowKey == -1){
				var data = {
					sql : sql_1c.table_insert(),
					folderId : $scope.folders.selectedObj.folderId,
				}
			}else{
				var data = {
					sql : sql_1c.table_update(),
					string_id : $scope.pageVar.rowObj.string_id,
				}
			}
			data.value = $scope.pageVar.rowObj.value
			console.log(data)
			writeSql(data)
		},
		no_edit:['doc_id'],
		col_keys:{
			doc_id:'ІН',
			value:'Назва таблиці',
		},
		col_links:{
			doc_id:{k:'tableId',vk:'doc_id'},
		},
	}

	$scope.create_tables = {
		saveUpdate:function(){
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
				console.log(data)
			}else{
				var data = {
					sql : sql_1c.create_table_update(),
					string_id : $scope.pageVar.rowObj.column_id,
					column_id : $scope.pageVar.rowObj.column_id,
					fieldtype_id : $scope.pageVar.rowObj.fieldtype_id,
				}
			}
			data.value = $scope.pageVar.rowObj.fieldname
			console.log(data)
			writeSql(data)
		},
		afterRead:function(){
			if($scope.request.parameters.column_id){
				console.log($scope.request.parameters.column_id)
				angular.forEach($scope.create_tables.list, function(v){
					if($scope.request.parameters.column_id == v.column_id){
						$scope.create_tables.selectedObj = v
						$scope.request.parameters.tableId = v.table_id
						console.log($scope.create_tables.selectedObj)
					}
				})
			}
		},
		col_links:{
			column_id:{k:'column_id',vk:'column_id'},
		},
		no_edit:['column_id','tablename'],
		col_keys:{
			column_id:'ІН',
			tablename:'Таблиця',
			fieldname:'Колонка',
			fieldtype:'Тип даних',
		},
	}
	
	$scope.table_data = {
		saveUpdate:function(){
			var col_data = {}
			angular.forEach($scope.create_tables.list, function(v){
				col_data[v.column_id] = v
			})
			var sql_row = ''
			angular.forEach($scope.pageVar.rowObj, function(v,k){
				var n = k.split('col_')[1]
				if(!isNaN(n)){
					var cellId_v = $scope.pageVar.rowObj[k+'_id']
					console.log(k+'/'+v+'/'+cellId_v)
					var fieldtype = col_data[n].fieldtype
					var cell_v = v
					if('string'==fieldtype)
						cell_v = "'"+v+"'"
					var sql
					if(cellId_v){
						sql = sql_1c.table_data_cell_update()
						sql = sql.replace(':cell_id', cellId_v)
					}else{
						sql = sql_1c.table_data_cell_insert()
						sql = sql.replace(':column_id', n)
					}
					sql = sql.replace(':value', cell_v)
					sql = sql
					.replace(':fieldtype',fieldtype)
					.replace(':fieldtype',fieldtype)
					sql_row += sql
				}
			})
			console.log(sql_row)
			var data = {
				row_id : $scope.pageVar.rowObj.row_id
			}
			data.sql = sql_row
			console.log(data)
			writeSql(data)
		},
		no_edit:['row_id'],
		col_links:{
			row_id:{k:'row_id',vk:'row_id',
				add:[
					{k:'tableId',vk:'tbl_id',}
					],
			},
		},
		col_keys:{
			row_id:'ІН',
		},
		columns:{},
	}
	
	$scope.$watch('table_data.columns.list',function(newValue){
		if(newValue){
			var add_sql = {add_joins:'', add_columns:''}
			angular.forEach(newValue, function(v){
				add_sql.add_joins += v.add_joins + ' \n'
				add_sql.add_columns += v.add_columns
				$scope.table_data.col_keys[v.col_key] = v.col_alias
			})

			var sql = sql_1c.table_data_read()
			.replace(':add_columns', add_sql.add_columns)
			.replace(':add_joins', add_sql.add_joins)

			var params_table_data = {
				sql : sql,
				table_id : $scope.request.parameters.tableId,
			}
//			console.log(params_table_data)
//			console.log(sql)
			readSql(params_table_data, $scope.table_data)
			console.log($scope.table_data)
		}
	})
	
	$scope.$watch('request.parameters.tableId',function(newValue){
		readSql(params_tables, $scope.tables)
		var params_table_column = { sql:sql_1c.table_data_columns() }
		params_table_column.table_id = $scope.request.parameters.tableId
		readSql(params_table_column, $scope.table_data.columns)
	})

	var params_create_tables = { sql:sql_1c.create_tables() }
	if($scope.request.parameters.column_id){
		params_create_tables.sql = sql_1c.create_table_column()
		params_create_tables.column_id = $scope.request.parameters.column_id
	}else
	if($scope.request.parameters.tableId){
		params_create_tables.sql = sql_1c.create_table()
		params_create_tables.table_id = $scope.request.parameters.tableId
	}
	var params_tables = { sql:sql_1c.tables() }
	if($scope.request.parameters.folderId){
		params_tables.sql = sql_1c.tables_of_folder()
		params_tables.folderId = $scope.request.parameters.folderId
	}
	
	readSql({ sql:sql_1c.folders() }, $scope.folders)
	readSql(params_create_tables, $scope.create_tables)

}
var sql_1c = {
	remove_row : function(){
		return "DELETE FROM string WHERE string_id = :doc_id ;" +
				"DELETE FROM doc WHERE doc_id = :doc_id "
	},
	table_data_cell_update:function(){
		return "UPDATE :fieldtype SET value =:value WHERE :fieldtype_id=:cell_id ;"
	},
	table_data_cell_insert:function(){
		return "INSERT INTO doc (parent, reference, doc_id, doctype) VALUES (:row_id, :column_id, :nextDbId1, 5) ;" +
			"INSERT INTO :fieldtype (value,:fieldtype_id) VALUES (:value, :nextDbId1) ;"
	},
	table_data_read:function(){
		return "SELECT rws.parent tbl_id, rws.doc_id row_id \n" +
				":add_columns \n" +
				"FROM doc tbl, doc rws \n" +
				":add_joins " +
				"WHERE tbl.doc_id=:table_id AND tbl.doc_id=rws.parent AND rws.doctype=4"
	},
	table_data_columns:function(){
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
				"SELECT tbl.doc_id table_id, cln.doc_id cln_id, 'col_'||cln.doc_id col_key " +
				", CASEWHEN(clntype.doc_id=2, 'string' , typevalue.value) col_table_name " +
				"FROM doc tbl, doc cln , doc clntype, string typevalue " +
				"WHERE tbl.doc_id=:table_id AND tbl.doc_id=cln.parent AND cln.doctype=8 " +
				"AND clntype.doc_id=cln.reference AND typevalue.string_id=clntype.doc_id " +
				") x, string WHERE cln_id=string_id) x "
	},
	table_types:function(){
		return "SELECT doc_id fieldtype_id, * FROM doc, string " +
				"WHERE doc_id=string_id and reference is null and doctype=8"
	},
	create_table:function(){
		return "SELECT * FROM (" +
				this.create_tables() +
				") WHERE table_id=:table_id"
	},
	create_table_column:function(){
		return "SELECT * FROM (" +
			this.create_tables() +
			") WHERE table_id in (SELECT parent FROM doc where doc_id=:column_id)"
	},
	create_tables:function(){
		return "SELECT d2.parent table_id, d2.doc_id column_id, s1.value tablename ,s2.value fieldname \n" +
				",rs2.value fieldtype ,d2.reference fieldtype_id \n" +
				" FROM  doc d2, string rs2, string s1, string s2 WHERE d2.doctype=8 \n" +
				" AND s1.string_id=d2.parent AND s2.string_id=d2.doc_id AND  rs2.string_id=d2.reference "
	},
	table_insert:function(){
		return "INSERT INTO doc (parent, doc_id, doctype) VALUES (:folderId, :nextDbId1, 1) ;" +
			"INSERT INTO string (value,string_id) VALUES (:value, :nextDbId1) ;"
	},
	create_table_insert:function(){
		return "INSERT INTO doc (parent, reference, doc_id, doctype) \n" +
				"VALUES (:tableId, :fieldtypeId, :nextDbId1, 8) ;" +
			"INSERT INTO string (value,string_id) VALUES (:value, :nextDbId1) ;"
	},
	create_table_update:function(){
		return "UPDATE doc SET reference =:fieldtype_id WHERE doc_id=:column_id ;" +
			this.table_update()
	},
	table_update:function(){
		return "UPDATE string SET value =:value WHERE string_id=:string_id ;"
	},
	tables_of_folder:function(){
		return "SELECT * FROM (" +
				this.tables() +
				") WHERE parent=:folderId"
	},
	tables:function(){
		return "SELECT d.*, s.* FROM doc d, string s, ( \n" +
				this.folders()+
				") d2 WHERE d2.doc_id=d.parent \n" +
				"AND s.string_id=d.doc_id \n" +
				"AND d.doctype=1 "
	},
	folder_insert:function(){
		return "INSERT INTO doc (doc_id, doctype) VALUES (:nextDbId1, 14);" +
				"INSERT INTO string (value,string_id) VALUES (:value, :nextDbId1);"
	},
	folders:function(){
		return "SELECT string_id folderId, value folderName, * " +
				"FROM string s, doc WHERE doc_id=string_id and doctype=14"
	},
}
var writeSql = function(data){
	exe_fn.httpPost
	({	url:'/r/url_sql_read_db1',
		then_fn:function(response) {
//			console.log(response.data)
			if(data.dataAfterSave)
			data.dataAfterSave(response)
		},
		data:data,
	})
}
var readSql = function(params, obj){
	exe_fn.httpGet(exe_fn.httpGet_j2c_table_db1_params_then_fn(
	params,
	function(response) {
		obj.list = response.data.list
		if(obj.afterRead)
			obj.afterRead(response)
	}))
}
