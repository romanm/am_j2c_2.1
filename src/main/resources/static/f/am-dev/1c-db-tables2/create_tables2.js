init_am_directive.init_create_tables2 = function($scope, $http, $filter, $route) {
	init_am_directive.ehealth_declaration($scope, $http, $filter);
	console.log(123)
	console.log($scope.request.parameters)

	$scope.pageVar = {
		rowKey:null,
		rowKeyObj:null,
		rowObj:null,
		ngStyleModal:{},
		addRow:function(o){
			console.log(o)
			this.openModal(o)
		},
		openModal:function(o){
			this.o = o
			this.ngStyleModal = {display:'block'}
			this.rowKey = -1
			$scope.pageVar.rowObj  = {}
		},
		openEditRow:function(o){
			console.log(o)
			if(o.selectedObj.column_id){
				$scope.table_types = {}
				readSql({ sql:sql_1c.table_types() }, $scope.table_types)
				console.log($scope.table_types)
			}
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
			value:'Папка',
			folderId:'ІН',
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
			value:'Назва таблиці',
			doc_id:'ІН',
		},
		col_links:{
			doc_id:{k:'tableId',vk:'doc_id'},
		},
	}

	$scope.create_tables = {
		saveUpdate:function(){
			console.log($scope.pageVar.rowObj)
			if($scope.pageVar.rowKey == -1){
				var data = {
					sql : sql_1c.create_table_insert(),
					folderId : $scope.folders.selectedObj.folderId,
				}
				console.log(data)
				return
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
			tablename:'Таблиця',
			fieldname:'Колонка',
			fieldtype:'Тип даних',
			column_id:'ІН',
		},
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
	var params_tables = { sql:sql_1c.tables() }
	if($scope.request.parameters.folderId){
		params_tables.sql = sql_1c.tables_of_folder()
		params_tables.folderId = $scope.request.parameters.folderId
	}
	
	readSql({ sql:sql_1c.folders() }, $scope.folders)
	readSql(params_tables, $scope.tables)
	console.log(params_create_tables)
	readSql(params_create_tables, $scope.create_tables)
	
}
var sql_1c = {
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
