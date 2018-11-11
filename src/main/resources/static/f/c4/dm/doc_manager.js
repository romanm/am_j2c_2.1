app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	init_j2c_table_editor($scope, $http)

	$scope.pageVar.pageName = 'БД конфігуратор'
	$scope.pageVar.pageParent = {}
	$scope.pageVar.pageParent.url = '/v/create_tables2'
		$scope.pageVar.pageParent.params = function(){
		return "?tableId=" +
		$scope.request.parameters.tableId +
		""
	}
	$scope.tables = {}
	$scope.tables.no_edit=['doc_id','doctype']
	$scope.tables.col_keys={
		doc_id:'ІН',
		value:'Назва таблиці/документу',
		doctype:'T',
	}
	$scope.tables.col_links={
		doc_id:{k:'tableId',vk:'doc_id',path:'/f/c4/j2c_table_editor.html'},
	}
	console.log($scope.tables)
	var params_tables = { sql:sql_1c.read_tables() }
	console.log(params_tables.sql)
	readSql(params_tables, $scope.tables)

	$scope.folders = {}
	$scope.folders.saveUpdate=function(){
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
	}
	console.log($scope.folders)
	$scope.folders.no_edit=['row_id'],
	$scope.folders.col_keys = {}
	$scope.folders.col_keys.folderId='ІН'
	$scope.folders.col_keys.value='Папка'
	$scope.folders.col_keys.parent='П'
	$scope.folders.col_links={}
	$scope.folders.col_links.folderId={k:'folderId',vk:'folderId'},
	readSql({ sql:sql_1c.folders() }, $scope.folders)

})
sql_1c.folders = function(){
	return "SELECT string_id folderId, value folderName, * " +
			"FROM string s, doc WHERE doc_id=string_id and doctype=14"
}
sql_1c.folder_insert = function(){
	return "INSERT INTO doc (doc_id, doctype) VALUES (:nextDbId1, 14);" +
			"INSERT INTO string (value,string_id) VALUES (:value, :nextDbId1);"
}
sql_1c.read_tables = function(){
		return "SELECT d.*, s.* FROM doc d, string s, ( \n" +
				this.folders()+
				"\n) d2 WHERE d2.doc_id=d.parent \n" +
				"AND s.string_id=d.doc_id \n" +
				"AND d.doctype in (1,6,17) "
	}
sql_1c.folders = function(){
		return "SELECT string_id folderId, value folderName, * " +
				"FROM string s, doc WHERE doc_id=string_id and doctype=14"
	}
