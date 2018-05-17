init_am_directive.init_icpc2_test3 = function($scope, $http){
	console.log('-----init_icpc2_test3-----------------');
	

	$scope.getColValue=function(row,col_key){
		if(row[col_key]){
			if('col_9775|and_age017_village'.indexOf(col_key)>=0)
				return row[col_key]+':'+$scope.col_values[col_key][row[col_key]]
			else
				return row[col_key]
		}
	}

	$scope.col_values={
		col_9775:{
			1:'первинне',
			2:'повторне',
			3:'зевершення епізоду',
		}
	}
	
	var init_ngClick = function(table){
	table.col_save=function(value,editObj,col_k){
		var data={ value:value }
		if(editObj[col_k+'_id']){
			data.sql='sql2.integer.updateCellById';
			data.data_id=editObj[col_k+'_id'];
			$http.post('/r/update2_sql_with_param', data).then(function(response) {
				editObj[col_k]=response.data.value
			});
		}else{
			data.sql='sql2.integer.insertCellId';
			data.row_id=editObj.row_id;
			var cln_id = col_k.split('_')[1]
			data.cln_id = cln_id;
			$http.post('/r/update2_sql_with_param', data).then(function(response) {
				editObj[col_k+'_id'] = response.data.nextDbId1;
				editObj[col_k]=response.data.value
			});
		}
	}
		table.isCellSelect=function(row_k, col_k){
			if(table.selectedCell && !table.selectedCell.close)
				return table.selectedCell.row_k==row_k && table.selectedCell.col_k==col_k
		}
		table.closeDropdown=function(){
			table.selectedCell.close=true;
		}
		table.selectCell=function(row_k, col_k){
			if(table.selectedCell && table.selectedCell.col_k==col_k && table.selectedCell.row_k==row_k){
				if('col_10766|col_10771'.indexOf(col_k)>=0){
					if(table.selectedCell.close)
						delete table.selectedCell
				}else{
					delete table.selectedCell
				}
			}else{
				table.selectedCell={row_k:row_k, col_k:col_k}
			}
		}
	}
	
	$scope.icpc2_nakaz74={}
	$scope.icpc2_nakaz74.col_sort = ['col_10766','col_9775', 'col_10771']
	init_ngClick($scope.icpc2_nakaz74)
	$http.get('/r/read2_sql_with_param',
			{params:{sql:'sql2.j2c_table.selectByIdDesc',msp_id:188,table_id:9774}}
	).then(function(response) {
		delete response.data.add_joins
		delete response.data.add_columns
		delete response.data['sql2.j2c_table.selectByIdDesc']
		$scope.icpc2_nakaz74.data = response.data

		/*
		console.log(response.data)
		$scope.icpc2_nakaz74.list = response.data.list
		$scope.icpc2_nakaz74.list_0 = response.data.list_0
		$scope.icpc2_nakaz74.col_alias = response.data.col_alias
		$scope.icpc2_nakaz74.col_keys = response.data.col_keys
		 * */
		console.log($scope.icpc2_nakaz74)

	})

	init2_read_j2c_tables($scope, $http);
	

	$scope.dropdown_data = {
		seekICPC2:null,
		ngStyle:function(col_k){
			var style={}
			if('col_10771'==col_k){
				style.left='-250px';
			}
			return style;
		}
	};
	$scope.$watch('dropdown_data.seekIcpc2',function(seekIcpc2){if(seekIcpc2){
		console.log(seekIcpc2)
		fn_lib.read_data_col_10771()
	}})

	fn_lib.read_data_col_10771=function(){ // ICPC2
		console.log('--------read----dropdown---------')
		var params={seek:'%%'}
		if($scope.dropdown_data.seekIcpc2)
			params.seek = '%'+$scope.dropdown_data.seekIcpc2+'%'
		params.sql = sql2['f74_icpc2_seek__select']();
		params.sql = spaceClean(params.sql)
//		console.log(params)
		$http.get(url_sql_read,{params:params}).then(function(response) {
//			console.log(response.data)
			$scope.dropdown_data.list=response.data.list
			if(!$scope.dropdown_data.seekIcpc2)
				$scope.dropdown_data.col_keys={
					code:'Код',
					value:'Назва',
					doc_id:'ІН',
					part:'Група',
					doctype:'zГрупа',
				}
			console.log($scope.dropdown_data)
		})
	}

	$scope.$watch('icpc2_nakaz74.selectedCell.col_k',function(col_k){if(col_k){
		console.log(col_k)
		if(fn_lib['read_data_'+col_k])
			fn_lib['read_data_'+col_k]()
	}})

/*
	$scope.table.rows = [1,2,3,4];
	init_ngClick($scope.table)
*/

}
