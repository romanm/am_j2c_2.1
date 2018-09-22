init_am_directive.init_create_tables2 = function($scope, $http, $filter, $route) {
	init_am_directive.ehealth_declaration($scope, $http, $filter);
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
			if(o.selectedObj.row_id)
				doc_id = o.selectedObj.row_id
			else
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
			console.log($scope.create_tables.interpretationRows)
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
		ngIncludes:{
			modalBottonPanel:'/f/am-dev/1c-db-tables2/tables_modalBottonPanel.html',
		},
		addFolderObjectType:function(folderObjectType){
			console.log(folderObjectType)
			this.folderObjectType=folderObjectType
			console.log(this.folderObjectData[this.folderObjectType])
			console.log(this.col_keys)
			this.col_keys.value = 
				this.folderObjectData[this.folderObjectType].col_keys.value
		},
		folderObjectData:{
			table:{
				doctype : 1,
				col_keys:{
					value:'Назва таблиці',
				},
			},
			doc:{
				doctype : 17,
				col_keys:{
					value:'Назва документу',
				},
			},
		},
		saveUpdate:function(){
			console.log($scope.pageVar.rowObj)
			if($scope.pageVar.rowKey == -1){
				var data = {
					sql : sql_1c.table_insert(),
					folderId : $scope.folders.selectedObj.folderId,
				}
				data.doctype = 1
				if(this.folderObjectType)
					data.doctype = 
						this.folderObjectData[this.folderObjectType].doctype
			}else{
				var data = {
					sql : sql_1c.table_update(),
					string_id : $scope.pageVar.rowObj.string_id,
				}
			}
			data.value = $scope.pageVar.rowObj.value
			console.log(data)
			writeSql(data)
			return
		},
		no_edit:['doc_id','doctype'],
		col_keys:{
			doc_id:'ІН',
			value:'Назва таблиці/документу',
			doctype:'T',
		},
		col_links:{
			doc_id:{k:'tableId',vk:'doc_id'},
		},
	}

	$scope.create_tables = {
		interpretation:{},
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
	
	var build_cell_sql = function(col_data,fn){
		angular.forEach($scope.pageVar.rowObj, function(v,k){
			var n = k.split('col_')[1]
			if(!isNaN(n))
				fn(v,k,n,col_data)
		})
	}
	var build_cell_sql_insert = function(v,k,n,col_data){
		var cellId_v = $scope.pageVar.rowObj[k+'_id']
		console.log(k+'/'+v+'/'+cellId_v)
		if(cellId_v){
			col_data.sql = sql_1c.table_data_cell_update()
			col_data.sql = col_data.sql.replace(':cell_id', cellId_v)
		}else{
			col_data.sql = sql_1c.table_data_cell_insert()
			col_data.sql = col_data.sql.replace(':column_id', n)
			while(col_data.sql.indexOf(':nextDbId2')>0){
				col_data.sql = col_data.sql.replace(':nextDbId2', ':nextDbId'+col_data.nextDbIdCounter)
			}
			col_data.nextDbIdCounter++
		}
		var cell_v = ('string'==col_data[n].fieldtype)? "'"+v+"'":v
		col_data.sql = col_data.sql.replace(':value', cell_v)
		col_data.sql = col_data.sql.replace(':fieldtype', col_data[n].fieldtype)
			.replace(':fieldtype', col_data[n].fieldtype)
		col_data.sql_row += col_data.sql
	}
	
	$scope.table_data = {
		afterRead:function(){
			if($scope.request.parameters.row_id){
				angular.forEach($scope.table_data.list, function(v){
					if($scope.request.parameters.row_id == v.row_id){
						$scope.table_data.selectedObj = v
						$scope.request.parameters.tableId = v.tbl_id
					}
				})
			}
		},
		saveUpdate:function(){
			var col_data = {nextDbIdCounter : 3, sql_row : '',}
			angular.forEach($scope.create_tables.list, function(v){
				col_data[v.column_id] = v
			})
			if($scope.pageVar.rowKey == -1){
				col_data.sql_row = sql_1c.table_data_row_insert()
				build_cell_sql(col_data,function(v,k,n){
					build_cell_sql_insert(v,k,n,col_data)
				})
				while(col_data.sql_row.indexOf(':row_id')>0){
					col_data.sql_row = col_data.sql_row.replace(':row_id', ':nextDbId1')
				}
				var data = { table_id : $scope.request.parameters.tableId }
			}else{
				build_cell_sql(col_data,function(v,k,n){
					build_cell_sql_insert(v,k,n,col_data)
				})
				var data = { row_id : $scope.pageVar.rowObj.row_id }
			}
			console.log(col_data.sql_row)
			data.sql = col_data.sql_row
			console.log(data)
			writeSql(data)
		},
		no_edit:['row_id'],
		col_links:{
			row_id:{k:'row_id',vk:'row_id', add:[ {k:'tableId',vk:'tbl_id',} ], },
		},
		col_keys:{
			row_id:'ІН',
		},
		columns:{},
	}
console.log($scope.table_data.col_keys)
	$scope.$watchGroup([
		'create_tables.list'
		, 'create_tables.interpretation.list'
		, 'create_tables.interpretation.tables.columns.list'
	],
	function(newValue, oldValue){
		if(newValue[2]){
			console.log(newValue[2])
			var tableId = newValue[1][0].reference
			$scope.create_tables.interpretation.tables.table_data = {
				afterRead:function(){
					angular.forEach(this.list, function(v){
						$scope.create_tables.interpretationRows[v.row_id].o = v
					})
				},
				col_keys:{},
			}
			readTableData(newValue[2], tableId, $scope.create_tables.interpretation.tables.table_data)
		}else
		if(newValue[1]){
			if(newValue[1][0]){
				$scope.create_tables.col_keys.interpretation = 'Інтерпретація'
					$scope.create_tables.interpretation.tables = {columns:{},}
				var tableId = newValue[1][0].reference
				$scope.create_tables.interpretation.tables[tableId] = {}
				if($scope.create_tables.interpretation.list[0]){
					$scope.create_tables.interpretationRows = {}
					angular.forEach($scope.create_tables.interpretation.list, function(v){
						$scope.create_tables.interpretationRows[v.parent] = v
						$scope.create_tables.interpretationRows[v.reference2] = v
					})
				}
				readTableColumns(tableId, $scope.create_tables.interpretation.tables.columns)
			}
		}else
		if(newValue[0]){
			if(newValue[0]!=oldValue[0]){
				console.log($scope.create_tables)
				if($scope.create_tables.list[0]){
					var table_id = $scope.create_tables.list[0].table_id
					var table_data_columns_interpretation = {
							tableId:table_id,
							sql:sql_1c.table_data_columns_interpretation(),
					}
					readSql(table_data_columns_interpretation, $scope.create_tables.interpretation)
				}
			}
		}
	})
	
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
//console.log(sql)
		var params_table_data = {
			sql : sql,
			table_id : table_id,
		}
		readSql(params_table_data, o)
//			console.log(params_table_data)
//			console.log(sql)
	}
	
	$scope.$watch('table_data.columns.list',function(newValue){ if(newValue){
		readTableData(newValue, $scope.request.parameters.tableId, $scope.table_data)
			console.log($scope.table_data)
	}})

	var readTableColumns = function(table_id, o){
		var params_table_column = { sql:sql_1c.table_data_columns() }
		params_table_column.table_id = table_id
//		console.log(params_table_column)
		readSql(params_table_column, o)
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
	var params_tables = { sql:sql_1c.read_tables() }
//	console.log(params_tables)
	console.log($scope.tables)
	//console.log(sql_1c.create_table())
	if($scope.request.parameters.folderId){
		params_tables.sql = sql_1c.tables_of_folder()
		params_tables.folderId = $scope.request.parameters.folderId
	}
	$scope.$watch('request.parameters.tableId',function(newValue){if(newValue){
		console.log(params_tables.sql)
		console.log(newValue)
		params_tables.tableId = newValue
		params_tables.sql = sql_1c.read_tables_with_tableId()
		console.log(sql_1c.read_tables_with_tableId())
		readSql(params_tables, $scope.tables)
		readTableColumns(newValue, $scope.table_data.columns)
	}else{
		readSql(params_tables, $scope.tables)
	}})
	
	readSql({ sql:sql_1c.folders() }, $scope.folders)
	readSql(params_create_tables, $scope.create_tables)

}
var sql_1c = {
	remove_row : function(){
		return "DELETE FROM string WHERE string_id = :doc_id ;" +
				"DELETE FROM doc WHERE parent = :doc_id ;" +
				"DELETE FROM doc WHERE doc_id = :doc_id "
	},
	table_data_cell_update:function(){
		return "UPDATE :fieldtype SET value =:value WHERE :fieldtype_id=:cell_id ;"
	},
	table_data_row_insert:function(){
		return "INSERT INTO doc (doc_id, parent, doctype) VALUES (:nextDbId1 , :table_id , 4) ;"
	},
	table_data_cell_insert:function(){
		return "INSERT INTO doc (doc_id, parent, reference, doctype) VALUES (:nextDbId2, :row_id , :column_id,  5) ;" +
			"INSERT INTO :fieldtype (value,:fieldtype_id) VALUES (:value, :nextDbId2 ) ;"
	},
	table_data_read:function(){
		return "SELECT rws.parent tbl_id, rws.doc_id row_id \n" +
				":add_columns \n" +
				"FROM doc tbl, doc rws \n" +
				":add_joins " +
				"WHERE tbl.doc_id=:table_id AND tbl.doc_id=rws.parent AND rws.doctype=4"
	},
	table_data_columntyps:function(){
		return "SELECT tbl.doc_id table_id, cln.doc_id cln_id, 'col_'||cln.doc_id col_key " +
		", typevalue.value col_table_name, clntype.doc_id clntype_id " +
		"FROM doc tbl, doc cln , doc clntype, string typevalue " +
		"WHERE tbl.doc_id=:table_id AND tbl.doc_id=cln.parent AND cln.doctype=8 " +
		"AND clntype.doc_id=cln.reference AND typevalue.string_id=clntype.doc_id "
	},
	table_data_columns_interpretation:function(){
		return "SELECT * FROM doc dc, doc dci " +
				"WHERE dci.doctype=16 AND dci.parent=dc.doc_id AND dc.parent=:tableId"
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
				this.table_data_columntyps() +
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
				",rs2.value fieldtype, d2.reference2 ,d2.reference fieldtype_id \n" +
				" FROM  doc d2, string rs2, string s1, string s2 WHERE d2.doctype=8 \n" +
				" AND s1.string_id=d2.parent AND s2.string_id=d2.doc_id AND  rs2.string_id=d2.reference "
	},
	table_insert:function(){
		return "INSERT INTO doc (parent, doc_id, doctype) VALUES (:folderId, :nextDbId1, :doctype) ;" +
			"INSERT INTO string (value,string_id) VALUES (:value, :nextDbId1) ;"
	},
	create_table_insert:function(){
		return "INSERT INTO doc (parent, reference, doc_id, doctype) \n" +
				"VALUES (:tableId, :fieldtypeId, :nextDbId1, 8) ;" +
			"INSERT INTO string (value,string_id) VALUES (:value, :nextDbId1) ;"
	},
	create_table_update:function(){
		return "UPDATE doc SET " +
				"reference =:fieldtype_id, " +
				"reference2 =:reference2 " +
				"WHERE doc_id=:column_id ;" +
			this.table_update()
	},
	table_update:function(){
		return "UPDATE string SET value =:value WHERE string_id=:string_id ;"
	},
	tables_of_folder:function(){
		return "SELECT * FROM (" +
				this.read_tables() +
				") WHERE parent=:folderId"
	},
	read_tables_with_tableId:function(){
		return "SELECT * FROM ( \n" +
				"SELECT 1 sort, * FROM ( \n" +
				this.read_tables()+
				" \n) x \n" +
				"WHERE doc_id = :tableId \n" +
				"UNION \n" +
				"SELECT 2 sort, * FROM ( \n" +
				this.read_tables()+
				" \n) x \n" +
				"WHERE doc_id != :tableId \n" +
				") x ORDER BY sort"
	},
	read_tables:function(){
		return "SELECT d.*, s.* FROM doc d, string s, ( \n" +
				this.folders()+
				"\n) d2 WHERE d2.doc_id=d.parent \n" +
				"AND s.string_id=d.doc_id \n" +
				"AND d.doctype in (1,17) "
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

