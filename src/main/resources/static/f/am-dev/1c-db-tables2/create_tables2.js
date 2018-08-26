init_am_directive.init_create_tables2 = function($scope, $http, $filter, $route) {
	init_am_directive.ehealth_declaration($scope, $http, $filter);
	console.log(123)
	console.log($scope.request.parameters)

	$scope.pageVar = {
		open_modal:false,
		rowKey:null,
		rowKeyObj:null,
		rowObj:null,
		ngStyleModal:{},
		openEditRow:function(o){
			this.o = o
			this.ngStyleModal = {display:'block'}
			this.rowKeyObj = o.col_links[Object.keys(o.col_links)[0]]
			this.rowKey =
				$scope.request.parameters[this.rowKeyObj.k]
			if(this.rowKey){
				angular.forEach(o.list,function(v){
					if($scope.pageVar.rowKey == v[$scope.pageVar.rowKeyObj.vk]){
						$scope.pageVar.rowObj  = v
					}
				})
				console.log(this)
			}
		}
	}

	$scope.folders = {
		id:'folders',
		col_keys:{
			folderName:'Папка',
			folderId:'ІН',
		},
		col_links:{
			folderId:{k:'folderId',vk:'folderId'},
		},
	}
	
	$scope.tables = {
		id:'tables',
		col_keys:{
			value:'Назва таблиці',
			doc_id:'ІН',
		},
		col_links:{
			doc_id:{k:'tableId',vk:'doc_id'},
		},
	}

	$scope.create_tables = {
		id:'create_tables',
		col_keys:{
			tablename:'Таблиця',
			fieldname:'Колонка',
			fieldtype:'Тип даних',
		},
	}

	readSql({ sql:sql_1c.create_tables() }, $scope.create_tables)
	readSql({ sql:sql_1c.folders() }, $scope.folders)
	readSql({ sql:sql_1c.tables() }, $scope.tables)
	
}
var readSql = function(params, obj){
	exe_fn.httpGet(exe_fn.httpGet_j2c_table_db1_params_then_fn(
	params,
	function(response) {
		obj.list = response.data.list
	}))
}
var sql_1c = {
	create_tables:function(){
		return "SELECT d1.doc_id table_id, d2.doc_id column_id, s1.value tablename ,s2.value fieldname ,rs2.value fieldtype " +
				"FROM doc d1, doc d2, doc r2, string rs2, string s1, string s2 " +
				"WHERE d1.doc_id=d2.parent AND d1.doctype=1 " +
				"AND s1.string_id=d1.doc_id " +
				"AND s2.string_id=d2.doc_id " +
				"AND d2.reference=r2.doc_id " +
				"AND rs2.string_id=r2.doc_id"
	},
	tables_of_folder:function(){
		
	},
	tables:function(){
		return "SELECT d.*, s.* FROM doc d, string s, ( \n" +
				this.folders()+
				") d2 WHERE d2.doc_id=d.parent \n" +
				"AND s.string_id=d.doc_id \n" +
				"AND d.doctype=1 "
	},
	folders:function(){
		return "SELECT string_id folderId, value folderName, * " +
				"FROM string s, doc WHERE doc_id=string_id and doctype=14"
	},
}
