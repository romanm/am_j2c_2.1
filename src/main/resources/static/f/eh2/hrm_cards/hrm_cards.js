init_am_directive.init_hrm_cards3 = function($scope, $http, $filter, $route) {
	init_am_directive.ehealth_declaration($scope, $http, $filter);
	console.log($scope.progr_am.viewes)

	$scope.progr_am.viewes={
		json_form:{ngInclude:'/f/eh1/info2/hrm_cards/json_form1.html',
			dataName:'jsonTemplate',
			heightProcent:65,
		},
		hrm_menu:{ngInclude:'/f/eh1/info2/hrm_cards/hrm_menu.html',
			seek:null,
		},
		j2c_table:{
			ngInclude:'/f/eh2/j2c_table.html',
			n1gInclude:'/f/eh1/info2/hrm_cards/j2c_table.html',
			dataName:'hrm_cards',
			heightProcent:22,
		},
	}
	
	$scope.progr_am.hrm_cards = {}
	$scope.progr_am.hrm_cards.include = {
		j2c_table_content : '/f/eh2/hrm_cards/hrm_cards_j2ct_content.html',
	}
	$scope.progr_am.hrm_cards.col_sort = [
		'person_id',
		'family_name',
	]
	var msp_id=188
	var params = {
		sql:sql_hrm.msp_employee_list(),
		msp_id:msp_id,
	}
	exe_fn.httpGet( exe_fn.httpGet_j2c_table_params_then_fn(
	params,
	function(response) {
		$scope.progr_am.hrm_cards.data=response.data
		delete $scope.progr_am.hrm_cards.sql
		console.log($scope.progr_am.hrm_cards)
		$scope.progr_am.hrm_cards.data
		.col_keys={
			person_id:'ІН',
			family_name:'Фамілія',
			pip:'ПІП'
		}
	}))
}

var sql_hrm = {
	msp_employee_list:function(){
		return "SELECT p.*, username \n" +
				"FROM person p, users u, doc dEmployee, doc dMsp \n" +
				"WHERE dEmployee.doctype = 13 AND person_id=dEmployee.doc_id AND person_id=u.user_id \n" +
				"AND dMsp.parent_id=dEmployee.doc_id AND dMsp.reference=:msp_id"
	},
} 
