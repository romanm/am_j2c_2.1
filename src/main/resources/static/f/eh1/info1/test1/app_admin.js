
init_am_directive.init_onload.icpc2_test=function($scope, $http){
	console.log('--------init_am_directive.init_onload.icpc2_test---------------')
	console.log($scope)
	
	$scope.programRun = {
		table:{
			programFile:{
				commonArgs:{scopeObj:'table'},
				TablesJ2C:{param:{sql:'table',table_id:48,url:'/r/read_sql_with_param'}},
				html_tableJ2C:{}
			}
		},
	}
	
}

var url_read_sql_with_param = '/r/read2_sql_with_param';
init_am_directive.init_onload.app_admin=function($scope, $http){
	console.log('--------init_am_directive.init_onload.app_admin---------------')
	console.log($scope)

	$scope.$watch('seekIcd10', function(newValue){if(newValue){
		console.log(newValue)
		read_sql_with_param($http, {sql:'sql2.icd10.seek',doctype:89,seek:'%'+newValue+'%'}, function(response){
			$scope.icd10.list=response.data.list;
			console.log(response.data)
		});
	}});

	$scope.programRun = {
		folders:{
			programFile:{
				commonArgs:{scopeObj:'folders'},
				TablesJ2C:{param:{sql:'sql2.stringDocType.select',doctype:56},
					col_keys:{
						name:'Папки',
						doc_id:'ІН',
					},
					col_links:{
						doc_id:{k:'doc_id',vk:'doc_id'},
					},
				},
				html_tableJ2C:{}
			}
		},
		datadictionary:{
			programFile:{
				commonArgs:{scopeObj:'datadictionary'},
				TablesJ2C:{param:{sql:'sql2.stringDocType.select',doctype:6},
					col_keys:{
						name:'Словник',
						doc_id:'ІН',
					},
					col_links:{
						doc_id:{k:'dd_id',vk:'doc_id'},
					},
				},
				html_tableJ2C:{}
			}
		},
		icpc2:{
			programFile:{
				commonArgs:{scopeObj:'icpc2'},
				TablesJ2C:{param:{sql:'sql2.icpc2.select',doctype:6},
					col_keys:{
						code:'Код',
						value:'Назва',
						doc_id:'ІН',
						part:'Група',
						doctype:'zГрупа',
					},
					col_links:{
						doc_id:{k:'dd_id',vk:'doc_id'},
					},
				},
				html_tableJ2C:{}
			}
		},
		icd10:{
			programFile:{
				commonArgs:{scopeObj:'icd10'},
				TablesJ2C:{param:{sql:'sql2.icd10.select',doctype:89},
					col_keys:{
						icd_code:'Код',
						icd_name:'Діагноз',
						doc_id:'ІН',
					},
					col_links:{
						doc_id:{k:'dz_id',vk:'doc_id'},
					},
				},
				html_form_type01:{
					source_path:'/f/eh1/info1/test1/icd10-table.html',
					init:function(ele, v){
						console.log('----22------html_form_type01------');
						init_am_directive.ele_v.html_form_type01(ele, v);
					}
				},
				h1tml_tableJ2C:{}
			},
			click_icd10Value:function(icd10){
				console.log(icd10)
				console.log(icd10.doc_id)
				if($scope.icd10.values &&
					$scope.icd10.values.parent.doc_id==icd10.doc_id
				){
					delete $scope.icd10.values;
				}else{
					read_sql_with_param($http, {sql:'sql2.icd10value.seek',doctype:91,parent_id:icd10.doc_id}, function(response){
						$scope.icd10.values={parent:icd10};
						$scope.icd10.values.list=response.data.list;
						console.log($scope.icd10)
					});
				}
			}
		},
	}

}
