init_am_directive.patient_doc = function($scope, $http, $filter){
	console.log('---init_am_directive.patient_doc ---')
	init_am_directive.ehealth_declaration($scope, $http, $filter);
/*
	$scope.include = {
		j2c_table_content:'/f/eh2/newpatient/patient_list_j2c_table_content.html',
	}
*/
	$scope.progr_am.viewes.j2c_table.dataName = 'patient_lists'
	$scope.progr_am.viewes.j2c_table.ngInclude= '/f/eh2/j2c_table.html'

	exe_fn.init_j2c_table_seek('sql2_patient_lists', $scope.request.parameters.person_id)
	exe_fn.httpGet_j2c_table_params = function(params){
		return exe_fn.httpGet_j2c_table_params_then_fn(
		params,
		function(response) {
			$scope.patient_lists.data = response.data
			$scope.patient_lists.data
			.col_keys = {
				person_id : 'ІН',
				pip_patient : 'ПІП',
				birth_date : 'дата народженя',
				email: 'e-mail'
			}
			init_ngClick($scope.patient_lists);
		})
	}

	var init_ngClick = function(icpc2_nakaz74){
		init_f74_ngClick(icpc2_nakaz74, $scope, $http);
		icpc2_nakaz74.clickToSave.add_row=function(){
			console.log('-------clickToSave------add_row:w-----------')
			exe_fn.httpPost
			({	url:'/r/url_sql_update2',
				then_fn:function(response) {
					console.log(response.data)
					window.location.replace(
							'?person_id=' + response.data.nextDbId1		
					)
				},
				data:{
					sql:sql2.sql2_patient_insert(), 
				},
			})
		}
	}
	
	var params = { sql : sql2.sql2_patient_lists(), }
	if($scope.request.parameters.person_id){
		var seek = $scope.request.parameters.seek?$scope.request.parameters.seek:''
		var params = { 
			sql : sql2.sql2_patient_lists_seek_withId(),
			id:$scope.request.parameters.person_id,
			seek:'%'+seek+'%'
		}
	}

	$scope.progr_am.patient_lists = {
		init_data:{
			col_sort:['person_id',  'pip_patient', 'birth_date', 'email'],
			include_table_menu:'/f/eh2/table_menu.html',
		},
		include : {
			j2c_table_content:'/f/eh2/newpatient/patient_list_j2c_table_content.html',
		},
		httpGet : exe_fn.httpGet_j2c_table_params(params),
	}

	$scope.initDocToPerson = false

	$scope.$watchGroup(['editDoc', 'patient_lists.data'],
	function(newValue, oldValue){
		if(newValue[0]&&newValue[1]&&!$scope.initDocToPerson){
			$scope.initDocToPerson = true;
			if($scope.request.parameters.person_id){
				$scope.patient_lists.selectedCell={
					row_id:$scope.request.parameters.person_id,
				}

				angular.forEach($scope.patient_lists.data.list,function(v){
					if(v.row_id==$scope.patient_lists.selectedCell.row_id){
						$scope.patient_lists.selectedCell.row=v
					}
				})
				var e = $scope.editDoc,
					r = $scope.patient_lists.selectedCell.row
				personCols.forEach(function(k){ e[k]=r[k] })
			}
		}
	});

}

init_am_directive.ehealth_declaration_pageGroup = function($scope, $http, $filter){
	console.log('---read_abk.js---ehealth_declaration_pageGroup---')
	$scope.include = {
		j2c_table_content:'/f/eh2/calendar/calendar_j2c_table_content.html',
		icpc2_cell_dropdown_content:
			'/f/eh2/icpc2_test4/icpc2_cell_dropdown_content_o74.html',
	}

	addViews_abk_MenuJ2c = function(){
		$scope.progr_am.viewes.menu = {
			ngInclude:'/f/eh1/info2/hrm_cards/hrm_menu.html',
			seek:null,
		}
		$scope.progr_am.viewes.j2c_table = {
			ngInclude:'/f/eh2/j2c_table.html',
			dataName:'icpc2_nakaz74',
			heightProcent:22,
		}
	}
	
	console.log('-------------------5--------------------')
	$scope.progr_am.icpc2_nakaz74={}

	/*
	$scope.progr_am.icpc2_nakaz74.httpGet = {
		url:'/r/read2_sql_with_param',
		params:{
			sql:'sql2.j2c_table.selectByIdDesc',msp_id:188,table_id:9774
		},
		then_fn:function(response) {
			delete response.data.add_joins
			delete response.data.add_columns
			delete response.data['sql2.j2c_table.selectByIdDesc']
			$scope.icpc2_nakaz74.data = response.data
			$scope.icpc2_nakaz74.mapDate = {}
			angular.forEach($scope.icpc2_nakaz74.data.list,function(v, key){
				var mapDateKey = $filter('date')(v.created, 'shortDate'),
				h = $filter('date')(v.created, 'H')
				if(!$scope.icpc2_nakaz74.mapDate[mapDateKey])
					$scope.icpc2_nakaz74.mapDate[mapDateKey]= {list:[],hours:{}}
				var mapDateValue = $scope.icpc2_nakaz74.mapDate[mapDateKey]
				mapDateValue.list.push(v)
				if(!mapDateValue.hours[h])
					mapDateValue.hours[h] = []
				mapDateValue.hours[h].push(v)
				if($scope.request.parameters.row_id==v.row_id){
					$scope.icpc2_nakaz74.selectedCell = {row:v, row_id:v.row_id}
				}
			})
			$scope.progr_am.icpc2_nakaz74.data
			= $scope.icpc2_nakaz74.data
			console.log('-------------------75--------------------')
//			init_ngClick($scope.progr_am.icpc2_nakaz74)
			init_f74_ngClick($scope.progr_am.icpc2_nakaz74, $scope, $http);
		}
	}
	 * */

	
	init0_f74_ngClick = function(icpc2_nakaz74, $scope, $http){
		icpc2_nakaz74.isEditRow = function(row){
			return icpc2_nakaz74.selectedCell &&
			icpc2_nakaz74.selectedCell.row_id==row.row_id
//			return $scope.editRow && row.row_id == $scope.editRow.row_id
		}
	}

	init0_f74_ngClick($scope.progr_am.icpc2_nakaz74, $scope, $http)
/*
	$scope.progr_am.icpc2_nakaz74.init_data = {
		col_values:{
			col_9776:{
				1:'амбулаторно',
				2:'вдома',
				3:'по телефону',
			},
			col_9775:{
				1:'первинне',
				2:'повторне',
				3:'зевершення епізоду',
			},
			col_10900:{
				1:'місто',
				2:'село',
			},
		},
		include_cols:'/f/eh2/icpc2_test4/icpc2_cell_content_o74.html',
		i1nclude_cols:'/f/eh1/info1/test3/icpc2_test3_cols.html',
		col_sort:['creat_date', 'col_10766', 'col_9775', 'col_10771', 'col_11327', 'col_10777', 'col_10807' ,'col_9776'],
	}
	$scope.progr_am.icpc2_nakaz74.init_data.include_table_menu 
		= '/f/eh2/table_menu.html'
 * */

}
