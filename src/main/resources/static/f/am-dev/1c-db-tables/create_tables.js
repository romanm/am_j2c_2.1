init_am_directive.init_onload.create_tables=function($scope, $http){
	console.log('-------init_am_directive.init_onload.create_tables--------');
	init_am_directive.tablesJ2C_init = function(response, param){
		var scopeData = $scope[param.commonArgs.scopeObj]; 
		scopeData.list = response.data.list;
		if(param.col_links)
			scopeData.col_links = param.col_links;
		if(param.col_keys)
			scopeData.col_keys = param.col_keys;
		else if(response.data.col_keys)
			scopeData.col_keys = response.data.col_keys;
	};
	
	$http.get('/f/am-dev/1c-db-tables/db_design.js').then(function(response) {
		var load_amProgram = response.data; 
		console.log(load_amProgram)
		$scope.db_design_src = load_amProgram;
		eval(load_amProgram);
		$scope.db_design = amProgram.db_design;
		var dbDesign = new fn_lib.DbDesign($scope, $http, 3);
		dbDesign.init($scope.db_design);
	});

	$scope.programRun = {
		create_tables:{
			programFile:{
				commonArgs:{scopeObj:'create_tables'},
				TablesJ2C:{param:{sql:'create_tables'}, after:'tables',
					col_keys:{
						tablename:'Таблиця',
						fieldname:'Колонка',
						fieldtype:'Тип даних',
					},
				},
				html_tableJ2C:{},
			}
		},
		tables:{
			programFile:{
				fn_init_param:function(){
					if($scope.page.request.parameters.folder_id){
						$scope.programRun.tables.programFile.TablesJ2C.param.folder_id
							= $scope.page.request.parameters.folder_id;
						$scope.programRun.tables.programFile.TablesJ2C.param.sql
							= 'sql.tables.folder.select'
					}
				},
				commonArgs:{scopeObj:'tables'},
				TablesJ2C:{param:{sql:'tables',folder_id:45},
					col_keys:{
						col_tablename:'Ім´я таблиці',
						row_id:'ІН',
					},
					col_links:{
						row_id:{k:'table_id',vk:'row_id'},
					},
				},
				html_tableJ2C:{}
			}
		},
		table:{
			programFile:{
				commonArgs:{scopeObj:'table'},
				TablesJ2C:{param:{sql:'table'}},
				html_tableJ2C:{}
			}
		},
		folders:{
			programFile:{
				commonArgs:{scopeObj:'folders'},
				TablesJ2C:{param:{sql:'folders'},
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

	};
	
}
