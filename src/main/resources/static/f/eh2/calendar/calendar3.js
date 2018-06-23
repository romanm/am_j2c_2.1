
init_am_directive.init_physician_calendar = function($scope, $http, $filter, $route){
	console.log('------init_physician_calendar---2--------------')
	init_am_directive.init_registry_calendar($scope, $http, $filter)
}

init_am_directive.init_registry_calendar = function($scope, $http, $filter, $route){
	console.log('------init_registry_calendar---7--------------')
	init_am_directive.ehealth_declaration($scope, $http);
	$scope.basicCalendar = new BasicCalendar($scope, $http, $filter)
	$scope.progr_am.basicCalendar= $scope.basicCalendar
	$scope.basicCalendar.gui.init();
	$scope.include = {
		topbar_page_group:'/f/eh2/calendar/calendar3_top_page.html',
		registry_calendar_data:'/f/eh2/calendar/calendar3_registry_data.html',
		calendar_dialog:'/f/eh2/calendar/calendar3_dialog.html',
		j2c_table_content:'/f/eh2/calendar/calendar_j2c_table_content.html',
		icpc2_cell_dropdown_content:
			'/f/eh2/icpc2_test4/icpc2_cell_dropdown_content_o74.html',
	}
	$scope.progr_am.viewes={
		calendar:{
			//ngInclude:,
			dataName:'basicCalendar',
			heightProcent:65,
			setNgInclude:function(calendarViewPart){
				this.ngInclude = 
				'/f/eh2/calendar/calendar3_'+ calendarViewPart +'.html'	
			}
		},
		menu:{ngInclude:'/f/eh1/info2/hrm_cards/hrm_menu.html',
			seek:null,
		},
		j2c_table:{ngInclude:'/f/eh2/j2c_table.html',
			dataName:'icpc2_nakaz74',
			heightProcent:22,
		},
	},
	$scope.progr_am.viewes.calendar.setNgInclude(
		$scope.basicCalendar.gui.calendarViewPart.item		
	)


/*
	$scope.$watch('basicCalendar.gui.calendarViewPart.item',function(newValue, oldValue){
		console.log(newValue+' changed '+oldValue)
	})
*/
	
	$scope.$watch('basicCalendar.gui.workTimeStamp',function(newValue, oldValue){
		if(newValue && newValue.getTime()!=oldValue.getTime()){
			console.log(newValue+' changed '+oldValue)
		}
	});
	$scope.basicCalendar.gui.editDialogOpen = false
	
	$scope.progr_am.icpc2_nakaz74={
		httpGet:{
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
				angular.forEach($scope.icpc2_nakaz74.data.list,function(v){
					var mapDateKey = $filter('date')(v.created, 'shortDate'),
						h = $filter('date')(v.created, 'H')
					if(!$scope.icpc2_nakaz74.mapDate[mapDateKey])
						$scope.icpc2_nakaz74.mapDate[mapDateKey]= {list:[],hours:{}}
					var mapDateValue = $scope.icpc2_nakaz74.mapDate[mapDateKey]
					mapDateValue.list.push(v)
					if(!mapDateValue.hours[h])
						mapDateValue.hours[h] = []
					mapDateValue.hours[h].push(v)
				})
				console.log($scope.icpc2_nakaz74.mapDate)
				$scope.progr_am.icpc2_nakaz74.data
					= $scope.icpc2_nakaz74.data
				init_ngClick($scope.progr_am.icpc2_nakaz74)
			}
		},
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
			i1nclude_cols:'/f/eh1/info1/test3/icpc2_test3_cols.html',
			col_sort:['creat_date', 'col_10766', 'col_9775', 'col_10771', 'col_10777', 'col_10807'
				,'col_9776', 'col_10900'],
		},
	}

	var init_ngClick = function(icpc2_nakaz74){
		init_f74_ngClick(icpc2_nakaz74, $scope, $http);

	}

	//exe_fn.)
	$scope.progr_am.icpc2_nakaz74.s1electCell=function(row_k, col_k){
		$scope.editRow = $scope.icpc2_nakaz74.data.list[row_k];
		console.log($scope.editRow)
	}

}

var BasicCalendar = function($scope, $http, $filter){
	this.record = {
		newRecordMinutes:null,
		setNewRecordMinutes:function(){
			if(Number.isInteger(this.newRecordMinutes))
				this.parent.gui.workTimeStamp.setMinutes(this.newRecordMinutes)
		},
		isEditRecord:function(row, icpc2_nakaz74){
			return icpc2_nakaz74.isEditRow(row)
		},
		parent:this,
	}
	this.edit_dialog = {
		parent:this,
		save_record_timestamp:function(icpc2_nakaz74){
			console.log('--------save_record_timestamp-----------')
			var data = {
				sql:sql2.sql2_created_update(), 
				created:$scope.basicCalendar.gui.workTimeStamp.toISOString(), 
				doctimestamp_id:icpc2_nakaz74.selectedCell.row_id,
			}

			exe_fn.httpPost
			({	url:'/r/url_sql_update2',
				then_fn:function(response) {
//					icpc2_nakaz74.selectedCell.row.created = $scope.basicCalendar.gui.workTimeStamp
					location.reload();
				},
				data:data,
			})

		},
		open_record_dialog:function(row, icpc2_nakaz74){
			if(!icpc2_nakaz74.selectedCell)
				icpc2_nakaz74.selectedCell = {}
			icpc2_nakaz74.selectedCell.row_id = row.row_id
			icpc2_nakaz74.selectedCell.row = row
			this.selectedCell.dialog_type = 'record'
			console.log(this.selectedCell)
			console.log(this.parent.gui.workTimeStamp)

			var d = new Date(this.parent.gui.workTimeStamp)
			console.log(d)

			var mm = d.getMinutes() //$filter('date')(this.selectedCell.workTimeStamp, 'm')
			console.log(mm)
			this.parent.record.newRecordMinutes = mm
			console.log(this.parent.record)
		},
		isSelectedCellDialogOpen:function(wd, h){
			if(this.selectedCell.selectedCellDialogClose<0) return false
			if('week'==this.parent.gui.calendarViewPart.item){
				return this.parent.gui.isWorkTimeStampDayHour(wd, h)
			}
			return false
		},
		closeDropdown:function(){
			console.log(this.selectedCell)
			if(this.selectedCell)
				this.selectedCell.selectedCellDialogClose=-2;
		},
		selectedCell:{
			selectedCellDialogClose:-1,
		},
		selectCell:{
			parent:this,
			month:function(w, d){
			},
			week:function(wd, h){
				this.parent.edit_dialog.selectedCell.wd=wd
				this.parent.edit_dialog.selectedCell.h=h
				this.parent.gui.setWorkTimeStampDayHour(wd,h)
//				console.log(this.parent.edit_dialog.selectedCell.selectedCellDialogClose)
				this.parent.edit_dialog.selectedCell.selectedCellDialogClose++;
			},
			day:function(){
			},
		},
	}
	this.gui = {
		parent:this,
		calendarViewPart:{
			list:['day','week','month','4day','termin'],
			item:'week',
			itemNames_ua:['День','Неділя','Місяць','4 дні','Терміни'],
			weekDay_uaEEE:['пн','вт','ср','чт','пт','сб','нд'],
			setItem:function(calendarViewPart){
				this.item=calendarViewPart
				$scope.progr_am.viewes.calendar.setNgInclude(
					calendarViewPart		
				)
			},
		},
		hoursOfWork:[],
		daysOfWeek:[0,1,2,3,4,5,6],
		monthWeek:[0,1,2,3,4],
		workTimeStamp:null,
		todayDate:new Date(),
		isToday:function(d){
			var todayYear = this.todayDate.getYear(),
			todayDayOfMonth = this.todayDate.getDate(),
			todayMonthOfYear = this.todayDate.getMonth()
			
			if(
				todayYear == d.getYear() &&
				todayDayOfMonth == d.getDate() &&
				todayMonthOfYear == d.getMonth()
			)
				return true
		},
		goNext:function(){
			var d1 = new Date(this.workTimeStamp)
			if('month'==this.calendarViewPart.item)
				d1.setMonth(d1.getMonth()+1)
			else if('week'==this.calendarViewPart.item)
				d1.setDate(d1.getDate()+7)
			else if('day'==this.calendarViewPart.item)
				d1.setDate(d1.getDate()+1)
			this.workTimeStamp = d1

		},
		goPrevious:function(){
			var d1 = new Date(this.workTimeStamp)
			if('month'==this.calendarViewPart.item)
				d1.setMonth(d1.getMonth()-1)
			else if('week'==this.calendarViewPart.item)
				d1.setDate(d1.getDate()-7)
			else if('day'==this.calendarViewPart.item)
				d1.setDate(d1.getDate()-1)
			this.workTimeStamp = d1
		},
		goWeek:function(w){
			var newWeekOfYear = $filter('date')(this.dayOfMonthOfWeekMonth(w,1), 'ww'),
				oldWeekOfYear = $filter('date')(this.workTimeStamp, 'ww'),
				addDay = (newWeekOfYear-oldWeekOfYear)*7
			this.workTimeStamp.setDate(this.workTimeStamp.getDate()+addDay);
			this.calendarViewPart.setItem('week')
		},
		isWorkTimeStampHour:function(h){
			var hh = $filter('date')(this.workTimeStamp, 'H')
			return hh==h
		},
		isWorkTimeStampDayHour:function(wd, h){
			var isMyDay = this.isWorkTimeStampDay(wd)
			return this.isWorkTimeStampHour(h) && isMyDay
		},
		setWorkTimeStampDayHour:function(wd,h){
			var addDay = wd-this.workTimeStamp.getDay()+1
			var dd = this.workTimeStamp.getDate(),
				mm = this.workTimeStamp.getMonth(),
				hh = $filter('date')(this.workTimeStamp, 'H')
			this.workTimeStamp.setHours(h)
			this.workTimeStamp.setDate(
				this.workTimeStamp.getDate()
				+ addDay
			)
			this.parent.edit_dialog.selectedCell.workTimeStamp = this.workTimeStamp
//			console.log(this.parent.edit_dialog.selectedCell)
		},
		setWorkTimeStampDay:function(w, d){
			var d1 = this.getWorkTimeStampDay(w, d)
			var dd = this.workTimeStamp.getDate(),
				mm = this.workTimeStamp.getMonth()
			this.workTimeStamp.setMonth(d1.getMonth())
			this.workTimeStamp.setDate(d1.getDate())
		},
		isEditRecord:function(wd){
		},
		getWorkTimeStampWeekDay:function(wd){
			var d1 = new Date(this.workTimeStamp)
			d1.setDate(d1.getDate()+(wd-d1.getDay()+1))
			return d1
		},
		getWorkTimeStampDay:function(w, d){
			if('month'==this.calendarViewPart.item){
				var d1 = new Date(this.dayOfMonthOfWeekMonth(w,d))
			}else if('week'==this.calendarViewPart.item){
				var d1 = this.getWorkTimeStampWeekDay(w)
			}
			return d1
		},
		isLastMonthDay:function(w,d){
			var d1 = this.getWorkTimeStampDay(w, d)
			d1.setDate(d1.getDate()+1)
			return d1.getDate()
		},
		isWorkTimeStampMonth:function(w,d){
			var date = new Date(this.workTimeStamp)
			if('month'==this.calendarViewPart.item){
				date = new Date(this.dayOfMonthOfWeekMonth(w,d))
			}else if('week'==this.calendarViewPart.item){
				date = new Date(this.workTimeStampWeekDay(w))
			}
			var is = this.workTimeStamp.getMonth()==date.getMonth()
			return is
		},
		isWorkTimeStampDay:function(w,d){
			var date
			var is = false
			if('month'==this.calendarViewPart.item){
				date = new Date(this.dayOfMonthOfWeekMonth(w,d))
				is = this.workTimeStamp.getDate()==date.getDate()
				is = is && this.workTimeStamp.getMonth()==date.getMonth()
			}else if('week'==this.calendarViewPart.item){
				date = new Date(this.workTimeStampWeekDay(w))
				is = this.workTimeStamp.getDay()==date.getDay()
			}
			return is
		},
		isWorkTimeStampBeforeToday:function(){
			return this.todayDate.getTime()>this.workTimeStamp.getTime()
		},
		isToday:function(dt){
			var d = new Date(dt)
			return true
			&& d.getDate()==this.todayDate.getDate()
			&& d.getMonth()==this.todayDate.getMonth()
			&& d.getFullYear()==this.todayDate.getFullYear()
		},
		getDateWithHour:function(h){
			return new Date(1,1,1,h)
		},
		monthViewFirstDay:function(){
			var monthViewFirstDay = new Date(this.workTimeStamp)
			return monthViewFirstDay
		},
		workTimeStampWeekDayNr:function(){
			var wn = $filter('date')(this.workTimeStamp, 'EEE');
			return this.calendarViewPart.weekDay_uaEEE.indexOf(wn)
		},
		workTimeStampWeekDay:function(weekDay){
			var workTimeStampWeekDayNr = this.workTimeStampWeekDayNr()
			var workTimeStampWeekDay = new Date(this.workTimeStamp)
			workTimeStampWeekDay 
				= workTimeStampWeekDay.setDate(
					workTimeStampWeekDay.getDate() - workTimeStampWeekDayNr + weekDay);
			return workTimeStampWeekDay
		},
		dayOfMonthOfWeekMonth:function(w,d){
			var addDay = this.dayOfWeekMonth(w,d);
			var d1 = new Date(this.firstDateOfMonthFirstWeek());
			d1 = d1.setDate(d1.getDate() + addDay);
			return d1;
		}
		,dayOfWeekMonth:function(w,d){
			return w*this.daysOfWeek.last()+d+w;
		}
		,firstDateOfMonthFirstWeek:function(d){
			var d1 = this.firstDateOfMonth(d);
			d1 = d1.setDate(d1.getDate() - d1.getDay() + 1);
			return d1;
		}
		,firstDateOfMonth:function(d){
			if(!d) d = this.workTimeStamp;
			return new Date(d.getFullYear(),d.getMonth(),1);
		}
		,init:function(){
			this.workTimeStamp = new Date(this.todayDate)
			console.log($filter('date')(this.workTimeStamp, 'short'))
			for (var i = 7; i < 24; i++) {
				this.hoursOfWork.push(i);
			}
		}
	}
}
