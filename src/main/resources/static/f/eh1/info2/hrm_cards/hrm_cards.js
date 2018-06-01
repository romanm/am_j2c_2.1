
//console.log('------hrm_cards.js---------------')
init_am_directive.init_hrm_cards = function($scope, $http){
//	console.log('----init_am_directive.hrm_cards------------')
//	console.log(CRC32(JSON.stringify({a:1})))
	init_am_directive.ehealth_declaration($scope, $http);
	
	$scope.progr_am.fn.init_onLoad = function(){
		console.log('-----init_onLoad------------')
		if($scope.request.parameters.person_id){
			
			exe_fn.jsonEditorRead({
				url_template:'/f/mvp/employee_template2.json',
				docbody_id:$scope.request.parameters.person_id,
			});

		}
	}
	
	if($scope.request.parameters.person_id){

	}
	
	$scope.$watch('progr_am.viewes.hrm_menu.seek',function(seek){if(seek){
		console.log(seek)
	}})
	
	$scope.progr_am.viewes.j2c_table.dataName='hrm_cards'
	$scope.progr_am.hrm_cards={
		init_data:{
			row_key:'person_id',
			col_sort:['person_id', 'family_name', 'pip']
		},
		httpGet:{
			url:'/r/read2_sql_with_param',
			params:{
				sql:'sql.msp_employee.list',msp_id:188
			},
			then_fn:function(response) {
//				console.log(response.data)
				$scope.hrm_cards.data=response.data
				delete $scope.hrm_cards[$scope.hrm_cards.sql]
				delete $scope.hrm_cards.sql
//				console.log($scope.hrm_cards)
				$scope.hrm_cards.data
				.col_keys={
						person_id:'ІН',
						family_name:'Фамілія',
						pip:'ПІП'
				}
			}
		},
	}

	$scope.progr_am.hrm_cards.fn={}

	$scope.progr_am.fn.init_principal = function(){
		if($scope.principal.msp_id){
			$scope.progr_am.hrm_cards.httpGet.params.msp_id
				= $scope.principal.msp_id
		}
	}

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


	$scope.progr_am.fn.clear_oToEdit=function(){
		console.log($scope.oToEdit)
		delete $scope.oToEdit
		console.log($scope.oToEdit)
	},
	$scope.progr_am.fn.groupsToEdit='doctor|',
	$scope.progr_am.fn.isGroupToEdit=function(){
		if($scope.oToEdit){
			if(this.groupsToEdit.indexOf($scope.oToEdit.k)>=0)
				return true
		}
	},


	$scope.progr_am.fn.oToEdit_k_parent=function(){
		var k_parent = $scope.oToEdit.k_parent;
		return k_parent.split('|').splice(-2,1).toString()
	}
	
	$scope.progr_am.fn.removeFromList=function(){
		var d = {
			o:$scope.oToEdit.o.splice($scope.oToEdit.selectedItem,1)[0],
			dataObj:$scope.oToEdit.dataObj.splice($scope.oToEdit.selectedItem,1)[0],
		}
		return d
	}

	$scope.progr_am.fn.firstInList=function(){
		var d = this.removeFromList()
		$scope.oToEdit.dataObj.splice(0,0,d.dataObj)
		$scope.oToEdit.o.splice(0,0,d.o)
	}

	$scope.progr_am.fn.addToList=function(){
		var dataObj=this.getEditDocObj($scope.oToEdit.k_parent)
		var listElement0 = $scope.oToEdit.o[0],
		listElement1 = JSON.parse(JSON.stringify(listElement0));
		delete listElement1.$$hashKey
		$scope.oToEdit.o.push(listElement1)
		$scope.oToEdit.dataObj.push({})

	}


}

