var url_read_sql_with_param = '/r/read2_sql_with_param';
init_am_directive.init_onload.app_admin=function($scope, $http){
	console.log('--------init_am_directive.init_onload.app_admin---------------')

	$scope.programRun = {
		folders:{
			programFile:{
				commonArgs:{scopeObj:'folders'},
				TablesJ2C:{param:{sql:'sql2.folders.select'},
					col_keys:{
						folder_name:'Папки',
						folder_id:'ІН',
					},
					col_links:{
						folder_id:{k:'folder_id',vk:'folder_id'},
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