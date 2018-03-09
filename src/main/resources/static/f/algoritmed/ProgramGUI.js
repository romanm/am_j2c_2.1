console.log('ProgramGUI');
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
			var programGUI = this.programGUI;
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

fn_lib.fn_sum = function(){
	return this.a*1 + this.b*1;
}

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
