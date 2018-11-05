var init_j2c_json_editor = function($scope, $http){


$scope.pageVar.config.openDatadictionary = function(){
	$scope.pageVar.config.viewConfigPart='datadictionary'
	console.log($scope.datadictionary)
}

$scope.cp = {}
$scope.cp.paste = function(el){
	this.pel = el
	console.log(this)
	if(this.cel){
		var data = {
			doc_id : this.pel.doc_id,
			reference : this.cel.doc_id,
			sql : sql_1c.doc_update_doc_reference(),
		}
		console.log(data)
		writeSql(data)
	}
}
$scope.cp.copy = function(el){
	this.cel = el
	console.log(this)
}

$scope.changeElement = {}
$scope.changeElement.changeJSON = function(){
	console.log(this.docbody)
	this.docbodyJSON = JSON.parse(this.docbody)
	console.log(this.docbodyJSON)
}
$scope.changeElement.saveUpdate = function(){
	console.log(this.o)
	console.log(this)
	var data = {
		value:this.name,
		string_id:this.o.doc_id,
		sql:sql_1c.doc_insert_string(),
	}
	if(this.o.string_id){
		data.sql = sql_1c.doc_update_string()
	}
	console.log(data)
	writeSql(data)
}

$scope.changeElement.openDialog = function(o){
	this.ngStyleModal = {display:'block'}
	console.log(o)
	this.o = o
	this.name = o.value
}

$scope.doc_data = {}
$scope.doc_data.addElement=function(o){
	console.log(o)
	var parentId = o.doc_id
	var data = {
		sql : sql_1c.doc_insert_elements(),
		parentId : parentId,
		dataAfterSave:function(){
			console.log(123)
		}
	}
	writeSql(data)
}
$scope.doc_data.downElement=function(o){this.upDowntElement(o, 1)}
$scope.doc_data.upElement=function(o){this.upDowntElement(o, -1)}
$scope.doc_data.upDowntElement=function(o, direction){
//	var oParent = this.elementsMap[o.parent]
		var oParent = $scope.doc_data_workdata.elementsMap[o.parent]
		var position = oParent.children.indexOf(o)
		var x = oParent.children.splice(position, 1)
		oParent.children.splice(position + direction, 0, x[0])
		angular.forEach(oParent.children, function(v,k){
		var data = {
			sort:k,
			sort_id:v.doc_id,
		}
		if(v.sort_id)
			data.sql = sql_1c.doc_update_sort()
		else
			data.sql = sql_1c.doc_insert_sort()
			writeSql(data)
		})
	}
$scope.doc_data.pasteElement=function(o){
		if(this.cutObject){
			var data = {
					sql : sql_1c.doc_cutPaste_elements(),
					parentId : o.parent,
					doc_id : this.cutObject.doc_id,
			}
			writeSql(data)
			console.log(data)
		}
	}
$scope.doc_data.cutElement=function(o){
		this.cutObject = o
	}
$scope.doc_data.minusElement=function(o){
		console.log(o)
		var data = {
			sql : sql_1c.remove_doc_record(),
			doc_id : o.doc_id,
		}
		writeSql(data)
	}

$scope.doc_data.readData=function(param, readDocData){
	//console.log(param)
	//console.log(readDocData)
	if(!param.readChildLevel){
		param.readChildLevel = 0
		readDocData.tableRoot = {}
		if($scope.tables)
		if($scope.tables.list[0])
			readDocData.tableRoot = $scope.tables.list[0]
		readDocData.elementsMap = {}
	}
//	console.log(param.readChildLevel)
	if(sql_1c['doc_read_elements_'+param.readChildLevel]){
		var sql = sql_1c['doc_read_elements_'+param.readChildLevel]()
		sql += ' ORDER BY sort'
		param.sql=sql
		/*
	console.log($scope.tables.list[0])
	console.log(param_readDoc)
	console.log(param_readDoc.doc_id)
		readSql(param_readDoc, o)
		 */
		readSqlToObjData(param, $scope.doc_data, readDocData)
	}
}
$scope.doc_data.afterRead=function(response, param, readDocData){
//		console.log($scope.doc_data.tableRoot)
//		console.log(param)
		//console.log($scope.tables)
		readDocData.list = response.data.list
		//console.log(readDocData.list)
		if(0==param.readChildLevel){
			if(!readDocData.list[0] && $scope.tables){
				this.addElement($scope.tables.list[0])
			}
		}
		if(readDocData.list[0]){
			angular.forEach(readDocData.list, function(v){
				readDocData.elementsMap[v.doc_id] = v
				if(readDocData.elementsMap[v.parent]){
					if(!readDocData.elementsMap[v.parent].children)
						readDocData.elementsMap[v.parent].children = []
					readDocData.elementsMap[v.parent].children.push(v)
				}
				//console.log($scope.doc_data.tableRoot.docRoot)
				if(0==param.readChildLevel){
					console.log('--------------292---------------------------')
					if(v.doctype==18)
						readDocData.tableRoot.docRoot = v
				}
			})
			param.readChildLevel++
//			console.log(this)
			this.readData(param, readDocData)
		}else{
			if(param.readChildLevel > 0){
				console.log(param.readChildLevel)
				readSql({
					sql:sql_1c.doc_read_docName(),
					doc_id : $scope.request.parameters.jsonId,
					afterRead:function(response){
						console.log(response.data)
						readDocData.tableRoot.value = response.data.list[0].value
						readDocData.tableRoot.doctype = response.data.list[0].doctype
						console.log(readDocData.tableRoot)
					}
				})
			}
		}
	}

$scope.datadictionary = {}
console.log($scope.datadictionary)
var ddocId = 5036
$scope.doc_data.readData({docId:ddocId}, $scope.datadictionary)
//	console.log($scope.doc_data)

}
sql_1c.doc_read_docName = function(){
	return "SELECT * FROM doc, string where doc_id=string_id and doc_id=:doc_id"
}
sql_1c.doc_read_elements_5 = function(){
	return this.doc_read_elements() +
	"(SELECT d5.doc_id FROM doc d, doc d0, doc d1, doc d2, doc d3, doc d4, doc d5 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id " +
	"AND d1.parent=d0.doc_id " +
	"AND d2.parent=d1.doc_id " +
	"AND d3.parent=d2.doc_id " +
	"AND d4.parent=d3.doc_id " +
	"AND d5.parent=d4.doc_id " +
	")"
}
sql_1c.doc_read_elements_4 = function(){
	return this.doc_read_elements() +
	"(SELECT d4.doc_id FROM doc d, doc d0, doc d1, doc d2, doc d3, doc d4 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id " +
	"AND d1.parent=d0.doc_id " +
	"AND d2.parent=d1.doc_id " +
	"AND d3.parent=d2.doc_id " +
	"AND d4.parent=d3.doc_id " +
	")"
}
sql_1c.doc_read_elements_3 = function(){
	return this.doc_read_elements() +
	"(SELECT d3.doc_id FROM doc d, doc d0, doc d1, doc d2, doc d3 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id " +
	"AND d1.parent=d0.doc_id " +
	"AND d2.parent=d1.doc_id " +
	"AND d3.parent=d2.doc_id " +
	")"
}
sql_1c.doc_read_elements_2 = function(){
	return this.doc_read_elements() +
	"(SELECT d2.doc_id FROM doc d, doc d0, doc d1, doc d2 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id " +
	"AND d1.parent=d0.doc_id " +
	"AND d2.parent=d1.doc_id " +
	")"
}
sql_1c.doc_read_elements_1 = function(){
	return this.doc_read_elements() +
	"(SELECT d1.doc_id FROM doc d, doc d0, doc d1 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id " +
	"AND d1.parent=d0.doc_id " +
	")"
}
sql_1c.doc_read_elements_0 = function(){
	return this.doc_read_elements() +
	"(SELECT d0.doc_id FROM doc d, doc d0 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id)"
}

sql_1c.doc_read_elements = function(){
		return "SELECT * FROM doc " +
				"LEFT JOIN string ON string_id=doc_id " +
				"LEFT JOIN docbody ON docbody_id=doc_id " +
				"LEFT JOIN sort ON sort_id=doc_id " +
		"WHERE doc_id IN "
	}
sql_1c.doc_insert_string = function(){
	return "INSERT INTO string (value,string_id) VALUES (:value,:string_id)"
}
sql_1c.doc_update_doc_reference = function(){
	return "UPDATE doc SET reference=:reference WHERE doc_id=:doc_id"
}
sql_1c.doc_update_string = function(){
	return "UPDATE string SET value=:value WHERE string_id=:string_id"
}
sql_1c.doc_insert_sort = function(){
	return "INSERT INTO sort (sort,sort_id) VALUES (:sort,:sort_id)"
}
sql_1c.doc_update_sort = function(){
	return "UPDATE sort SET sort=:sort WHERE sort_id=:sort_id"
}
sql_1c.doc_insert_elements = function(){
	return "INSERT INTO doc (parent, doctype) VALUES (:parentId, 18)"
}
sql_1c.doc_cutPaste_elements = function(){
	return "UPDATE doc SET parent = :parentId " +
			"WHERE doc_id=:doc_id"
}
sql_1c.remove_doc_record = function(){
	return "DELETE FROM doc WHERE doc_id = :doc_id "
}
