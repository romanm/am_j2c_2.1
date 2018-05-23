//console.log('----ehealth_declaration.js------------')
init_am_directive.ehealth_declaration = function($scope, $http){
//	console.log('----init_am_directive.ehealth_declaration------------')
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
}