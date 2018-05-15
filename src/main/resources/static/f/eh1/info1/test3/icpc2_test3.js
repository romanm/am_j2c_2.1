

init_am_directive.init_icpc2_test3 = function($scope, $http){
	console.log('-----init_icpc2_test3-----------------');
	$scope.col_save={
		col_9775:function(value,editObj){
			console.log(value)
			var data={ value:value }
			if(editObj.col_9775_id){
				data.sql='sql2.integer.updateCellById';
				console.log(data);
			}else{
				
			}
		}
	}

	$scope.col_values={
		col_9775:{
			1:'первинне',
			2:'повторне',
			3:'зевершення епізоду',
		}
	}
	$scope.icpc2_nakaz74={}
	$http.get('/r/read2_sql_with_param',
			{params:{sql:'sql2.j2c_table.selectByIdDesc',msp_id:188,table_id:9774}}
	).then(function(response) {
		delete response.data.add_joins
		delete response.data.add_columns
		delete response.data['sql2.j2c_table.selectByIdDesc']
		$scope.icpc2_nakaz74 = response.data
		$scope.icpc2_nakaz74.col_sort = ['col_10766','col_9775', 'col_10771']

		/*
		console.log(response.data)
		$scope.icpc2_nakaz74.list = response.data.list
		$scope.icpc2_nakaz74.list_0 = response.data.list_0
		$scope.icpc2_nakaz74.col_alias = response.data.col_alias
		$scope.icpc2_nakaz74.col_keys = response.data.col_keys
		 * */
		console.log($scope.icpc2_nakaz74)
		init_selectedCell($scope.icpc2_nakaz74)

	})

	
	init2_read_j2c_tables($scope, $http);

	
	$scope.table.rows = [1,2,3,4];
	

	var init_selectedCell = function(table){
		table.isCellSelect=function(row_k, col_k){
			if(table.selectedCell)
				return table.selectedCell.row_k==row_k && table.selectedCell.col_k==col_k
		}
		table.selectCell=function(row_k, col_k){
			console.log(table.selectedCell)
			if(table.selectedCell && table.selectedCell.col_k==col_k && table.selectedCell.row_k==row_k){
				delete table.selectedCell
			}else{
				table.selectedCell={row_k:row_k, col_k:col_k}
			}
		}
	}
	init_selectedCell($scope.table)

}
