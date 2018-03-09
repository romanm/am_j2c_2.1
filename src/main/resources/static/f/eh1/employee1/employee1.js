var url_read_sql_with_param = '/r/read2_sql_with_param';

console.log('-employee1.js-');

init_am_directive.init_onload.new_employee=function($scope){
	console.log('-------init_am_directive.init_onload.new_employee--------');
	$scope.programRun = {
			new_employee:{
				programFile:{
				}
			}
	};
};

init_am_directive.init_onload.employees_cards=function($scope, $http){
	console.log('-------init_am_directive.init_onload.employees_cards--------');
	$scope.programRun = {
			employees_cards:{
				programFile:{
					TablesJ2C:{
						param:{sql:'msp_employee',msp_id:723}
					},		
					html_form_type01:{
						source_path:'/f/eh1/hrm1/employees-cards-table.html',
						init:function(ele, v){
							console.log('----25------html_form_type01------');
							init_am_directive.ele_v.html_form_type01(ele, v);
					}},
					links:{
						link_to_employee:'/v/employee?employee_id={{employee_id}}'
					}
				}
			}
		};
		
		init_am_directive.employees_cards = {};
		init_am_directive.employees_cards.tablesJ2C_init=function(response, param){
			init_am_directive.list2map(response.data.list_0,$scope.employees_cards,'person_id','employees');
			init_am_directive.list2map(response.data.list,$scope.employees_cards,'user_id','user');
			console.log($scope.employees_cards)
		};

}

init_am_directive.init_onload.employee=function($scope, $http){
	console.log('-------init_am_directive.init_onload.employee--------');
	$scope.programRun = {
			employee:{
				programFile:{
					fn_init_param:function(){
						if($scope.page.request.parameters.employee_id)
							$scope.programRun.employee.programFile.TablesJ2C.param.doc_id
								= $scope.page.request.parameters.employee_id;
					},
					TablesJ2C:{param:{sql:'docbody_byId', doc_id:826}},
					html_form_type02:{ source_path:'/f/eh1/employee1/test1.html',
						init:function(ele, v){
							console.log('----57------html_form_type02------');
							init_am_directive.ele_v.html_form_type01(ele, v);
							$scope.$watch('form_json_doc',function(){
								$scope.$watch('employee',function(newEmployee){
									if(newEmployee){
										fn_lib.mergeObjectParameters(
											$scope.employee.docbody,
											$scope.form_json_doc.employee_request,
										);
									}
								});
							});
						},
					},
					h1tml_form_type01:{ source_path:'/f/eh1/employee1/employee2_form.html',
						init:function(ele, v){
							console.log('----57------html_form_type01------');
							init_am_directive.ele_v.html_form_type01(ele, v);
					}},
				},
				gui:{
					init:function(){
						if(!$scope.page.request.parameters.tab)
							$scope.page.request.parameters.tab='employee_template';
					},
					tabs:{
						employee_template:{name:'🗟 дані'},
//						employee_template:{name:'🗟 дані працівник'},
						person_template:{name:'ф.№ П-2'},
						print:{name:'🖶 друк'},
					},
				},
			},
			form_json_doc:{
				programFile:{
					TablesJ2C_2:{param:{url:'/f/mvp/employee_template2.json'}},
				}
			}
		};

	run_am_program($scope.programRun.form_json_doc, $scope, $http);
	fn_lib.addProgram($scope.programRun, ['eh_dictionaries']);
	run_am_program($scope.programRun.eh_dictionaries, $scope, $http);
		
	init_am_directive.eh_dictionaries = {
		tablesJ2C_init:function(response, param){
			console.log('----70-------------');
			$scope.eh_dictionaries = response.data;
			$scope.eh_dictionaries.keys = {};
			angular.forEach($scope.eh_dictionaries.data, function(v, k){
				$scope.eh_dictionaries.keys[v.name] = k;
			});
			$scope.eh_dictionaries.selectDictionary = function(k){
				var i = this.keys[k.toUpperCase()];
				var v = this.data[i];
				return v;
			}
			console.log($scope.eh_dictionaries);
		}
	};
	// :OLD_SPACE for -- init_am_directive.tablesJ2C_init = function(response, param){
		// 1c-tables not work
	init_am_directive.tablesJ2C_init = function(response, param){
		if(response.data.list)
			if(response.data.list[0].docbody)
				$scope[param.commonArgs.scopeObj].docbody 
				= JSON.parse(response.data.list[0].docbody);
	};
}
