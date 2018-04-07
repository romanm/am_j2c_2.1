var url_read_sql_with_param = '/r/read2_sql_with_param';
init_am_directive.init_onload.app_admin=function($scope, $http){
	console.log('--------init_am_directive.init_onload.app_admin---------------')

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
				TablesJ2C:{param:{sql:'sql2.icd10.select',doctype:6},
					col_keys:{
						icd_code:'Код',
						icd_name:'Діагноз',
						doc_id:'ІН',
					},
					col_links:{
						doc_id:{k:'dz_id',vk:'doc_id'},
					},
				},
				html_tableJ2C:{}
			}
		},
	}

}

init_am_directive.init_onload.icpc2_test=function($scope, $http){
	console.log('--------init_am_directive.init_onload.icpc2_test---------------')

	
}