
init_am_directive.init_onload.create_tables=function($scope, $http){
	console.log('-------init_am_directive.init_onload.create_tables--------');
	init_am_directive.tablesJ2C_init = function(response, param){
		$scope[param.commonArgs.scopeObj].list = response.data.list;
		if(param.col_keys)
			$scope[param.commonArgs.scopeObj].col_keys = param.col_keys;
		else if(response.data.col_keys)
			$scope[param.commonArgs.scopeObj].col_keys = response.data.col_keys;
	};
	
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
		}
	};
}

