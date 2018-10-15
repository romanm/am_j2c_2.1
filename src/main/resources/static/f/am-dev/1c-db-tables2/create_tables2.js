init_am_directive.init_create_tables2 = function($scope, $http, $filter, $route) {
	init_am_directive.ehealth_declaration($scope, $http, $filter);
	console.log($scope.request.parameters)

	$scope.pageVar = {
		saveSqlConfig1:function(tableId, doctype, newValue, oldValue){
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
			console.log(data)
		},
		saveSqlConfig:function(){
			var tableId = $scope.create_tables.list[0].table_id
			var sql = $scope.table_data.params_table_data.sql
					.replace( ':table_id' ,tableId)
					.replace( 'LIMIT 50' ,'')
			//console.log(sql)
			console.log($scope.create_tables.table_data_readSql)
			this.saveSqlConfig1(tableId, 19, sql, $scope.create_tables.table_data_readSql.sql)
			this.saveSqlConfig1(tableId, 20, this.config.viewJson($scope.create_tables.colMap)
				, $scope.create_tables.table_data_readSql.json_create_table)
		},
		validate_change:{
			rowObj:null,
			timestamp:function(key){
				if(!$scope.pageVar.validate_change.rowObj){
					$scope.pageVar.validate_change.rowObj = {}
				}
				var dateString = $scope.pageVar.rowObj[key];
				var noTimestampSymbol = dateString.replace(/\d|\.|-| |:/g, '')
				if(noTimestampSymbol){
					console.log(noTimestampSymbol)
					$scope.pageVar.validate_change.rowObj[key] = 'Недопустимі символи: '+ noTimestampSymbol
				}else{
					delete $scope.pageVar.validate_change.rowObj[key]
				}
				var m = dateString.match(/([1-9]|1\d|2\d|3[01])([-|,|.| |\/]+)([1-9]|1[012]|0[1-9])([-|,|.| |\/]+)(19|20)(\d{2})/)
				console.log(m)
				if(m){
//					y = m[5]*100+m[6]*1;
				}else{
					m = dateString.match(/([1-9]|1\d|2\d|3[01])([-|,|.| |\/]+)([1-9]|1[012]|0[1-9])([-|,|.| |\/]+)(\d{1,2})/)
					console.log(m)
				}
				
			},
		},
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
	}
	$scope.pageVar.config = {}
	$scope.pageVar.config.viewConfigPart = null
	init_j2c_json_editor($scope, $http)

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
		afterRead:function(){
			if(17==this.list[0].doctype||6==this.list[0].doctype){
				$scope.doc_data.readData()
			}
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
			datadictionary:{
				doctype : 6,
				col_keys:{
					value:'Назва словника даних',
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

	console.log($scope.create_tables)
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
			$scope.create_tables.colMap = {}
			console.log($scope.request.parameters.column_id)
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
				console.log(sql_1c.table_data_readSql())
				$scope.create_tables.table_data_readSql = { 
					sql:sql_1c.table_data_readSql(),
					table_id : $scope.create_tables.list[0].table_id,
					afterRead : function(){
						var thisObj=this
						angular.forEach(this.list, function(v){
							if(v.doctype==19){
								thisObj.sql = v.docbody
							}else
							if(v.doctype==20){
								thisObj.json_create_table = v.docbody
							}
						})
					},
				}
				readSql($scope.create_tables.table_data_readSql)
			}}
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
		afterRead:function(){
//			console.log($scope.table_data)
			angular.forEach($scope.table_data.list, function(v){
				if($scope.request.parameters.row_id){
					if($scope.request.parameters.row_id == v.row_id){
						$scope.table_data.selectedObj = v
						$scope.request.parameters.tableId = v.tbl_id
					}
				}
			})
		},
		saveUpdate:function(){
			var rowObj = $scope.pageVar.rowObj
//			var col_data = {nextDbIdCounter : 3, sql_row : '',}
//			angular.forEach($scope.create_tables.list, function(v){
//				col_data[v.column_id] = v
//			})
//			console.log($scope.create_tables.colMap)
			angular.forEach($scope.create_tables.colMap, function(v,k){
				if('timestamp'==v.fieldtype){
					var edTs = $scope.pageVar.rowObj['col_'+k+'_ed']
					console.log(edTs)
					var d = str2UaTimestamp(edTs)
					console.log(d)
					var s = $filter('date')(d, 'yyyy-MM-ddTHH:mm:ss')
					console.log(s)
					$scope.pageVar.rowObj['col_'+k] = s
					console.log($scope.pageVar.rowObj)
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
//	console.log($scope.table_data.col_keys)
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
//				console.log($scope.create_tables)
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
	
	$scope.$watch('table_data.columns.list',function(newValue){ if(newValue){
		readTableData(newValue, $scope.request.parameters.tableId, $scope.table_data)
	}})

	var readTableData = function(listSqlJoin, table_id, o){
		var add_sql = {add_joins:'', add_columns:''}
		angular.forEach(listSqlJoin, function(v){
			if(v.add_joins.indexOf('timestamp')>0){
				/*
				v.add_joins = v.add_joins.replace('value col_',
				"FORMATDATETIME(value, 'yyyy-MM-dd hh:mm') col_"
				)
				 */
			}
			add_sql.add_joins += v.add_joins + ' \n'
			add_sql.add_columns += v.add_columns
			o.col_keys[v.col_key] = v.col_alias
		})

		//var sql = sql_1c.table_data_read()
		var sql = sql_1c.table_data_read_limit()
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
	
	var readTableColumns = function(table_id, o){
		var params_table_column = { 
			sql:sql_1c.table_data_columns(),
		}
		params_table_column.table_id = table_id
//		console.log(params_table_column.sql)
//		console.log(params_table_column)
		readSql(params_table_column, o)
		console.log(o)
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
//	console.log(params_tables.sql)
//	console.log(params_tables)
	console.log($scope.tables)
	//console.log(sql_1c.create_table())
	if($scope.request.parameters.folderId){
		params_tables.sql = sql_1c.tables_of_folder()
		params_tables.folderId = $scope.request.parameters.folderId
	}
	$scope.$watch('request.parameters.tableId',function(newValue){if(newValue){
		console.log(newValue)
		params_tables.tableId = newValue
		params_tables.sql = sql_1c.read_tables_with_tableId()
		readSql(params_tables, $scope.tables)
		readTableColumns(newValue, $scope.table_data.columns)
	}else{
		readSql(params_tables, $scope.tables)
	}})
	
	readSql({ sql:sql_1c.folders() }, $scope.folders)
	readSql(params_create_tables, $scope.create_tables)

}

function build_sqlJ2c_row_insert(rowObj,col_data){
	col_data.sql_row = sql_1c.table_data_row_insert()
	build_sqlJ2c_row_write(rowObj, col_data,function(v,k,n){
		build_sqlJ2c_cell_write(v,k,n,col_data,rowObj)
	})
	while(col_data.sql_row.indexOf(':row_id')>0){
		col_data.sql_row = col_data.sql_row.replace(':row_id', ':nextDbId1')
	}
	var table_id = col_data[Object.keys(col_data)[0]].table_id
	col_data.table_id = table_id 
}

function build_sqlJ2c_row_write(rowObj,col_data,fn){
	angular.forEach(rowObj, function(v,k){
		var n = k.split('col_')[1]
		if(!isNaN(n))
			fn(v,k,n,col_data,rowObj)
	})
}

function build_sqlJ2c_cell_write_parameters(col_data, v, n){
	var cell_v 
	if('string'==col_data[n].fieldtype){
		cell_v = "'"+v+"'"
	}else
	if('timestamp'==col_data[n].fieldtype){
		console.log(v)
		var vd = new Date(v)
		console.log(vd)
		//var vd2 = $filter('date')(vd, 'yyyy-MM-ddTHH:mm')
		//console.log(vd2)
		cell_v = "'"+v+"'"
		console.log(cell_v)
	}else{
		cell_v = v
	}
	col_data.sql = col_data.sql.replace(':value', cell_v)
	col_data.sql = col_data.sql.replace(':fieldtype', col_data[n].fieldtype)
		.replace(':fieldtype', col_data[n].fieldtype)
	col_data.sql_row += col_data.sql
}

function build_sqlJ2c_cell_write(v,k,n,col_data, rowObj){
	console.log(col_data[n])
	var cellId_v = rowObj[k+'_id']
	console.log(k+'/'+v+'/'+cellId_v+'/'+n)
	if(cellId_v){
		col_data.sql = sql_1c.table_data_cell_update()
		col_data.sql = col_data.sql.replace(':cell_id', cellId_v)
		build_sqlJ2c_cell_write_parameters(col_data, v, n)
	}else if(v){
		col_data.sql = sql_1c.table_data_cell_insert()
		col_data.sql = col_data.sql.replace(':column_id', n)
		while(col_data.sql.indexOf(':nextDbId2')>0){
			col_data.sql = col_data.sql.replace(':nextDbId2', ':nextDbId'+col_data.nextDbIdCounter)
		}
		col_data.nextDbIdCounter++
		build_sqlJ2c_cell_write_parameters(col_data, v, n)
	}
}

sql_1c.remove_row = function(){
		return "DELETE FROM string WHERE string_id = :doc_id ;" +
				"DELETE FROM doc WHERE parent = :doc_id ;" +
				this.remove_doc_record()
	}
sql_1c.remove_doc_record = function(){
		return "DELETE FROM doc WHERE doc_id = :doc_id "
	}

sql_1c.table_data_cell_update = function(){
		return "UPDATE :fieldtype SET value =:value WHERE :fieldtype_id=:cell_id ;"
	}
sql_1c.table_data_row_insert = function(){
		return "INSERT INTO doc (doc_id, parent, doctype) VALUES (:nextDbId1 , :table_id , 4) ;"
	}
sql_1c.table_data_cell_insert = function(){
		return "INSERT INTO doc (doc_id, parent, reference, doctype) VALUES (:nextDbId2, :row_id , :column_id,  5) ;" +
			"INSERT INTO :fieldtype (value,:fieldtype_id) VALUES (:value, :nextDbId2 ) ;"
	}
sql_1c.table_data_readSql = function(){
		return "SELECT * FROM doc d, docbody s \n" +
		"WHERE parent = :table_id AND s.docbody_id=d.doc_id AND doctype!=4"
	}
sql_1c.table_data_read_limit = function(){
		return "" +
				this.table_data_read()
//				+"LIMIT 50"
	}
sql_1c.table_data_read = function(){
		return "SELECT rws.parent tbl_id, rws.doc_id row_id \n" +
				":add_columns \n" +
				"FROM doc tbl, doc rws \n" +
				":add_joins " +
				"WHERE tbl.doc_id=:table_id AND tbl.doc_id=rws.parent AND rws.doctype=4"
	}
sql_1c.table_data_columntyps = function(){
		return "SELECT tbl.doc_id table_id, cln.doc_id cln_id, 'col_'||cln.doc_id col_key " +
		", typevalue.value col_table_name, clntype.doc_id clntype_id " +
		"FROM doc tbl, doc cln , doc clntype, string typevalue " +
		"WHERE tbl.doc_id=:table_id AND tbl.doc_id=cln.parent AND cln.doctype=8 " +
		"AND clntype.doc_id=cln.reference AND typevalue.string_id=clntype.doc_id "
	}
sql_1c.table_data_columns_interpretation = function(){
		return "SELECT * FROM doc dc, doc dci " +
				"WHERE dci.doctype=16 AND dci.parent=dc.doc_id AND dc.parent=:tableId"
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
sql_1c.table_types = function(){
		return "SELECT doc_id fieldtype_id, * FROM doc, string " +
				"WHERE doc_id=string_id and reference is null and doctype=8"
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
sql_1c.table_insert = function(){
		return "INSERT INTO doc (parent, doc_id, doctype) VALUES (:folderId, :nextDbId1, :doctype) ;" +
			"INSERT INTO string (value,string_id) VALUES (:value, :nextDbId1) ;"
	}
sql_1c.create_table_insert = function(){
		return "INSERT INTO doc (parent, reference, doc_id, doctype) \n" +
			"VALUES (:tableId, :fieldtypeId, :nextDbId1, 8) ;" +
			"INSERT INTO string (value,string_id) VALUES (:value, :nextDbId1) ;"
	}
sql_1c.create_table_update_sql = function(){
		return "UPDATE docbody SET docbody = :value WHERE docbody_id IN ( \n" +
				"SELECT doc_id FROM doc where doctype=:doctype and parent = :tableId)"
	}
sql_1c.create_table_insert_sql = function(){
		return "INSERT INTO doc (parent, doc_id, doctype) \n" +
			"VALUES (:tableId, :nextDbId1, :doctype) ;" +
			"INSERT INTO docbody (docbody,docbody_id) VALUES (:value, :nextDbId1) ;"
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
sql_1c.tables_of_folder = function(){
		return "SELECT * FROM (" +
				this.read_tables() +
				") WHERE parent=:folderId"
	}
sql_1c.read_tables_with_tableId = function(){
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
	}
sql_1c.read_tables = function(){
		return "SELECT d.*, s.* FROM doc d, string s, ( \n" +
				this.folders()+
				"\n) d2 WHERE d2.doc_id=d.parent \n" +
				"AND s.string_id=d.doc_id \n" +
				"AND d.doctype in (1,6,17) "
	}
sql_1c.folder_insert = function(){
		return "INSERT INTO doc (doc_id, doctype) VALUES (:nextDbId1, 14);" +
				"INSERT INTO string (value,string_id) VALUES (:value, :nextDbId1);"
	}
sql_1c.folders = function(){
		return "SELECT string_id folderId, value folderName, * " +
				"FROM string s, doc WHERE doc_id=string_id and doctype=14"
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

function str2UaTimestamp(edTs){
	var edTsa = edTs.match(/(\d+)/g)
	var d = new Date()
	var year = edTsa[2]*1
	var addCentury = (year>d.getFullYear()-2000)?1900:2000
	edTsa[2] = year > 1000 ? year : (year + addCentury)
	d.setFullYear(edTsa[2])
	d.setMonth(edTsa[1]*1-1)
	d.setDate(edTsa[0])
	d.setHours(edTsa[3])
//	d.setUTCHours(edTsa[3])
	d.setMinutes(edTsa[4])
	return d
}
