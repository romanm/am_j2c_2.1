//console.log('----ehealth_declaration.js------------')
init_am_directive.ehealth_declaration = function($scope, $http){
//	console.log('----init_am_directive.ehealth_declaration------------')
	
//	$scope.data.jsonTemplate={x:'y'}

	$scope.$watch('principal',function(){ if($scope.principal){
		console.log('----$scope.$watch(principal,function()------8------');
		if($scope.progr_am.fn.init_principal)
			$scope.progr_am.fn.init_principal()
		exe_fn.run_progr_am()
	} });

	
	$scope.progr_am.fn.ngStyle=function(component_name, add_style){
		var style={}
		if('json_form|j2c_table'
				.indexOf(component_name)>=0
		){
			var hp = $scope.progr_am
			.viewes[component_name].heightProcent
			var h = procentWindowHeight(hp)
			style.height= h+'px';
			style.overflow='auto';
		}
		if(add_style)
			angular.forEach(add_style, function(value, style_name){
				style[style_name]=value;
			})
			return style;
	},
	
	$scope.progr_am.viewes={
		json_form:{ngInclude:'/f/eh1/info2/hrm_cards/json_form1.html',
			dataName:'jsonTemplate',
			heightProcent:65,
		},
		hrm_menu:{ngInclude:'/f/eh1/info2/hrm_cards/hrm_menu.html',
			seek_placeholder:'пошук картки працівника',
			seek:null,
		},
		j2c_table:{ngInclude:'/f/eh1/info2/hrm_cards/j2c_table.html',
			dataName:'hrm_cards',
			heightProcent:22,
		},
	},

	$scope.eHealth = {
		msp:{name:'ЛЗ',
			msp_data:'данні ЛЗ',
			msp_registry:'реєстрація ЛЗ',
			msp_division:'підрозділи',
		},
		hrm:{name:'Відділ кадрів',
			hrm_cards:'карточки',
		},
		physician:{name:'Кабінет лікаря',
			declaration:'декларація'
		},
	}
	$scope.eHealth.pageGroup = function(){
		var r
		angular.forEach(this, function(v,k){
			angular.forEach(v, function(v1,k1){
				if($scope.request.viewKey.indexOf(k1)==0)
					r=v
			})
		})
		return r
	}
}

var sql2= {
	sql2_docbody_selectById:function(){
		return "SELECT * FROM docbody WHERE docbody_id=:docbody_id"
	},
	sql2_docbody_updateById:function(){
		return "UPDATE docbody SET docbody=:docbody " +
				" WHERE docbody_id=:docbody_id"
	}
}

