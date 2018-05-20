init_am_directive.init_icpc2_test3 = function($scope, $http){
	console.log('-----init_icpc2_test3-----------------');

	$scope.getColValue=function(row,col_key){
		if(row[col_key]){
			if('col_9775|col_9776'.indexOf(col_key)>=0)
				return row[col_key]+':'+$scope.col_values[col_key][row[col_key]]
			else
				return row[col_key]
		}
	}

	$scope.col_values={
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
	}
	
	$scope.f74_physician_id = 183;
	
	var init_ngClick = function(icpc2_nakaz74){
		icpc2_nakaz74.clickToSave={}
		icpc2_nakaz74.clickToSave.add_row=function(){
			var r0 = icpc2_nakaz74.data.list[0]
			console.log(r0)
			if($scope.physicianData)
				$scope.f74_physician_id = $scope.physicianData.person_id;
			var data={
				sql:'sql2.j2c.insertRow2',
				tbl_id:r0.tbl_id,
				reference2:$scope.f74_physician_id,
			}
			console.log(data);
			$http.post('/r/update2_sql_with_param', data).then(function(response) {
				console.log(response.data);
				response.data.row_id = response.data.nextDbId1
				console.log(response.data.nextDbId1);
				icpc2_nakaz74.data.list.unshift(response.data);
				icpc2_nakaz74.selectedCell = {row_k:0, row_id:response.data.row_id}
			});
		}
		icpc2_nakaz74.clickToSave.col_10766=function(row){//Patient
			console.log(row)
			var data={
				reference2:row.row_id,
				cell_value : row.col_9766+', '+row.col_9767
			}
			icpc2_nakaz74.clickToSave.ref2Cell(data, 
				'sql2.j2c.insertCellWithConstraint|sql2.j2c.updateCellWithConstraint')
		}

		icpc2_nakaz74.clickToSave.col_10771=function(row){//ICPC2
			var data={
				reference2:row.doc_id,
				cell_value : row.code+':'+row.value
			}
			icpc2_nakaz74.clickToSave.ref2Cell(data, 
				'sql2.j2c.insertCellWithConstraint|sql2.j2c.updateCellWithConstraint')
		}
		icpc2_nakaz74.clickToSave.ref2Cell=function(data, sqlInsertUpdate){
			console.log(data)

			var editObj = icpc2_nakaz74.data.list[icpc2_nakaz74.selectedCell.row_k]
			var cell_id = editObj[icpc2_nakaz74.selectedCell.col_k+'_id']
			if(cell_id){
				data.sql = sqlInsertUpdate.split('|')[1]
					data.doc_id = cell_id 
					$http.post('/r/update2_sql_with_param', data).then(function(response) {
						editObj[icpc2_nakaz74.selectedCell.col_k+'_id'] = data.reference2 // cell_id
						editObj[icpc2_nakaz74.selectedCell.col_k] = data.cell_value
						delete icpc2_nakaz74.selectedCell.col_k
					});
			}else{ // insert
				data.sql = sqlInsertUpdate.split('|')[0]
					data.parent_id = editObj.row_id
					var col_id = icpc2_nakaz74.selectedCell.col_k.split('_')[1] 
				data.reference = col_id
				$http.post('/r/update2_sql_with_param', data).then(function(response) {
					editObj[icpc2_nakaz74.selectedCell.col_k+'_id'] = response.data.nextDbId1 // cell_id
					editObj[icpc2_nakaz74.selectedCell.col_k] = data.cell_value
					delete icpc2_nakaz74.selectedCell.col_k
				});
			}
		}


		icpc2_nakaz74.col_save=function(value,row,col_k){
			var data={ value:value }
			if(row[col_k+'_id']){
				data.sql='sql2.integer.updateCellById';
				data.data_id=row[col_k+'_id'];
				$http.post('/r/update2_sql_with_param', data).then(function(response) {
					row[col_k]=response.data.value
				});
			}else{
				data.sql='sql2.integer.insertCellId';
				data.row_id=row.row_id;
				var cln_id = col_k.split('_')[1]
				data.cln_id = cln_id;
				$http.post('/r/update2_sql_with_param', data).then(function(response) {
					row[col_k+'_id'] = response.data.nextDbId1;
					row[col_k]=response.data.value
				});
			}
		}

		icpc2_nakaz74.isCellSelect=function(row_k, col_k, row){
			if(icpc2_nakaz74.selectedCell && !icpc2_nakaz74.selectedCell.close){
				if(icpc2_nakaz74.selectedCell.row_id==row.row_id)
					return icpc2_nakaz74.selectedCell.row_k==row_k 
						&& icpc2_nakaz74.selectedCell.col_k==col_k
//				if( icpc2_nakaz74.selectedCell.row_k==row_k 
//						&& icpc2_nakaz74.selectedCell.col_k==col_k){
//					return icpc2_nakaz74.selectedCell.row_id==row.row_id				}
			}
		}
		icpc2_nakaz74.closeDropdown=function(){
			if(icpc2_nakaz74.selectedCell)
				icpc2_nakaz74.selectedCell.close=true;
		}
		icpc2_nakaz74.selectCell=function(row_k, col_k){
			if(icpc2_nakaz74.selectedCell 
				&& icpc2_nakaz74.selectedCell.col_k==col_k 
				&& icpc2_nakaz74.selectedCell.row_k==row_k)
			{
				if('col_10766|col_10771'.indexOf(col_k)>=0){
					if(icpc2_nakaz74.selectedCell.close)
						delete icpc2_nakaz74.selectedCell
				}else{
					delete icpc2_nakaz74.selectedCell
				}
			}else{
				var row = icpc2_nakaz74.data.list[row_k];
				icpc2_nakaz74.selectedCell={row_k:row_k, col_k:col_k, row_id:row.row_id}
			}
		}
	}
	
	$scope.icpc2_nakaz74={}
	$scope.icpc2_nakaz74.col_sort = ['col_10766','col_9775', 'col_10771','col_9776']
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

	init2_read_f74_tables($scope, $http);

	$scope.dropdown_data = {
		ask_confirm_delete:{display:'none'},
		deleteRow:function(){
			console.log($scope.icpc2_nakaz74.selectedCell)
			var row = $scope.icpc2_nakaz74.data.list[$scope.icpc2_nakaz74.selectedCell.row_k]
			console.log(row)
			var data={
				sql:'sql2.j2c.deleteRowId2',
				row_id:row.row_id,
			}
			console.log(data);
			$http.post('/r/update2_sql_with_param', data).then(function(response) {
				console.log(response.data)
				$scope.icpc2_nakaz74.data.list.splice($scope.icpc2_nakaz74.selectedCell.row_k, 1)
				$scope.dropdown_data.ask_confirm_delete = {display:'none'}
			});
		},
		ngStyleAskDelete:function(){
			if($scope.icpc2_nakaz74.selectedCell)
				if($scope.icpc2_nakaz74.selectedCell.row_k>=0)
					this.ask_confirm_delete={display:'block'}
		},
		ngStyle:function(col_k){
			var style={}
			if('col_10771'==col_k){
				style.left='-250px';
			}
			return style;
		},
		seek:{},
		seek_placeholder:{
			col_10766:'знайти Пацієнта',
			col_10771:'знайти ICPC2'
		},
	};

	$scope.$watch('dropdown_data.seek.col_10766',function(seek){if(seek){
		console.log(seek)
		fn_lib.read_data_col_10766()
	}})

	fn_lib.read_data_col_10766=function(){ // Пацієнт
		console.log('--------read----dropdown--Пацієнт-------')
		var url = '/r/read2_sql_with_param'
		var params={seekPatient:'%%'}
		if($scope.dropdown_data.seek.col_10766){
			params.seekPatient = '%'+$scope.dropdown_data.seek.col_10766+'%'
		}
		params.sql='sql2.table.select_seekPatient'
		params.table_id=9765
		$http.get(url, {params:params}).then(function(response) {
			$scope.dropdown_data.list=response.data.list
			$scope.dropdown_data.col_keys=response.data.col_keys
			console.log($scope.dropdown_data)
		})
	}

	$scope.$watch('dropdown_data.seek.col_10771',function(seekIcpc2){if(seekIcpc2){
		console.log(seekIcpc2)
		fn_lib.read_data_col_10771()
	}})

	fn_lib.read_data_col_10771=function(){ // ICPC2
		console.log('--------read----dropdown--ICPC2-------')
		var params={seek:'%%'}
		if($scope.dropdown_data.seek.col_10771)
			params.seek = '%'+$scope.dropdown_data.seek.col_10771+'%'
		params.sql = sql2['f74_icpc2_seek__select']();
		params.sql = spaceClean(params.sql)
//		console.log(params)
		$http.get(url_sql_read,{params:params}).then(function(response) {
//			console.log(response.data)
			$scope.dropdown_data.list=response.data.list
			//if(!$scope.dropdown_data.seekIcpc2)
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

	$scope.table.rows = [1,2,3,4];
	init_ngClick($scope.table)

}
