init_am_directive.init_msp_division = function($scope, $http){
	console.log('-------msp_division----2------------')
	init_am_directive.ehealth_declaration($scope, $http);

	$scope.progr_am.fn.init_onLoad = function(){
		console.log('-----init_onLoad------------')
		if($scope.request.parameters.division_id){
			exe_fn.jsonEditorRead({
				url_template:'/f/mvp/division_template2.json',
				docbody_id:$scope.request.parameters.division_id,
			})
		}

	}

	$scope.progr_am.viewes.hrm_menu.seek_placeholder
		='пошук амбулаторії'
	$scope.progr_am.viewes.j2c_table.dataName='msp_division'
	$scope.progr_am.msp_division={
		init_data:{
			row_key:'division_id',
			include_cols:'/f/eh1/info2/msp_division/division_cols.html',
			col_sort:['division_id', 'name', 'address'],
			fn_col:{
				name1:function(row){
					return row.docbody.name
				},
			},
		},
		httpGet:{ url:'/r/url_sql_read2',
			params:{
				sql:sql2.sql2_msp_divisions_select(),msp_id:723,
			},
			then_fn:function(response) {
				$scope.msp_division.data=response.data
				$scope.msp_division.data
				.col_keys={
					division_id:'ІН',
					name:'Назва',
					address:'Адреса',
				}
				angular.forEach($scope.msp_division.data.list, function(v){
					v.docbody = JSON.parse(v.docbody)
				})
				console.log($scope.msp_division)
			}
		},
	}

}
