//the code for request this group of pages or her app_config.page_head_tabs
console.log('-----physician.js--------');
init_am_directive.init_onload.physician=function($scope, $http){
	console.log('-------init_am_directive.init_onload.physician--------');
	$scope.page.head.headClass='l3 m3 s3';
	$scope.page.head.headClass2='l9 m9 s9';
	console.log($scope.page)
	console.log($scope.page.request.parameters.tab)
}


init_am_directive.init_onload.ph_declaration=function($scope, $http){
	console.log('-------init_am_directive.init_onload.ph_declaration--------');
	$scope.programRun = {
		ph_declaration:{
			programFile:{
					html_form_type01:{ source_path:'/f/eh1/employee1/employee2_form.html',
						init:function(ele, v){
							console.log('----57------html_form_type01------');
							init_am_directive.ele_v.html_form_type01(ele, v);
					}},
			},
			gui:{
				init:function(){
					if(!$scope.page.request.parameters.tab)
						$scope.page.request.parameters.tab='declaration_form';
				},
				tabs:{
					declaration_data:{name:'🗟 дані'},
//					employee_template:{name:'🗟 дані працівник'},
					declaration_form:{name:'декларація'},
					print:{name:'🖶 друк'},
				}
			}
		},
		declaration_data:{
			programFile:{
				TablesJ2C:{param:{url:'/f/mvp/patient_template.json'}},
			}
		},
	}
	run_am_program($scope.programRun.declaration_data, $scope, $http);
	fn_lib.addProgram($scope.programRun, ['eh_dictionaries']);
	run_am_program($scope.programRun.eh_dictionaries, $scope, $http);

}

init_am_directive.init_onload.ph_calendar=function($scope){
	console.log('-------init_am_directive.init_onload.ph_calendar--------');
	$scope.basicCalendar = {
			dayPart:{
				list:['day','week','month','4day','termin']
				,itemNames_ua:['День','Неділя','Місяць','4 дні','Терміни']
				,item:'day'
			}
			,hoursOfWork:[]
			,daysOfWeek:[0,1,2,3,4,5,6]
			,monthWeek:[0,1,2,3,4]
			,todayDate:new Date()
			,getDateWithHour:function(h){
				return new Date(1,1,1,h)
			}
			,isToday:function(dt){
				var d = new Date(dt)
				return true
					&& d.getDate()==this.todayDate.getDate()
					&& d.getMonth()==this.todayDate.getMonth()
					&& d.getFullYear()==this.todayDate.getFullYear()
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
				if(!d) d = this.todayDate;
				return new Date(d.getFullYear(),d.getMonth(),1);
			}
			,init:function(){
				for (var i = 7; i < 24; i++) {
					this.hoursOfWork.push(i);
				}
			}
		};
	$scope.basicCalendar.todayTime = $scope.basicCalendar.todayDate.getTime();
	$scope.basicCalendar.init();

	console.log($scope.basicCalendar);
};
