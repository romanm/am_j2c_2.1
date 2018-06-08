init_am_directive.init_msp_division = function($scope, $http){
	console.log('-------msp_division----2------------')
	init_am_directive.ehealth_declaration($scope, $http);

	$scope.progr_am.fn.init_onLoad = function(){
		console.log('-----init_onLoad------------')
		if($scope.request.parameters.division_id){
			exe_fn.jsonEditorRead({
				url_template:'/f/mvp/division_template3.json',
				doc_type:'division',
				docbody_id:$scope.request.parameters.division_id,
			})
		}
	}
	

	$scope.progr_am.fn.j2c.isSelected_row=function(){
		return $scope.editDoc && $scope.editDoc.doc_id==$scope.request.parameters.division_id;
	}

	$scope.progr_am.fn.j2c.remove_row=function(){
		console.log('-------j2c.remove_row--------16----------')
		exe_fn.httpPost
		({	then_fn:function(response) {
				window.location.replace('?division_id='
				+ $scope.request.parameters.division_id
				)
			},
			data:{
				sql:sql2.sql2_docById_delete(), 
				doc_id:$scope.request.parameters.division_id,
			},
			url:'/r/url_sql_update2',
		})
	}

	$scope.progr_am.fn.j2c.add_row=function(){
		console.log('------j2c.add_row--------16----------')
		var docbody = {name:'<Назва>'}
		exe_fn.httpPost
		({	url:'/r/url_sql_update2',
			data:{
				sql:sql2.sql2_docDocbody_insert(), 
				docbody:JSON.stringify(docbody), 
				doctype:16,//division
				parent_id:exe_fn.msp.msp_id,
			},
			then_fn:function(response) {
				window.location.replace('?division_id='
				+ response.data.nextDbId1		
				)
			},
		})
	}

	$scope.progr_am.viewes.j2c_table.dataName = 'msp_division'
	$scope.progr_am.fn.row_key='division_id',
	$scope.progr_am.viewes.hrm_menu.seek_placeholder
		='пошук амбулаторії'
	$scope.progr_am.msp_division = exe_fn.msp.msp_division

}
