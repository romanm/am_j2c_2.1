init_am_directive.init_icpc2_test4 = function($scope, $http){
	console.log('-----init_icpc2_test4-----------------');
	init_am_directive.ehealth_declaration($scope, $http);
	$scope.include = {
		j2c_table_content:'/f/eh2/icpc2_test4/icpc2_cell_content_o74.html',
		icpc2_cell_dropdown_content:
			'/f/eh2/icpc2_test4/icpc2_cell_dropdown_content_o74.html',
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
			include_cols:'/f/eh2/icpc2_test4/icpc2_cell_content_o74.html',
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

		init_f74_ngClick(icpc2_nakaz74, $scope, $http);

		icpc2_nakaz74.selectCell=function(row_k, col_k){
			if(icpc2_nakaz74.selectedCell 
			&& icpc2_nakaz74.selectedCell.col_k==col_k 
			&& icpc2_nakaz74.selectedCell.row_k==row_k
			){
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

		icpc2_nakaz74.closeDropdown=function(){
			if(icpc2_nakaz74.selectedCell)
				icpc2_nakaz74.selectedCell.close=true;
		}

		icpc2_nakaz74.getColValue=function(row,col_key){
			if(row[col_key]){
				if('col_9775|col_9776|col_10900'.indexOf(col_key)>=0)
					return row[col_key]+':'
					+$scope.icpc2_nakaz74
					.col_values[col_key][row[col_key]]
				else
					return row[col_key]
			}
		}

		icpc2_nakaz74.clickToSave.col_save=function(value,row,col_k){
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

		icpc2_nakaz74.clickToSave.col_10766=function(row){//Patient
			console.log(row)
			var data={
				reference2:row.row_id,
				cell_value : row.col_9766+', '+row.col_9767
			}
			icpc2_nakaz74.clickToSave.ref2Cell(data, 
				'sql2.j2c.insertCellWithConstraint|sql2.j2c.updateCellWithConstraint')
		}

		icpc2_nakaz74.clickToSave.col_10777=function(row){//ICD10
			console.log(row)
			var data={
				reference2:row.doc_id,
				cell_value : row.icd_code+':'+row.icd_name
			}
			icpc2_nakaz74.clickToSave.ref2Cell(data, 
			'sql2.j2c.insertCellWithConstraint|sql2.j2c.updateCellWithConstraint')
		}

		icpc2_nakaz74.clickToSave.col_10807=function(row){//ICPC2 process
			var data={
				reference2:row.doc_id,
				cell_value : row.code+':'+row.value
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

	}

	$scope.$watch('dropdown_data.seek.col_10777',function(seek){if(seek){
		console.log(seek)
		fn_lib.read_data_col_10777()
	}})

	var url_read2_sql_with_param = '/r/read2_sql_with_param'
	fn_lib.read_data_col_10766=function(){ // Пацієнт
		console.log('--------read----dropdown--Пацієнт-------')
		var params={seekPatient:'%%'}
		if($scope.dropdown_data.seek.col_10766){
			params.seekPatient = '%'+$scope.dropdown_data.seek.col_10766+'%'
		}
		params.sql='sql2.table.select_seekPatient'
		params.table_id=9765
		$http.get(url_read2_sql_with_param, {params:params}).then(function(response) {
			$scope.dropdown_data.list=response.data.list
			$scope.dropdown_data.col_keys=response.data.col_keys
			console.log($scope.dropdown_data)
		})
	}
	fn_lib.read_data_col_10777=function(){ // ICD10
		console.log('--------read----dropdown--ICD10-------')
		var params={seek:'%%',doctype: 89}
		if($scope.dropdown_data.seek.col_10777)
			params.seek = '%'+$scope.dropdown_data.seek.col_10777+'%'
		params.sql='sql2.icd10.seek'
		console.log(params)
		$http.get(url_read2_sql_with_param, {params:params}).then(function(response) {
			$scope.dropdown_data.list=response.data.list
			$scope.dropdown_data.col_keys={
				icd_code:'Код',
				icd_name:'Назва',
			}
			console.log($scope.dropdown_data)
		})
	}

	$scope.$watch('dropdown_data.seek.col_10766',function(seek){if(seek){
		console.log(seek)
		fn_lib.read_data_col_10766()
	}})

	$scope.$watch('dropdown_data.seek.col_10771',function(seekIcpc2){if(seekIcpc2){ // ICPC2
		console.log(seekIcpc2)
		fn_lib.read_data_col_10771()
	}})

	fn_lib.read_data_col_10771=function(){ // ICPC2
		console.log('--------read----dropdown--ICPC2-------')
		fn_lib.read_data_ICPC2(
			'f74_icpc2_seek3__select',
			$scope.dropdown_data.seek.col_10771
		)
	}
	
	$scope.$watch('progr_am.icpc2_nakaz74.selectedCell.col_k',function(col_k){if(col_k){
		console.log(col_k)
		if(fn_lib['read_data_'+col_k])
			fn_lib['read_data_'+col_k]()
	}})

	fn_lib.read_data_ICPC2=function(sql, seek){ // ICPC2
		var params={seek:'%%'}
		if(seek)
			params.seek = '%'+seek+'%'
		params.sql = sql3[sql]();
		params.sql = composeSql(params.sql)
//		console.log(params.sql)
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

	$scope.dropdown_data = {
		ask_confirm_delete:{display:'none'},
		deleteRow:function(){
			var selectedCell =$scope.progr_am.icpc2_nakaz74.selectedCell; 
			console.log(selectedCell)
			var row = $scope.icpc2_nakaz74.data.list[selectedCell.row_k]
			console.log(row)
			var data={
				sql:'sql2.j2c.deleteRowId2',
				row_id:row.row_id,
			}
			console.log(data);
			$http.post('/r/update2_sql_with_param', data).then(function(response) {
				console.log(response.data)
				$scope.icpc2_nakaz74.data.list.splice(selectedCell.row_k, 1)
				$scope.dropdown_data.ask_confirm_delete = {display:'none'}
			});
		},
		ngStyleAskDelete:function(){
			console.log($scope.progr_am.icpc2_nakaz74)
			console.log($scope.progr_am.icpc2_nakaz74.selectedCell)

			if($scope.progr_am.icpc2_nakaz74.selectedCell)
				if($scope.progr_am.icpc2_nakaz74.selectedCell.row_k>=0)
					this.ask_confirm_delete={display:'block'}
		},
		ngStyle:function(col_k){
			var style={}
			if('col_10777'==col_k){
				style.left='-150px';
				style['min-width']='450px';
			}else if('col_10766'==col_k){
				style['min-width']='400px';
			}else if('col_10807'==col_k){
				style.left='-150px';
			}else if('col_10900'==col_k){
				style.left='-90px';
			}else if('col_10771'==col_k){
				style.left='-150px';
			}
			return style;
		},
		seek:{},
		seek_placeholder:{
			col_10766:'знайти Пацієнта',
			col_10777:'знайти МКХ10',
			col_10771:'знайти ICPC2',
			col_10807:'знайти процес ICPC2',
		},
	};

}
