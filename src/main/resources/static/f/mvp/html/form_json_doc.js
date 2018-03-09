init_am_directive.init_onload.form_json_doc=function($scope, $http){
	console.log('-------init_am_directive.init_onload.form_json_doc--------');
	$scope.programRun = {
		form_json_doc:{
			programFile:{
				fn_init_param:function(){
					if($scope.page.request.parameters.template){
						//change file.json name from parameter
						$scope.programRun.form_json_doc.programFile.TablesJ2C.param.url
							= '/f/mvp/'+ $scope.page.request.parameters.template;
						if($scope.page.request.parameters.template_ver)
							$scope.programRun.form_json_doc.programFile.TablesJ2C.param.url
								+=$scope.page.request.parameters.template_ver;
						$scope.programRun.form_json_doc.programFile.TablesJ2C.param.url
							+='.json';
					}
				},
				TablesJ2C:{
					param:{url:'/f/mvp/person_template.json'}},
				html_form_type01:{
					source_path:'/f/mvp/html/form_json_doc_form1.html',
					init:function(ele, v){
						console.log('----22------html_form_type01------');
						init_am_directive.ele_v.html_form_type01(ele, v);
				}},
				vars:{
					doc_types:[
						'legalEntity_template',
						'division_template',

						'person_template',
						'party_template',
						'employee_template',
						'employee_create_new_template',
						'patient_template',
						'ukr_med_registry_record_template',
						'create_medication_template',

						'declaration_template',
						'declaration_approve_template',
						'declaration_sign_template',
						'declaration_signed_template',

						
						]
				}
			}
		}
	}
	fn_lib.addProgram($scope.programRun, ['eh_dictionaries']);
	run_am_program($scope.programRun.eh_dictionaries, $scope, $http);

}
