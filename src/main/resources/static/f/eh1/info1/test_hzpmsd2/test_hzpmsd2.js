console.log('-------test_hzpmsd2.js-----------------');

init_am_directive.init_test_hzpmsd2_liste = function($scope, $http){
	console.log('------init_am_directive.test_hzpmsd2_liste-----------------');
	$scope.test_hzpmsd2_liste={
		f039_o_report:{name:'Форма 039/o запит'},
		f039_o_print:{name:'Форма 039/o друк'},
		f039_o_excell:{name:'Форма 039/o excell'},
		f074_o_form:{name:'Форма 074/o введення даних'},
	}
}