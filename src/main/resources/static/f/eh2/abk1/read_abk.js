console.log('---read_abk.js---')
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

	$scope.progr_am.icpc2_nakaz74.httpGet = {
		url:'/r/read2_sql_with_param',
		params:{
			sql:'sql2.j2c_table.selectByIdDesc',msp_id:188,table_id:9774
		},
		then_fn:function(response) {
			delete response.data.add_joins
			delete response.data.add_columns
			delete response.data['sql2.j2c_table.selectByIdDesc']
			/*
				console.log($scope.icpc2_nakaz74)
				console.log($scope.progr_am.icpc2_nakaz74)
			 * */
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
			console.log($scope.icpc2_nakaz74.mapDate)
			$scope.progr_am.icpc2_nakaz74.data
			= $scope.icpc2_nakaz74.data
			console.log('-------------------75--------------------')
//			init_ngClick($scope.progr_am.icpc2_nakaz74)
			init_f74_ngClick($scope.progr_am.icpc2_nakaz74, $scope, $http);
		}
	}
	
	init0_f74_ngClick = function(icpc2_nakaz74, $scope, $http){
		icpc2_nakaz74.isEditRow = function(row){
			return icpc2_nakaz74.selectedCell &&
			icpc2_nakaz74.selectedCell.row_id==row.row_id
//			return $scope.editRow && row.row_id == $scope.editRow.row_id
		}
	}

	init0_f74_ngClick($scope.progr_am.icpc2_nakaz74, $scope, $http)

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
	console.log($scope.progr_am.icpc2_nakaz74)
}
