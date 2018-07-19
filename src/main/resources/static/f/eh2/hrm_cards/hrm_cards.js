init_am_directive.init_hrm_cards3 = function($scope, $http, $filter, $route) {
	init_am_directive.ehealth_declaration($scope, $http, $filter);
	console.log($scope.progr_am.viewes)
	$scope.progr_am.viewes={
		json_form:{ngInclude:'/f/eh1/info2/hrm_cards/json_form1.html',
			dataName:'jsonTemplate',
			heightProcent:65,
		},
		menu:{ngInclude:'/f/eh2/menu_middle.html',
			seek:'',
		},
		j2c_table:{
			ngInclude:'/f/eh2/j2c_table.html',
			dataName:'hrm_cards',
			heightProcent:22,
		},
	}

	$scope.progr_am.fn.save=function(){
		var data = {}
		$scope.progr_am.fn.calcEditDoc_CRC32()
		data.docbody = JSON.stringify($scope.editDoc)
		data.docbody_id = $scope.editDoc.docbody_id
		if(!data.docbody_id){
			data.docbody_id = $scope.editDoc.doc_id
		}
		saveAddData(data)
		data.sql = sql2.sql2_docbodyPerson_updateById()
		exe_fn.httpPost
		({	url:'/r/url_sql_update2',
			then_fn:function(response) {
				if(data.dataAfterSave){
					var e = response.data.list2[0],
					r = $scope.progr_am.hrm_cards.selectedCell.row
					r.pip_patient	= e.pip_patient
					r.birth_date	= partyObj.birth_date
					r.email			= partyObj.email
				}
			},
			data : data,
		})
	}

	var saveAddData = function(data){
		var partyObj = $scope.editDoc.party
		personCols.forEach(function(k){
			data[k]=partyObj[k]
			if($scope.progr_am.fn.date_names.indexOf(k)>=0){
				var d = new Date(partyObj[k])
				data[k] = d.toISOString().split('T')[0]
			}
			if(!data[k]) data[k]=''
		})
	}
	var personCols = ['last_name','first_name', 'second_name', 'email', 'birth_date'];

	$scope.progr_am.hrm_cards = {}
	$scope.progr_am.hrm_cards.include_table_menu 
		= '/f/eh2/table_menu2.html'
	exe_fn.import_fn($scope.progr_am.hrm_cards, 'Init_j2ct_fn_selectCell')
	$scope.progr_am.hrm_cards.include = {
		j2c_table_content : '/f/eh2/hrm_cards/hrm_cards_j2ct_content.html',
	}
	$scope.progr_am.hrm_cards.col_sort = [
		'person_id',
		'pip_patient',
		'birth_date',
	]
	$scope.progr_am.hrm_cards.data = {}
	$scope.progr_am.hrm_cards.data
	.col_keys={
		person_id:'ІН',
		pip_patient:'ПІП',
		birth_date:'д.н.',
	}
	var msp_id=188
	var params = {
		sql:sql_hrm.msp_employee_list_seek_withId(),
		msp_id:msp_id,
		person_id:0,
	}
	if($scope.request.parameters.person_id){
		params.person_id = $scope.request.parameters.person_id
		exe_fn.jsonEditorRead({
			url_template:'/f/mvp/employee_template2.json',
			doc_type:'employee',
			docbody_id:$scope.request.parameters.person_id,
		})
	}
	var readDB_hrm_cards = function(){
		params.seek = '%'+$scope.progr_am.viewes.menu.seek+'%'
		exe_fn.httpGet( exe_fn.httpGet_j2c_table_params_then_fn(
		params,
		function(response) {
			$scope.progr_am.hrm_cards.data.list=response.data.list
			delete $scope.progr_am.hrm_cards.sql
			var row = response.data.list[0]
			if($scope.request.parameters.person_id == row.row_id){
				if(!$scope.progr_am.hrm_cards.selectedCell.row){
					$scope.progr_am.hrm_cards.selectedCell.row = row
				}
			}
		}))
	}
	readDB_hrm_cards()
	
	$scope.$watch('progr_am.viewes.menu.seek', function(newValue,oldValue){if(newValue||oldValue){
		console.log(newValue)
		readDB_hrm_cards()
	}})
}

var sql_hrm = {
	msp_employee_list_seek_withId:function(){
		return "SELECT 0 sort, * FROM ( \n" +
				this.msp_employee_list()  +
				") x WHERE person_id=:person_id \n" +
				"UNION \n" +
				"SELECT 1 sort, x.* FROM (\n" +
				this.msp_employee_list_seek()  +
				") x WHERE person_id!=:person_id \n" +
				"ORDER BY sort"
	},
	msp_employee_list_seek:function(){
		return "SELECT * FROM (" +
				this.msp_employee_list() +
				") x WHERE LOWER(pip_patient) LIKE LOWER(:seek)"
	},
	msp_employee_list:function(){
		return "SELECT person_id row_id, \n" +
				"p.last_name||' '||p.first_name||' '||p.second_name pip_patient, \n" +
				"p.*, username \n" +
				"FROM person p, users u, doc dEmployee, doc dMsp \n" +
				"WHERE dEmployee.doctype = 13 AND person_id=dEmployee.doc_id AND person_id=u.user_id \n" +
				"AND dMsp.parent_id=dEmployee.doc_id AND dMsp.reference=:msp_id"
	},
} 
