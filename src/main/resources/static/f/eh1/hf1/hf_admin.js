var url_read_sql_with_param = '/r/read2_sql_with_param';
//the code for request this group of pages or her app_config.page_head_tabs
console.log('-----hf_admin.js--------');

init_am_directive.init_onload.hf_division=function($scope, $http){
	console.log('-------init_am_directive.init_onload.hf_division--------');
	$scope.programRun = {
		hf_division:{
			programFile:{
				fn_init_param:function(){
					console.log('-------11----------------');
					if($scope.page.request.parameters.msp_division_id){
						console.log($scope.page.request.parameters);
						$scope.programRun.hf_division.programFile.TablesJ2C.param.msp_division_id
							= $scope.page.request.parameters.msp_division_id;
				}},
				TablesJ2C:{
					param:{sql:'msp_division', msp_division_id:723
					, MSP_EHEALT_RESPONSE_type:48
				}},
				html_form_type01:{
					source_path:'/f/eh1/hrm1/employees-cards-table.html',
					init:function(ele, v){
						console.log('----22------html_form_type01------');
						init_am_directive.ele_v.html_form_type01(ele, v);
				}},
				links:{
					link_to_employee:'/v/employee'
				}
			}
		}
	}
}

init_am_directive.init_onload.hf_data=function($scope, $http){
	console.log('-------init_am_directive.init_onload.hf_data--------');
	$scope.programRun = {
		hf_data:{
			programFile:{
				TablesJ2C:{param:{sql:'docbody_byId', doc_id:723}},
				commonArgs:{ngRepeat:'legalEntity in [hf_data.list[0].docbody]',},
				html_form_type01:{
					source_path:'/f/eh1/hf1/hf_data_form.html',
				},
			}
		}
	}
	fn_lib.addProgram($scope.programRun, ['eh_dictionaries']);
	run_am_program($scope.programRun.eh_dictionaries, $scope, $http);
//	run_am_program($scope.programRun.hf_data, $scope, $http);
}

init_am_directive.init_onload.hf_divisions=function($scope, $http){
	console.log('-------init_am_directive.init_onload.hf_divisions--------');
	$scope.programRun = {
			hf_divisions:{
				programFile:{
				fn_init_param:function(){
					if($scope.page.request.parameters.employee_id)
						$scope.programRun.employee.programFile.TablesJ2C.param.doc_id
							= $scope.page.request.parameters.employee_id;
				},
				TablesJ2C:{
					param:{sql:'msp_divisions', msp_id:723
					, MSP_EHEALT_RESPONSE_type:48
				}},
				html_form_type01:{
					source_path:'/f/eh1/hf1/hf_divisions-table.html',
					init:function(ele, v){
						console.log('----22------html_form_type01------');
						init_am_directive.ele_v.html_form_type01(ele, v);
				}},
				links:{
					link_to_edit:'/v/hf_division?msp_division_id={{o.docbody.doc_id}}'
				}
			}
		}
	};
//	run_am_program($scope.programRun.hf_divisions, $scope, $http);
}