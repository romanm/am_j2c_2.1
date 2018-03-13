init_am_directive.init_onload.create_tables=function($scope, $http){
	console.log('-------init_am_directive.init_onload.create_tables--------');
	init_am_directive.tablesJ2C_init = function(response, param){
		$scope[param.commonArgs.scopeObj].list = response.data.list;
		if(param.col_keys)
			$scope[param.commonArgs.scopeObj].col_keys = param.col_keys;
		else if(response.data.col_keys)
			$scope[param.commonArgs.scopeObj].col_keys = response.data.col_keys;
	};
	
	$http.get('/f/am-dev/1c-db-tables/db_design.js').then(function(response) {
		var load_amProgram = response.data; 
		console.log(load_amProgram)
		$scope.db_design_src = load_amProgram;
		eval(load_amProgram);
		$scope.db_design = amProgram.db_design;
		var dbDesign = new fn_lib.dbDesign($scope, $http);
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
				commonArgs:{scopeObj:'tables'},
				TablesJ2C:{param:{sql:'tables'},col_keys:{
					col_tablename:'Ім´я таблиці'
				}},
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
				TablesJ2C:{param:{sql:'folders'},col_keys:{
					folder_name:'Папки',
					folder_id:'ІН',
				}},
				html_tableJ2C:{}
			}
		},

	};
	
}
