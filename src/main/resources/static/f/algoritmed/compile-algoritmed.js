var fn_lib = {};
var init_am_directive = {};

var app = angular.module('app', []);

init_am_directive.form = function(scope, ele, id2){
	var pr3 = ele[0].children[1-ele[0].children.length];
	var modelObj = "algoritmed.inits['"+id2+"']";
	angular.forEach(pr3.children, function(v, k){
		if(v.getAttribute('am-bind')){
			v.setAttribute('ng-bind',modelObj+"."+v.getAttribute('am-bind'));
		}else
		if(v.getAttribute('am-model')){
			v.setAttribute('ng-model'
					, modelObj+"['"+v.getAttribute('am-model')+"']");
		}
	});
	var program_init = scope.algoritmed.inits[id2];
	this.add_fn(program_init);
};

app.directive('amdForm', function ($compile, $http) {
	return {
		restrict: 'EA',
		scope: true,
		link: function (scope, ele, attrs) {
			scope.$watch(attrs['amdForm'], function(obj_key) {
				console.log(obj_key);
				console.log(scope.algoritmed.inits)
			});
	}	};
});

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

function read_am_html_source(scope, ele, v, k, $compile, $http){
	if(k.includes("html_")){
		var k1 = k.replace('html_','');
		var amdRun_pr_uri = v.source_path;
		if(!v.source_path)
			amdRun_pr_uri = '/f/algoritmed/lib/'+k1+'.html'
			console.log(amdRun_pr_uri)
		//read a program 2 - from library level 1 in run program
		$http.get(amdRun_pr_uri).then(function(response) {
			var pr = response.data;
			ele.html(pr);
			var id2 = ele[0].id+'__'+k1;
			scope.algoritmed.inits[id2]=v;
			if(init_am_directive[k1])
				init_am_directive[k1](scope, ele, id2);
			var pr3 = ele[0].children[1-ele[0].children.length];
			pr3.setAttribute('amd-'+k1,'"'+id2+'"');
			$compile(ele.contents())(scope);
		})
	}
}

function read_am_json_source(scope, ele, amProgramPath, $compile, $http){
	$http.get(amProgramPath).then(function(response){
		var amProgramRun = response.data;
		angular.forEach(amProgramRun, function(v, k){
			read_am_html_source(scope, ele, v, k, $compile, $http);
		});
	});
}

app.directive('amdRun', function ($compile, $http) {
	return {
		restrict: 'EA',
		scope: true,
		link: function (scope, ele, attrs) {
			scope.$watch(attrs['amdRun'], function(program_init) {
				if(program_init.amProgramPath){
					//read a program 1 - to run program
					read_am_json_source(scope, ele, program_init.amProgramPath, $compile, $http);
				}else
				if(program_init.programFile){
					angular.forEach(program_init.programFile, function(v, k){
						read_am_html_source(scope, ele, v, k, $compile, $http);
					});
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

var read_sql_with_param = function($http, params,fn, fn_error){
	var uri = '/r/read_sql_with_param';
	console.log(uri);
	if(!fn_error){
		$http.get(uri, {params:params}).then(fn);
	}else{
		$http.get(uri, {params:params}).then(fn, fn_error);
	}
}

function ProgramGUI(scope, $http) {
	this.program_files = {
		http_get : function(prFolder){
			console.log(prFolder)
			var program_files = this;
			read_sql_with_param($http, {sql:'sql.program_files.select',folderId:prFolder.doc_id}, function(response){
				program_files.init(response);
			});
		}
		,init : function(response){
			console.log(response.data)
			console.log(response.data.list[0])
			console.log(response.data.list[0].docbody)
			if(!programGUI.scope.program_files)
				programGUI.scope.program_files = {};
			programGUI.scope.program_files.list = response.data.list;
			angular.forEach(programGUI.scope.program_files.list, function(v, k){
				v.programFile = JSON.parse(v.docbody);
				console.log(v.programFile);
			});
		}
		,programGUI:this
	}
	this.program_folder = {
		http_get : function(){
			var program_folder = this;
			read_sql_with_param($http, {sql:'sql.program_folder.select'}, function(response){
				program_folder.init(response);
			});
		}
		,init : function(response){
			var programGUI = this.programGUI;
			if(!programGUI.scope.program_folder)
				programGUI.scope.program_folder = {};
			programGUI.scope.program_folder.list = response.data.list;
			programGUI.scope.program_folder.click = function(pf){
				programGUI.program_files.http_get(pf);
			};
		}
		,programGUI:this
	}
	this.scope = scope;
}

app.controller('ControllerDB', function($scope, $http) {
	console.log('-------ControllerDB--------')
	$scope.algoritmed = { programs:{} ,htmls:{} ,dbs:{} ,inits:{} }
	programGUI = new ProgramGUI($scope, $http);
	programGUI.program_folder.http_get();
});

app.controller('Controller', function($scope, $http) {
	$scope.format = 'M/d/yy h:mm:ss a';
	$scope.amdRunObj = function() {
		console.log(this)
	}
	$scope.click = function(arg) {
		console.log($scope.algoritmed);
	}
	$scope.algoritmed = {
		programs:{}
		,htmls:{}
		,dbs:{}
		,inits:{}
		,amdRuns:[
			{amProgramPath:'/f/algoritmed/sample001/helloworld.json'}
			,{amProgramPath:'/f/algoritmed/sample001/helloworld_sum.json'}
			,{amProgramPath:'/f/algoritmed/sample001/helloworld_sum_dialog.json'}
		]
	}
	$scope.text='Hello World!';
	$scope.programs = {};
	$scope.programs.html
		= '<a ng-click="click(1)" href="#">Click me {{text}} </a>';
});

var key_words = {
	add_fn:{}
	,source_path:{}
}

init_am_directive.add_fn = function(program_init){
	angular.forEach(program_init.add_fn, function(v, k){
		program_init[v]=fn_lib[v];
	})					
}

fn_lib.fn_sum = function(){
	return this.a*1 + this.b*1;
}

Object.prototype.isObject = function(){
	return (''+this).indexOf('Object')>=0;
}
