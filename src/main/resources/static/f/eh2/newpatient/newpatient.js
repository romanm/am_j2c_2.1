init_am_directive.init_newpatient = function($scope, $http, $filter, $route) {
	init_am_directive.patient_doc($scope, $http, $filter, $route)
	if($scope.request.parameters.person_id){
		exe_fn.jsonEditorRead({
			url_template : '/f/mvp/party_template2.json',
			doc_type:'party',
			docbody_id:$scope.request.parameters.person_id,
		})
	}

}
