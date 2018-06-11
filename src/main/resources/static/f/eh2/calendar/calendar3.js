
init_am_directive.init_physician_calendar = function($scope, $http, $filter){
	console.log('------init_physician_calendar---2--------------')
	init_am_directive.init_registry_calendar($scope, $http, $filter)
}

init_am_directive.init_registry_calendar = function($scope, $http, $filter){
	console.log('------init_registry_calendar---7--------------')
	init_am_directive.ehealth_declaration($scope, $http);
	$scope.basicCalendar = new BasicCalendar($scope, $http, $filter)
	//$scope.basicCalendar.gui.todayTime = $scope.basicCalendar.gui.todayDate.getTime();
	$scope.basicCalendar.gui.init();
	console.log($scope.basicCalendar)
	$scope.include = {
		topbar_page_group:'/f/eh2/calendar/calendar3_top_page.html',
	}
	$scope.basicCalendar.gui.editDialogOpen = false
	$scope.$watch('basicCalendar.gui.workTimeStamp',function(newValue, oldValue){
		if(newValue.getTime()!=oldValue.getTime()){
			console.log(newValue+' changed '+oldValue)
		}
	});
}

var BasicCalendar = function($scope, $http, $filter){
	this.gui = {
		calendarViewPart:{
			list:['day','week','month','4day','termin'],
			item:'month',
			itemNames_ua:['День','Неділя','Місяць','4 дні','Терміни'],
			weekDay_uaEEE:['пн','вт','ср','чт','пт','сб','нд'],
			setItem:function(calendarViewPart){
				this.item=calendarViewPart				
			},
		},
		hoursOfWork:[],
		daysOfWeek:[0,1,2,3,4,5,6],
		monthWeek:[0,1,2,3,4],
		todayDate:new Date(),
		workTimeStamp:null,
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
//			var wd = this.workTimeStamp.getDay()
//			var date = this.dayOfMonthOfWeekMonth(w,wd-1)
//			this.workTimeStamp = new Date(date)
//			this.workTimeStamp.setDate(this.workTimeStamp.getDate()-1);
			this.calendarViewPart.item = 'week'
		},
		setWorkTimeStampDayHour:function(wd,h){
			var d1 = new Date(this.workTimeStamp)
			d1.setDate(d1.getDate()+(wd-d1.getDay()+1))
			this.workTimeStamp = d1;
			this.workTimeStamp.setUTCHours(h)
			console.log(this.workTimeStamp)
			$scope.basicCalendar.gui.editDialogOpen
			=! $scope.basicCalendar.gui.editDialogOpen
			console.log($scope.basicCalendar.gui.editDialogOpen)
		},
		isWorkTimeStampHour:function(wd, h){
			return this.workTimeStamp.getUTCHours()==h
		},
		isWorkTimeStampDayHour:function(wd, h){
			
			var isMyDay = this.isWorkTimeStampDay(wd)
			return (this.workTimeStamp.getUTCHours()==h) && isMyDay
		},
		setWorkTimeStampDay:function(w, d){
			$scope.basicCalendar.gui.editDialogOpen
				=! $scope.basicCalendar.gui.editDialogOpen
			if('month'==this.calendarViewPart.item){
				var d1 = new Date(this.dayOfMonthOfWeekMonth(w,d))
//				this.workTimeStamp = d1;
			}else if('week'==this.calendarViewPart.item){
				var wd = w
				var d1 = new Date(this.workTimeStamp)
				d1.setDate(d1.getDate()+(wd-d1.getDay()+1))
//				this.workTimeStamp = d1;
			}
			this.workTimeStamp.setDate(d1.getDate())
			this.workTimeStamp.setMonth(d1.getMonth())
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
		}
		,dayOfMonthOfWeekMonth:function(w,d){
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
			//if(!d) d = this.todayDate;
			if(!d) d = this.workTimeStamp;
			return new Date(d.getFullYear(),d.getMonth(),1);
		}
		,init:function(){
			this.workTimeStamp = this.todayDate
			console.log($filter('date')(this.workTimeStamp, 'short'))
			for (var i = 7; i < 24; i++) {
				this.hoursOfWork.push(i);
			}
		}
	}
}
