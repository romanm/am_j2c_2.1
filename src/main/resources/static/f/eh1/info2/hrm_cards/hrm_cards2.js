init_am_directive.init_hrm_cards2 = function($scope, $http){
	init_am_directive.ehealth_declaration($scope, $http);
	
	$scope.progr_am.fn.init_principal = function(){
		if($scope.principal.msp_id){
			$scope.progr_am.hrm_cards.httpGet.params.msp_id
				= $scope.principal.msp_id
		}
	}

	$scope.progr_am.fn.init_onLoad = function(){
		console.log('-----init_onLoad------------')
		if($scope.request.parameters.person_id){

			exe_fn.httpGet({url:'/f/mvp/employee_template2.json', //read template
				then_fn:function(response) {
//					console.log(response.data)
					$scope.data.jsonTemplate=response.data
					exe_fn.httpGet({url:'/r/url_sql_read2', //read data
						params:{
							sql:sql2.sql2_docbody_selectById(),
							docbody_id:$scope.request.parameters.person_id},
							then_fn:function(response) {
								var //docbody = response.data.list[0].docbody
								docbody = JSON.parse(response.data.list[0].docbody);
								$scope.editDoc = docbody
								if($scope.editDoc.data)
									$scope.editDoc = $scope.editDoc.data
									console.log($scope.editDoc)
									$scope.progr_am.fn.calcEditDoc_CRC32()
									adaptTemplateToData($scope.editDoc, 
											$scope.data.jsonTemplate.employee_request)
							}
					})
				}
			})


			exe_fn.httpGet({url:'/f/eh1/dictionaries.json', //read eHealth dictionary
				then_fn:function(response) {
					$scope.eh_dictionaries={ehMap:{},};
					angular.forEach(response.data.data, function(v, k){
						$scope.eh_dictionaries.ehMap[v.name]=v;
					});
					console.log($scope.eh_dictionaries.ehMap)
					$scope.eh_dictionaries.getValues=function(k, k_parent){
						if('type'.indexOf(k)>=0)
							k = k_parent.split('|')
							.splice(-2,1)[0].slice(0, -1)+'_'+k
							else if('speciality'.indexOf(k)>=0){
								k='speciality_type'
							}else if('status'.indexOf(k)>=0){
								k = k_parent.split('|')[1]+'_'+k
							}else if('degree'.indexOf(k)>=0){
								k = k_parent.split('|')
								.splice(-2,1)[0].slice(0, -1)+'_'+k
								k = k.replace('docto_degree','science_degree')
							}else if('level'.indexOf(k)>=0){
								k = k_parent.split('|')
								.splice(-2,1)[0].slice(0, -1)+'_'+k
								k = k.replace('specialitie_level','speciality_level')
							}
						var valuesObject = this.ehMap[k.toUpperCase()]
						if(valuesObject){
							return valuesObject.values 
						}
					}
				}
			})

		}
	}

	$scope.progr_am.viewes.j2c_table.dataName='hrm_cards'
	$scope.progr_am.hrm_cards={
		init_data:{
			row_key:'person_id',
			col_sort:['person_id', 'family_name', 'pip']
		},
		httpGet:{ url:'/r/read2_sql_with_param',
			params:{
				sql:'sql.msp_employee.list',msp_id:188
			},
			then_fn:function(response) {
//					console.log(response.data)
				$scope.hrm_cards.data=response.data
				delete $scope.hrm_cards[$scope.hrm_cards.sql]
				delete $scope.hrm_cards.sql
//					console.log($scope.hrm_cards)
				$scope.hrm_cards.data
				.col_keys={
						person_id:'ІН',
						family_name:'Фамілія',
						pip:'ПІП'
				}
			}
		},
	}

}
