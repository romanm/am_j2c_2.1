amProgram = 
{
	db_design:{
		folder:{
			folder_name:'sts_j2c_01',
			folder_id:46,
			table_02:{
				table_name:'drug_list_01',
				table_id:48,
				columns:{
					in_name:{fieldname:'препарат',fieldtype:'varchar',column_id:51,valueTableName:'string'},
					trade_name:{fieldname:'медикамент',fieldtype:'varchar',column_id:52,valueTableName:'string'},
				},
				rows:[
					{row_id:64, in_name:'acetylsalicylic acid', in_name_id:78},
					{row_id:65, in_name:'heparin', in_name_id:78},
				],
			},
			table_03:{
				table_name:'старша.с_відділення_01',
				table_id:53,
				columns:{
					pip:{fieldname:'ПІП',fieldtype:'varchar',column_id:56,valueTableName:'string'},
					department:{fieldname:'відділення',fieldtype:'varchar',column_id:57,valueTableName:'string'},
				},
				r1ows:[
					{pip:'Наташа',department:'детоксикація'},
					{pip:'Ліля',department:'реанімація'},
					{pip:'Олічка',department:'кардіо операційна'},
				],
			},
			table_01:{
				table_name:'drug_sts_ruh_01',
				table_id:47,
			},
		},
		fn1:function(){return 1+1;},
	}
}
