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
	
	$scope.progr_am.viewes.j2c_table.heightProcent = 90
	console.log($scope.progr_am.viewes)
	
	
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
			include_table_menu:'/f/eh2/table_menu.html',
			col_sort:['creat_date', 'col_10766','col_9775'
				, 'col_10771', 'col_11327', 'col_10777','col_10807'
				,'col_9776'],
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

		icpc2_nakaz74.clickToSave.col_10807=function(row){//ICPC2 process
			var data={
				reference2:row.doc_id,
				cell_value : row.code+':'+row.value
			}
			icpc2_nakaz74.clickToSave.ref2Cell(data, 
				'sql2.j2c.insertCellWithConstraint|sql2.j2c.updateCellWithConstraint')
		}

		icpc2_nakaz74.clickToSave.col_10771=function(row){//ICPC2 symptom
			var data={
				reference2:row.doc_id,
				cell_value : row.code+':'+row.value
			}
			icpc2_nakaz74.clickToSave.ref2Cell(data, 
				'sql2.j2c.insertCellWithConstraint|sql2.j2c.updateCellWithConstraint')
		}
		icpc2_nakaz74.clickToSave.col_11327=function(row){//ICPC2 diagnose
			console.log(row)
			var data={
				reference2:row.doc_id,
				cell_value : row.code+':'+row.value
			}
			icpc2_nakaz74.clickToSave.ref2Cell(data, 
			'sql2.j2c.insertCellWithConstraint|sql2.j2c.updateCellWithConstraint')
		}
		icpc2_nakaz74.clickToSave.col_10777=function(row){//ICD10 diagnose
			console.log(row)
			var data={
				reference2:row.doc_id,
				cell_value : row.icd_code+':'+row.icd_name
			}
			icpc2_nakaz74.clickToSave.ref2Cell(data, 
			'sql2.j2c.insertCellWithConstraint|sql2.j2c.updateCellWithConstraint')
		}
	}


	var url_read2_sql_with_param = '/r/read2_sql_with_param'

	$scope.$watch('dropdown_data.seek.col_10777',function(seekIcpc2, oldSeekIcpc2){
		seekJ2C_table(seekIcpc2, oldSeekIcpc2, 'col_10777')
	})
	$scope.$watch('dropdown_data.seek.col_10807',function(seekIcpc2, oldSeekIcpc2){// ICPC2 process
		seekJ2C_table(seekIcpc2, oldSeekIcpc2, 'col_10807')
	})
	$scope.$watch('dropdown_data.seek.col_10771',function(seekIcpc2, oldSeekIcpc2){// ICPC2 symptom
		seekJ2C_table(seekIcpc2, oldSeekIcpc2, 'col_10771')
	})
	$scope.$watch('dropdown_data.seek.col_11327',function(seekIcpc2, oldSeekIcpc2){// ICPC2 symptom
		seekJ2C_table(seekIcpc2, oldSeekIcpc2, 'col_11327')
	})
	var seekJ2C_table = function(seekIcpc2, oldSeekIcpc2, col_key){
		console.log(seekIcpc2)
		if(seekIcpc2||oldSeekIcpc2)
			fn_lib['read_data_'+col_key]()
	}
	

	fn_lib.read_data_col_10807 = function(){ // ICPC2 process
		console.log('--------read----dropdown--ICPC2-------')
		fn_lib.read_data_ICPC2(
			'f74_icpc2_seekProcess__select',
			$scope.dropdown_data.seek.col_10807
		)
	}
	fn_lib.read_data_col_10771 = function(){ // ICPC2
		console.log('--------read----dropdown--ICPC2-------')
		fn_lib.read_data_ICPC2(
			'f74_icpc2_seekSymptom__select',
			$scope.dropdown_data.seek.col_10771
		)
	}
	fn_lib.read_data_col_11327 = function(){ // ICPC2 diagnose
		console.log('--------read----dropdown--ICPC2-------')
		fn_lib.read_data_ICPC2(
			'f74_icpc2_seekDiagnose__select',
			$scope.dropdown_data.seek.col_11327
		)
	}
	fn_lib.read_data_col_10777 = function(){ // ICD10 diagnose
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

	fn_lib.read_data_ICPC2 = function(sql, seek){ // ICPC2
		var params={seek:'%%'}
		if(seek)
			params.seek = '%'+seek+'%'
		params.sql = sql3[sql]();
		params.sql = composeSql(params.sql)
		console.log(params.sql)
		params.sql = spaceClean(params.sql)
//		console.log(params)
		$http.get(url_sql_read,{params:params}).then(function(response) {
//			console.log(response.data)
			$scope.dropdown_data.list=response.data.list
			//if(!$scope.dropdown_data.seekIcpc2)
			$scope.dropdown_data.col_keys={
					code:'Код',
					value:'Назва',
			}
//			doc_id:'ІН',
//			doctype:'zГрупа',
//			part:'Група',
			console.log($scope.dropdown_data)
		})
	}
	$scope.include.copyright = '/f/eh2/abk1/copyright_icpc2.html'
}
