var app = angular.module('app', ['ngSanitize', 'ngRoute']);
var fn_lib = {};
var init_am_directive = {};
var exe_fn
app.controller('ControllerApp1', function($scope, $http, $filter, $route) {
	$scope.data={}
	$scope.progr_am={fn:{}}
	console.log($scope)
	console.log($scope.data)
	
	init_am_directive.init_programRuns($scope, $http, $filter, $route);
});

init_am_directive.init_programRuns=function($scope, $http, $filter, $route){
	exe_fn = new Exe_fn($scope, $http)
	onLoadPage($scope);
	if(init_am_directive['init_'+request.viewKey])
		init_am_directive['init_'+request.viewKey]($scope, $http, $filter, $route);
	$http.get('/r/principal').then(function(response) {
		$scope.principalResponse = true;
		$scope.principal = response.data;
		$scope.principalUser = response.data.user;

		if($scope.principal.principal){
			$scope.principal.principal.authorities.forEach(function(v){
				if(v.authority=='ROLE_PATIENT'){
					$scope.hasRolePatient=true;
				}
			})
		}
	});
	
	$scope.highlight = function(text, search){
		if(!text) return
		if (!search) return text;
		return (''+text).replace(new RegExp(search, 'gi'), '<span class="w3-yellow">$&</span>');
	}

}

var Exe_fn = function($scope, $http){
	this.calcJSON_CRC32=function(jsonObj){
		return CRC32(JSON.stringify(jsonObj))
	}
	this.httpPost=function(progr_am){
		$http.post(progr_am.url, progr_am.data)
		.then(progr_am.then_fn)
	}
	this.httpGet=function(progr_am){
		$http.get(progr_am.url, {params:progr_am.params})
		.then(progr_am.then_fn)
	}
	this.run_progr_am=function(){
		var exe_fn = this;
		if($scope.progr_am.fn)
			if($scope.progr_am.fn.init_onLoad)
				$scope.progr_am.fn.init_onLoad()

		angular.forEach($scope.progr_am, function(v, k){
			if('viewes|fn'.indexOf(k)>=0){}else
			{
				console.log('---Exe_fn.run_progr_am--- ' + k)
				if(!$scope[k])
					$scope[k] = $scope.progr_am[k] //{}
				$scope.data[k]=$scope[k]
//				$scope.data[k].fn=$scope.progr_am[k].fn

				angular.forEach(v, function(v1, k1){
					if(exe_fn[k1])
						exe_fn[k1](v1)
					else 
					if('init_data'==k1){
						angular.forEach(v1, function(v2, k2){
							$scope[k][k2] = v2
						})

						//if(!$scope[k].fn)
						// $scope[k].fn={}

						/*
						$scope[k].fn.row_key=v1.row_key
						$scope[k].fn.isEditRow = function(row){
							return this.row_key
							&& row[this.row_key]
								== $scope.request.parameters[this.row_key]
						}
						 * */
					}
				})
			}
		});
	}

}

function import_js_file(fileName, $http){
	$http.get(fileName).then(function(response) {
		var load_amProgram = response.data; 
		eval(load_amProgram);
	});
}

function onLoadPage($scope){
	$scope.request={};
	request = $scope.request
	request.parameters={};
//	console.log(window.location);

	$scope.urlFragment=function(){
		var urlFragmentSplit = window.location.href.split('#')
		var urlFragment = urlFragmentSplit[urlFragmentSplit.length-1];
		return urlFragment;
	}
	
	if(window.location.search.split('?')[1]){
		angular.forEach(window.location.search.split('?')[1].split('&'), function(value, index){
			var par = value.split("=");
			request.parameters[par[0]] = par[1];
		});
	}
	request.viewKey = window.location.pathname.split('/v/')[1];
	if(!request.viewKey){
		var splitHtml = window.location.pathname.split('.')
		if('html'==splitHtml[1]){
			var x = splitHtml[0].split('/')
			request.viewKey = x[x.length-1];
		}
		if(!request.viewKey){
			request.viewKey='index';
		}
	}
}

init_am_directive.initObj_registry= function($scope, $http){
	$scope.registry={data:{},error:{}};

	$scope.registry.saveRegistrySql=function(){
		var isToSave = true;
		if(!this.data.birth_date){
			if(!this.data.bd){
				isToSave = false;
				this.error.birth_date='Дата народження обов´язкова'
			}else{
				delete this.error.birth_date
				console.log(this.data.birth_date1)
				console.log(this.data.bd)
//				this.data.birth_date = this.data.bd.toISOString().replace('T',' ').replace('Z','')
				this.data.birth_date = this.data.bd.toISOString().split('T')[0]
				console.log(this.data.birth_date)
			}

		}
		if(!this.data.email){
			isToSave = false;
			this.error.email='Введіть ваш eMail. Після успішної реєстрації вам буде вислано лист для активації входу в систему.'
		}
		if(isToSave){
			this.data.password = '{noop}'+this.data.password1;
			var thisData = this.data;
			['family_name', 'first_name', 'second_name'].forEach(function(v){
				console.log(v)
				if(!thisData[v]) 
					thisData[v]=''
			})
			$http.post('/r/update2_sql_with_param', this.data).then(function(response) {
				console.log(response.data);
				console.log('send mail to new user for activate login');
				$http.post('/r/send_eMail', response.data).then(function(response) {
					console.log(response.data);
				});
			});
		}
	};
	
	$scope.registry.set_ddmmyyy_param_from_date=function(key, d1){
		var mm = d1.getMonth()+1;
		var ddmmyyyy = (d1.getDate()<10?'0':'')+d1.getDate()
			+'-'+(mm<10?'0':'')+mm+'-'+d1.getFullYear();
		this.data[key] = ddmmyyyy;
		this.data.bd = d1;
	}

	$scope.registry.dateControlle=function(key){
		var dateString = this.data[key];
		
		var d1 = new Date();
		var y = d1.getFullYear()-2000;
		var m = dateString.match(/([1-9]|1\d|2\d|3[01])([-|,|.| |\/]+)([1-9]|1[012]|0[1-9])([-|,|.| |\/]+)(19|20)(\d{2})/)
		if(m){
			y = m[5]*100+m[6]*1;
		}else{
			m = dateString.match(/([1-9]|1\d|2\d|3[01])([-|,|.| |\/]+)([1-9]|1[012]|0[1-9])([-|,|.| |\/]+)(\d{1,2})/)
			if(m){
				var y0 = m[5]*1;
				y = (y0>y?1900:2000) + y0
			}
		}
		console.log(m)
		if(m){
			d1.setMonth(m[3]*1-1);
			d1.setDate(m[1]);
			d1.setFullYear(y);
			$scope.registry.set_ddmmyyy_param_from_date(key, d1);
			delete this.error.birth_date;
		}else{
			this.error.birth_date='Введіть дату в форматі "день-місяць-рік", розділяючі символи між цифрами -/., або пробіл.';
		}
	}

}

Array.prototype.last = function(){
	return this[this.length - 1];
}
Object.prototype.isObjectNotArray = function(){
	return this.isObject()&&!this.isArray();
}
Object.prototype.isArray = function(){
	return Array.isArray(this);
};
Object.prototype.objKeys = function(){
	return Object.keys(this);
};
Object.prototype.isObject = function(){
	return (''+this).indexOf('Object')>=0;
};
Object.prototype.isEmpty = function() {
    for(var key in this) {
        if(this.hasOwnProperty(key))
            return false;
    }
    return true;
};
var procentWindowHeight=function(procent){
	return Math.floor(window.innerHeight*procent/100) 
}

//https://idtechproducts.com/how-to-calculate-lrc-checksum-and-crc/
var CRC32 = function(str){
    var CRCTable = [
    	0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA,
		0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3,
		0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988,
		0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91,
		0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE,
		0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
		0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC,
		0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5,
		0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172,
		0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B,
		0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940,
		0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59,
		0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116,
		0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F,
		0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924,
		0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D,
		0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A,
		0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
		0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818,
		0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01,
		0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E,
		0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457,
		0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C,
		0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65,
		0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2,
		0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB,
		0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0,
		0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9,
		0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086,
		0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
		0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4,
		0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD,
		0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A,
		0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683,
		0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8,
		0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1,
		0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE,
		0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7,
		0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC,
		0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5,
		0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252,
		0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B,
		0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60,
		0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79,
		0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236,
		0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F,
		0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04,
		0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D,
		0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A,
		0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713,
		0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38,
		0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21,
		0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E,
		0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777,
		0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C,
		0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45,
		0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2,
		0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB,
		0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0,
		0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
		0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6,
		0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF,
		0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94,
		0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D
	];
    var len = str.length;
    var r = 0xffffffff;
    for (var i = 0; i < len; i ++) {        
        r = (r >> 8) ^ CRCTable[str[i] ^ (r & 0x000000FF)];
    }
    return ~r;
}

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
