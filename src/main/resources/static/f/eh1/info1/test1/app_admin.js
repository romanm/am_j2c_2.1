
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
		table2:{
			programFile:{
				commonArgs:{scopeObj:'table2'},
				TablesJ2C:{param:{sql:'sql2.table.select',table_id:9765,url:'/r/read2_sql_with_param'}},
				html_tableJ2C:{}
			}
		},
		icpc2_nakaz74:{
			programFile:{
				commonArgs:{scopeObj:'icpc2_nakaz74'},
				TablesJ2C:{param:{sql:'sql2.table.select',table_id:9774,url:'/r/read2_sql_with_param'}
				},
				html_form_type01:{
					source_path:'/f/eh1/info1/test1/icpc2_nakaz74-table.html',
					init:function(ele, v){
						console.log('----22------html_form_type01------');
						init_am_directive.ele_v.html_form_type01(ele, v);
					}
				},
			},
			edit:function(icpc2){
				console.log(icpc2)
				console.log(this)
				this.editObj = icpc2;
			},
			colValues:function(k, icpc2){
				var vK = this.colValuesKey[k];
				if(vK){
					var values = this[vK].values;
					return values;
				}

			},
			colValue:function(k, icpc2){
				var vK = $scope.programRun.icpc2_nakaz74.colValuesKey[k];
				if(vK){
					var values = $scope.programRun.icpc2_nakaz74[vK].values;
					var icpc2_k = icpc2[k];
					return values[icpc2_k];
				}
			},
			colValuesKey:{
				col_9775:'episode',
				col_9776:'consultare_type',
				col_9777:'exemption_type',
			},
			exemption_type:{
				values:{
					1:'чорнобелець',
					2:'ветеран',
					3:'мати-героїня',
				}
			},
			consultare_type:{
				values:{
					1:'амбулаторно',
					2:'вдома',
					3:'по телефону',
				}
			},
			episode:{
				values:{
					1:'первинне',
					2:'повторне',
					3:'зевершення епізоду',
				}
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
//				TablesJ2C:{param:{sql:'sql2.stringDocType.select',doctype:6},
				TablesJ2C:{param:{sql:'sql2.ddtable.select',doctype:6},
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
