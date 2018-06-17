init_am_directive.init_icpc2_test4 = function($scope, $http){
	console.log('-----init_icpc2_test4-----------------');
	init_am_directive.ehealth_declaration($scope, $http);
	$scope.include = {
		j2c_table_content:'/f/eh2/icpc2_test4/j2c_table_content.html'
	}
	$scope.progr_am.viewes = {
		j2c_table:{ngInclude:'/f/eh2/j2c_table.html',
			dataName:'icpc2_nakaz74',
		},
	},

	$scope.progr_am.icpc2_nakaz74={
		init_data:{
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
			include_cols:'/f/eh1/info1/test3/icpc2_test3_cols.html',
			col_sort:['creat_date', 'col_10766','col_9775', 'col_10771', 'col_10777','col_10807'
				,'col_9776','col_10900'],
		},
		httpGet:{
			url:'/r/read2_sql_with_param',
			params:{
				sql:'sql2.j2c_table.selectByIdDesc',msp_id:188,table_id:9774
			},
			then_fn:function(response) {
				delete response.data.add_joins
				delete response.data.add_columns
				delete response.data['sql2.j2c_table.selectByIdDesc']
				$scope.icpc2_nakaz74.data = response.data
				$scope.progr_am.icpc2_nakaz74.data
					= $scope.icpc2_nakaz74.data
				init_ngClick($scope.progr_am.icpc2_nakaz74)
			}
		},
	}

	console.log($scope.progr_am)

	var init_ngClick = function(icpc2_nakaz74){
		icpc2_nakaz74.selectCell=function(row_k, col_k){
			if(icpc2_nakaz74.selectedCell 
			&& icpc2_nakaz74.selectedCell.col_k==col_k 
			&& icpc2_nakaz74.selectedCell.row_k==row_k)
			{
				if('col_10766|col_10771|col_10807|col_10777'.indexOf(col_k)>=0){
					if(icpc2_nakaz74.selectedCell.close)
						delete icpc2_nakaz74.selectedCell
				}else{
					delete icpc2_nakaz74.selectedCell
				}
			}else{
				var row = icpc2_nakaz74.data.list[row_k];
				icpc2_nakaz74.selectedCell = {row_k:row_k, col_k:col_k, row_id:row.row_id}
			}
			console.log(icpc2_nakaz74.selectedCell)
		}
		icpc2_nakaz74.isCellSelect=function(row_k, col_k, row){
			if(icpc2_nakaz74.selectedCell && !icpc2_nakaz74.selectedCell.close){
				if(icpc2_nakaz74.selectedCell.row_id==row.row_id)
					return icpc2_nakaz74.selectedCell.row_k==row_k 
						&& icpc2_nakaz74.selectedCell.col_k==col_k
			}
		}
	}

}
