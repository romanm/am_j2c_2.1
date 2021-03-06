//the code of AlgoritmedJS compiler v.0.0.2
var app = angular.module('app', ['ngSanitize']);
var app_config = {fn:{}};
var fn_lib = {};
var init_am_directive = {ele_v:{},init_app:{},init_onload:{}};
var request = {}

fn_lib.DbDesign = function($scope, $http){
	this.k_instructions = ['folder','table']
	this.$scope = $scope;
	this.$http = $http;
	this.db_update = function(param, instruction){
		var thisObj = this;
		$http.post('/r/update_sql_with_param', param).then(function(response){
			console.log('--14----------------')
			console.log(instruction)

			for (var i = 0; i < thisObj.k_instructions.length; i++) {
				var ki = thisObj.k_instructions[i];
				if(param.sql.indexOf(ki)>0){
					param[ki+'_id']=response.data.nextDbId1;
					var p = eval('$scope.'+param.path0);
					//signal to start child init
					p[param.path1]=response.data.nextDbId1;
				}
			}
		});
	}
	this.init = fn_lib.DbDesign.init;
};

fn_lib.DbDesign.init = function(dbDesign){
	console.log('--32----------------')
//	console.log(dbDesign)
	var thisObj = this;
	angular.forEach(dbDesign, function(instruction, k){
		if('rows'==k){
			if(dbDesign.table_id){
				angular.forEach(instruction, function(row, k){
					var insertRowCells = function(row){
						angular.forEach(row, function(valueCell, kc){
							if(dbDesign.columns[kc]){
								if(!row[kc+'_id']){
									var column = dbDesign.columns[kc];		
									if(column.column_id){
										thisObj.$http.post('/r/update_sql_with_param', {
											sql:'sql.table_cell.insert',
											value:valueCell,
											row_id:row.row_id,
											column_id:column.column_id,
											valueTableName:column.valueTableName,
										}).then(function(response){
											console.log('----46-----------------------')
											console.log(response.data)
										});
									}
								}
							}
						});
					}
					if(!row.row_id){//make new table_row
						console.log(row)
						thisObj.$http.post('/r/update_sql_with_param', {
							sql:'sql.table_row.insert',
							table_id:dbDesign.table_id,
						}).then(function(response){
							console.log('----55-----------------------')
							console.log(response.data)
							row.row_id = response.data.nextDbId1;
							console.log(row)

							/*
							insertRowCells(row);
							 * */
						});
					}else{
						insertRowCells(row);
					}
				});
			}
		}else
		if('columns'==k){
			if(dbDesign.table_id){
				angular.forEach(instruction, function(v, k){
//					console.log('--41---------------- '+k)
					if(!v.column_id)
						thisObj.init.instruction.columns(v, dbDesign, thisObj);
//					fn_lib.DbDesign.init.instruction.columns(v, dbDesign);
				});
			}
		}else
		for (var i = 0; i < thisObj.k_instructions.length; i++) {
			var ki = thisObj.k_instructions[i];
			if(fn_lib.DbDesign.init.isInstruction(k, ki)){
//				console.log(k+'/'+ki)
//				console.log(instruction)

				instruction.$parent={o:dbDesign,k:k,ki:ki};
				if(dbDesign.$parent){
					var path0 = 'db_design.'+dbDesign.$parent.k;
					var path1 = dbDesign.$parent.ki+'_id';
					instruction.$parent.path0=path0;
					instruction.$parent.path1=path1;
					var parentIdListener = //почикати результат
					thisObj.$scope.$watch(path0+'.'+path1, function handleChange(newValue, oldValue ) {
						if(newValue){
							parentIdListener(); // результат є, чекати більше не треба
							runInit(ki, instruction);
						}
					});
				}else{
					var path0 = 'db_design.'+k;
					var path1 = ki+'_id';
					instruction.$parent.path0=path0;
					instruction.$parent.path1=path1;

					runInit(ki, instruction);
				}
			};
		}
	});
	function runInit(ki, instruction){
		fn_lib.DbDesign.init.instruction[ki](instruction, thisObj);
		if(typeof instruction === 'object'){
			thisObj.init(instruction);
		}
	}
}

fn_lib.DbDesign.init.instruction={};
fn_lib.DbDesign.init.instruction.table=function(instruction, thisObj){
	if(!instruction.table_id){
		var sql = 'sql.table.insert';
		var param = {
			sql:sql,
			path0:instruction.$parent.path0,
			path1:instruction.$parent.path1,
			value:instruction.table_name,
			doctype:1,
		}
		param.parent=instruction.$parent.o.folder_id;
		thisObj.db_update(param, instruction);
	}
}

fn_lib.DbDesign.init.instruction.columns=function(instruction, dbDesign, thisObj){
	instruction.sql = 'sql.columns.insert';
	instruction.parent = dbDesign.table_id;
	instruction.doctype = 8;
	instruction.replace_param = {value:'fieldname'};
	console.log('----75-----------------------')
	console.log(instruction)
	thisObj.$http.post('/r/update_sql_with_param', instruction).then(function(response){
		console.log('----107-----------------------')
		console.log(response.data)
	});
}

fn_lib.DbDesign.init.instruction.folder=function(instruction, thisObj){
	if(!instruction.folder_id){
		var sql = 'sql.folders.insert';
		var param = {
			sql:sql,
			path0:instruction.$parent.path0,
			path1:instruction.$parent.path1,
			value:instruction.folder_name,
			doctype:14,
		}
		if(!param.replace_param)
			param.replace_param = {}
		if(!instruction.parent){
			param.replace_param.parent	= 'nextDbId1';
		}
		thisObj.db_update(param, instruction);
	}
};

fn_lib.DbDesign.init.isInstruction = function(k, k_instruction){
	if(typeof k === 'string'){
		if(k===k_instruction){
			return true;
		}else{
			var restk = k.replace(k_instruction+'_','');
			if(parseInt(restk)){
				return true;
			}
		}
	}
	return false;
}

app.controller('ControllerApp1', function($scope, $http) {
	console.log('-------ControllerApp1--------');
	console.log($scope)

//	console.log(request)
	init_am_directive.init_programRuns($scope, $http);
	$scope.algoritmed = {programs:{} ,htmls:{} ,dbs:{} ,inits:{} };
});

request.parameters={};
//console.log(window.location);
if(window.location.search.split('?')[1]){
	angular.forEach(window.location.search.split('?')[1].split('&'), function(value, index){
		var par = value.split("=");
		request.parameters[par[0]] = par[1];
	});
}
//console.log(request);
request.viewKey = window.location.pathname.split('/v/')[1];
if(!request.viewKey){
	var splitHtml = window.location.pathname.split('.')
	if('html'==splitHtml[1]){
		var x = splitHtml[0].split('/')
		request.viewKey = x[x.length-1];
	}
	if(!request.viewKey){
		request.viewKey='index';
	}

}
var hash = window.location.hash.split('#')[1];
if(!hash||'!'==hash){
	hash = window.location.hash.split('#!#')[1];
}
if(hash){
angular.forEach(hash.split("&"), function(value, index){
	var par = value.split("=");
	request.parameters[par[0]] = par[1];
});
}

init_am_directive.init_onload=function($scope, $http){
//	console.log('-------init_am_directive.init_onload--------');
	$scope.app_config = {};
	if(!$scope.page) 
		$scope.page={request:request};
	if(!$scope.page.head)
		$scope.page.head={};

	angular.forEach(app_config.page_head_tabs, function(v, k){
		if(v.links.indexOf(request.viewKey)>=0){
			$scope.page.head.tabs_key=k;
			$scope.page.head.tabs_name=v.name;
		}
	});

	//init $scope.programRun
	if(init_am_directive.init_onload[$scope.page.head.tabs_key])
		init_am_directive.init_onload[$scope.page.head.tabs_key]($scope, $http);
	if(init_am_directive.init_onload[request.viewKey])
		init_am_directive.init_onload[request.viewKey]($scope, $http);
	//init GUI from $scope.programRun
//	console.log('--62-- '+request.viewKey+'/'+$scope.page.head.tabs_key)
	if($scope.programRun)
		if($scope.programRun[request.viewKey])
			if($scope.programRun[request.viewKey].gui)
				if($scope.programRun[request.viewKey].gui.init)
					$scope.programRun[request.viewKey].gui.init();
}

init_am_directive.init_app.init_page_head=function($scope){
	if(!$scope.page.head.headFilePath)
		$scope.page.head.headFilePath='/f/algoritmed/lib/page.head2.html'
	if(!$scope.page.head.headClass){
		$scope.page.head.headClass='l4 m4 s4'
		$scope.page.head.headClass2='l8 m8 s8'
	}
}

init_am_directive.init_app.init_serverWebSites=function($scope, $http){
	init_am_directive.init_onload($scope, $http);
	init_am_directive.init_app.init_page_head($scope);
	if(!app_config.serverWebSites)
		$http.get('/f/algoritmed/serverWebSites.json').then(function(response){
			app_config.serverWebSites = response.data;
			$scope.app_config.page_head_tabs = app_config.page_head_tabs;
			$scope.app_config.pages = app_config.serverWebSites;
			$scope.read_serverWebSites = true;
//			console.log($scope.page)
			var pageKey = $scope.page.pageKey();
			if(app_config.serverWebSites[pageKey])
				$scope.page.head.pageName = app_config.serverWebSites[pageKey].alias;
			if($scope.page.head.tabs_key)
				$scope.page.head.tabs={};
			if($scope.page.head.tabs_key){
				var tabs_key = $scope.page.head.tabs_key;
				init_am_directive.init_page_head_tabs($scope, tabs_key);
			}
		});
}

init_am_directive.init_page_head_tabs=function($scope, tabs_key){
	if(!$scope.page.head.tabs)
		$scope.page.head.tabs={};

	if(app_config.page_head_tabs){
		console.log(tabs_key)
		console.log(app_config.page_head_tabs[tabs_key])
		if(app_config.page_head_tabs[tabs_key]){
			console.log(app_config.page_head_tabs[tabs_key].links)
			angular.forEach(app_config.page_head_tabs[tabs_key].links, function(k, v){
				$scope.page.head.tabs[k]=app_config.serverWebSites[k];
			});
		}
	}
}

init_am_directive.init_programRuns=function($scope, $http){
	init_am_directive.init_app.init_serverWebSites($scope, $http);
	$http.get('/r/principal').then(function(response) {
		$scope.principal = response.data;
//		console.log($scope.principal)

		$scope.page.getConfigPrincipal=function(key){
			return app_config.principal[key];
		}

		$scope.page.getPrincipalRole = function(){
			if($scope.principal.principal){
				var authority = $scope.principal.principal.authorities[0].authority;
				return app_config.principal.role[authority];
			}
		}

		if('index'==$scope.page.pageKey()){
			var principalRole = $scope.page.getPrincipalRole();
			if(principalRole){
				var tabs_key = principalRole.page_head_tabs;
				init_am_directive.init_page_head_tabs($scope, tabs_key);
			}
		}

	});

	if(app_config.fn.pages)
		new app_config.fn.pages($scope).head();
	angular.forEach($scope.programRun, function(v, key_programName){
		if(v.programFile){
			if(!v.programFile.commonArgs)
				v.programFile.commonArgs = {};
			if(!v.programFile.commonArgs.scopeObj)
				v.programFile.commonArgs.scopeObj = key_programName;
			var commonArgs = v.programFile.commonArgs;
			angular.forEach(v.programFile, function(v2, key_commandName){
				v2.commonArgs = commonArgs;
			});
		}
	});
}

init_am_directive.list2map = function(l,o,id_key,key){
	o['map_'+key] = {};
	o['list_'+key] = [];
	angular.forEach(l, function(v, k){
		var id = v[id_key];
		o['map_'+key][id] = v;
		o['list_'+key][k] = id;
	});
};

app.directive('amdRun', function ($compile, $http) {
	return {
		restrict: 'EA',
		scope: false,
		link: function (scope, ele, attrs) {
			scope.$watch(attrs['amdRun'], function(program_init) {
				console.log(program_init);
				if(program_init.amProgramPath){
					//read a program 1 - to run program
					read_am_json_source(scope, ele, program_init.amProgramPath, $compile, $http);
				}else
				if(program_init.programFile){
					run_am_program(program_init, scope, $http, ele, $compile);
				}else
				if(program_init.programId){
					if(!scope.algoritmed.inits[program_init.programId]){
						scope.algoritmed.inits[program_init.programId] = program_init;
					}
				}
				if(program_init.html){
					ele.html(program_init.html);
					$compile(ele.contents())(scope);
				}
			});
		}
	};
});

function run_am_program(program_init, scope, $http, ele, $compile){
	angular.forEach(program_init.programFile, function(v, k){
//		console.log('--160-- '+k)
//	console.log(k+' -- '+program_init.programFile.commonArgs.scopeObj)
		v.parent=program_init.programFile;
		if(v.isFunction()) 
			v();
		else
		if(k.includes("TablesJ2C")){
			var tablesJ2C = new fn_lib.TablesJ2C(scope, $http, program_init.programFile);
			tablesJ2C.j2c_tables.http_get(v);
		}else
		if(k.includes("html_")){
		//console.log('--398-- '+k)
			read_am_html_source(scope, ele, v, k, $compile, $http);
		}
	});
}

function read_am_json_source(scope, ele, amProgramPath, $compile, $http){
	$http.get(amProgramPath).then(function(response){
		var amProgramRun = response.data;
		angular.forEach(amProgramRun, function(v, k){
			read_am_html_source(scope, ele, v, k, $compile, $http);
		});
	});
};

function read_am_html_source(scope, ele, v, k, $compile, $http){
	if(k.includes("html_")){
		var k1 = k.replace('html_','');
//		console.log('------189---------------------')
//		console.log(k1)
		var amdRun_pr_uri = v.source_path;
		if(!v.source_path)
			amdRun_pr_uri = '/f/algoritmed/lib/'+k1+'.html';
		ele.append('<div>'+amdRun_pr_uri+'</div>');
		//console.log(amdRun_pr_uri)
		var eleAdd = angular.element(ele[0].children[-1+ele[0].childElementCount]);
		//console.log(amdRun_pr_uri);
		//read a program 2 - from library level 1 in run program
		$http.get(amdRun_pr_uri).then(function(response) {
			var pr = response.data;
//			console.log(pr)

//			ele.html(pr);
//			ele.append(pr);
			eleAdd.html(pr);
//			console.log(eleAdd);
//			var id2 = ele[0].id+'__'+k1;
//			scope.algoritmed.inits[id2]=v;
			// activate amd-*attributes before compile
			if(v.init){
//				console.log(v);
				v.init(eleAdd,v);
			} else // for html_tableJ2C
				if(init_am_directive.ele_v[k]){
					init_am_directive.ele_v[k](eleAdd, v);
			} else // for html_tableJ2C
				if(init_am_directive.ele_v[k1]){
//					console.log(1);
					init_am_directive.ele_v[k1](eleAdd, v);
			}else 
			if(init_am_directive[k1]){
				console.log(1);
				init_am_directive[k1](scope, eleAdd, id2);
			}
			/*
			var pr3 = ele[0].children[1-ele[0].children.length];
			pr3.setAttribute('amd-'+k1,'"'+id2+'"');
			 * */
//			$compile(ele)(scope); //зациклює
			$compile(ele.contents())(scope);
//			$compile(eleAdd.contents())(scope);
		})
	}
};

app.directive('amdPrintln', function ($compile, $http) {
	return {
		restrict: 'EA',
		scope: true,
		link: function (scope, ele, attrs) {
			scope.$watch(attrs['amdPrintln'], function(obj_key) {
				var program_init = scope.algoritmed.inits[obj_key];
				if(program_init.isObject()){
					angular.forEach(program_init, function(v, k){
//						if(key_words[k]){}else
						if(k.indexOf('text_')==0){
							ele.html(v);
						}
					});
					init_am_directive.add_fn(program_init);
					angular.forEach(program_init.add_fn, function(v, k){
						ele.html(program_init[v]());
					});
					
				}else
				if((typeof program_init) == 'string'){
					ele.html(program_init);
				}
				$compile(ele.contents())(scope);
			});
	}	};
});

init_am_directive.translate_am_att = function(ele, v){
	if(ele.hasAttribute('am-link')){
		var a = document.createElement("a");
		a.setAttribute('href', v.parent.links[ele.getAttribute('am-link')]);
		a.innerHTML = ele.innerHTML;
		ele.innerHTML = a.outerHTML;
	}
	if(ele.children)
		angular.forEach(ele.children, function(ele1, k1){
			init_am_directive.translate_am_att(ele1, v);
		});
}

init_am_directive.ele_v.html_form_type01 = function(ele, v){
	var lastChildEle = ele[0].children[1-ele[0].children.length];
	init_am_directive.translate_am_att(lastChildEle, v);
//	console.log(v);
	var amObj = lastChildEle.getAttribute('am-obj');
//	console.log(amObj);
	var ngRepeat;
	if('ngRepeat'==amObj){
		ngRepeat = v.commonArgs[amObj];
	}else{
		var scopeObj = v.commonArgs[amObj];
		ngRepeat = lastChildEle.getAttribute('ng-repeat');
		ngRepeat = ngRepeat.replace('scopeObj',scopeObj);
	}
	lastChildEle.setAttribute('ng-repeat',ngRepeat);
}

init_am_directive.ele_v.tableJ2C = function(ele, v){
	var lastChildEle = ele[0].children[1-ele[0].children.length];
	/*
	console.log(v);
	console.log(v.parent);
	console.log(v.commonArgs);
	console.log(v.commonArgs.folders);
	 * */
	var scopeObj = v.commonArgs[lastChildEle.getAttribute('am-obj')];
	lastChildEle.setAttribute('ng-repeat','o in ['+scopeObj+']')
}

init_am_directive.add_fn = function(program_init){
	angular.forEach(program_init.add_fn, function(v, k){
		program_init[v]=fn_lib[v];
	})					
}

fn_lib.mergeObjectParameters = function(fromO, toO){
	if(fromO){
		angular.forEach(toO, function(v, k){
			if(v.isObject()){
				fn_lib.mergeObjectParameters(fromO[k],v);
			}else if(fromO[k]){
				toO[k]=fromO[k];
			}
		});
	}
}

fn_lib.TablesJ2C = function (scope, $http, programFile){
//console.log('-------TablesJ2C--------');
this.$scope = scope;
this.j2c_tables = {
	http_get : function(param){
//		console.log(param.param.url?param.param.url:url_read_sql_with_param);
		if(param.param.sql){
			if(param.param.sql.indexOf('.select')<0)
				param.param.sql = 'sql.'+param.param.sql+'.select';
		}
		var j2c_tables = this;
//		console.log(param.param);
		var read_http_get = function(){
			read_sql_with_param($http, param.param, function(response){
				j2c_tables.init(response, param);
			});
		}
		if(!param.after)	read_http_get();
		else
			scope.$watch(param.after,function() {
				if(scope[param.after])
					read_http_get()
			});
	}
	,init : function(response, param){
//		console.log(response.data);
		var scopeObj = param.commonArgs.scopeObj;
		//console.log(scopeObj);
		var tablesJ2C = this.tablesJ2C;
		if(!tablesJ2C.$scope[scopeObj]){
			tablesJ2C.$scope[scopeObj] = {};
			//console.log(tablesJ2C.$scope)
		}
		if(response.data.list){
			if(response.data.list[0] && response.data.list[0].docbody){
				tablesJ2C.$scope[scopeObj].list = [];
				angular.forEach(response.data.list, function(v, k){
					tablesJ2C.$scope[scopeObj].list.push(
						{docbody:JSON.parse(v.docbody)});
				})					
			}else{
	// :NEW_SPACE for -- init_am_directive.tablesJ2C_init
				var scopeData = tablesJ2C.$scope[scopeObj];
console.log(response.data)
				scopeData.list = response.data.list;
				if(param.col_links)
					scopeData.col_links = param.col_links;
				if(param.col_keys)
					scopeData.col_keys = param.col_keys;
				else if(response.data.col_keys)
					scopeData.col_keys = response.data.col_keys;
				scopeData.col_alias = response.data.col_alias;
			}
			//console.log(tablesJ2C.$scope[scopeObj])
		}else
		if(response.data.isObject()){
			tablesJ2C.$scope[scopeObj] = response.data;
		}
		if(init_am_directive[scopeObj] && init_am_directive[scopeObj].tablesJ2C_init){
			init_am_directive[scopeObj].tablesJ2C_init(response, param);
		}else
		if(init_am_directive.tablesJ2C_init){
			init_am_directive.tablesJ2C_init(response, param);
		}
		if(param.init){
			param.init(scope,response)
		}
//			console.log(tablesJ2C.$scope[scopeObj]);
	}
	,tablesJ2C:this
	}
	// :TODO http://localhost:8040/v/create_tables not work
	init_am_directive.t_123_ablesJ2C_init = function(response, param){
		if(response.data.list[0].docbody)
			scope[param.commonArgs.scopeObj].docbody = JSON.parse(response.data.list[0].docbody);
	};
}

fn_lib.addProgram = function(programRun, programList){
	console.log('----299--------------------');
	angular.forEach(programList, function(v, k){
		programRun[v] = app_config.programRun[v];
	});
}

// url_read_sql_with_param -- is rewritable in Controller file by demand 
var url_read_sql_with_param = '/r/read_sql_with_param';
var read_sql_with_param = function($http, params,fn, fn_error){
	//console.log(url_read_sql_with_param)
	//console.log(params)
	var url = params.url?params.url:url_read_sql_with_param;
	if(!fn_error)
		$http.get(url, {params:params}).then(fn);
	else
		$http.get(url, {params:params}).then(fn, fn_error);
}

Object.prototype.isFunction = function(){
	return typeof this == 'function'
};

Object.prototype.isArray = function(){
	return Array.isArray(this);
};

Object.prototype.isObject = function(){
	return (''+this).indexOf('Object')>=0;
};

Object.prototype.isObjectNotArray = function(){
	return this.isObject()&&!this.isArray();
}

Object.prototype.objKeys = function(){
	return Object.keys(this);
};

Array.prototype.last = function(){
	return this[this.length - 1];
}

