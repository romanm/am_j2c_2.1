
var App_fn = function($scope, $http){
	this.getMsp_id = function(){
		var msp_id = 188;
		if($scope.principal && $scope.principal.msp_id){
			var msp_id = $scope.principal.msp_id;
		}
		console.log(msp_id);
		return msp_id;
	}
}

init_am_directive.init_icpc2_test2_report = function($scope, $http){
	console.log('------init_am_directive.init_init_icpc2_test2_report-----------------');
	$scope.seekParam = {
		year:2018,
		setYear:function(year){this.year=year;},
		setMonth:function(month){this.month=month;},
		getURL:function(){
			return '?year='+this.year+'&month='+this.month;
		},
		initFromRequest:function(){
			console.log($scope.request.parameters)
		}
	};
	$scope.seekParam.initFromRequest();
	var app_fn = new App_fn($scope, $http);
	$scope.$watch('principalResponse',function(newValue){if(newValue){
		console.log('----$scope.$watch(principal,function()------118------');
		app_fn.getMsp_id();
		console.log(sql2.f74_day_rows_all__select())
		var params={msp_id:123, sql:spaceClean(sql2.f74_day_rows_all__select())}
		console.log(params)
		$http.get(url_sql_read,{params:params}).then(function(response) {
			console.log(response.data.list)
		});

	}});
}

var url_sql_read = '/r/url_sql_read2';

function spaceClean(s){return s.replace(/\n/g, " ")}

var sql2= {
	f74_day_rows_all__select:function(){
		return "SELECT day_of_year(created) year_day, x.* FROM (\n" +
				"SELECT doc_id row_id, ds.*, reference2 FROM doc row, doctimestamp ds \n" +
				"WHERE row.doc_id=doctimestamp_id AND row.parent_id=9774 AND NOT row.removed AND row.doctype=9 \n" +
				") x WHERE YEAR(created)=2018"
	}
}
