var _SERVER = 'http://s.haiyaya.vip/index.php?g=Masseur&';

function request(path, data, callback){
	var token = get_local('openid');
	var versioncode = api.appVersion;
	var deviceid = api.deviceId;
	var os = api.systemType;
	var appid = api.appId;
	data.values.versioncode = 1;
	data.values.deviceid = get_osid();
	data.values.os = os;
	data.values.appid = appid;
	data.values.token = token;
    api.ajax({
        url: _SERVER + path,
        method: 'post',
        data: data
    }, function(respond, error) {
        if(!error &&  respond){
            if(-1 == respond.code){
				if(is_define(token)){
					tokenModel.set('');
					set_local('openid','');
					api.alert({
					    title: '',
					    msg: '您在其他地方登录，如非本人操作，请修改您的密码？',
					}, function(ret, err) {
						api.rebootApp();
					});
				}
            }
        }
        if(callback && 'function' == typeof callback){
            callback(respond, error)
        }
    });
}

//上传图片ajax
function request_file(path, data, callback){
	var tokenModel = new Token();
	var token="";
	token=tokenModel.get();
	data.values.token = token;
	var db = api.require('db');
	var path1 = "widget://res/city.d";
		if(api.systemType == 'ios')
		{
			path1 = "widget://res/city.d";
		}
		else
		{
			path1 = "fs://res/city.d";
		}
	var ret = db.openDatabaseSync({
	    name: 'city',
	    path:path1
	});

	var city = get_local('city_name');

	var row = db.selectSqlSync({
    	name: 'city',
    	sql: 'SELECT * FROM cool_region where region_type=2 AND region_name = "' + city + '"'
	});
	var city = 0;
	if(row.status && row.data.length){
		city = row.data[0].region_id;
	}

    var longitude=get_local("LON_KEY");
	var latitude=get_local("LAT_KEY");
	if(!is_define(data.values.longitude))
	{
		data.values.longitude = longitude;
	}
	if(!is_define(data.values.latitude))
	{
		data.values.latitude = latitude;
	}
	if(!is_define(data.values.city))
	{
		data.values.city = city;
	}
    api.ajax({
        url: _SERVER + path,
        method: 'post',
        data: data ,
        report:true,
    }, function(respond, error) {
        if(!error &&  respond){
            if(-1 == respond.code){
				if(is_define(token)){
					tokenModel.set('');
					set_local('openid','');
					api.alert({
					    title: '',
					    msg: '您在其他地方登录，如非本人操作，请修改您的密码？',
					}, function(ret, err) {
						api.rebootApp();
					});
				}
            }
        }
        if(callback && 'function' == typeof callback){
            callback(respond, error)
        }
    });
}
//全屏打开浮动窗口
function openFrameFull(url, pars, bgColor) {
	name = url.substring(url.lastIndexOf('/') + 1);
	url = url + ".html";
	if (!is_define(bgColor)) {
		bgColor = 'rgba(0,0,0,0.4)';
	}
	api.openFrame({
		name : name,
		url : url,
		pageParam : {
			pars : pars
		},
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : api.winHeight
		},
		bounces : false,
		bgColor : bgColor,
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		reload : false
	});
}
//广告跳转
function advert_goto(type,id,advert_id){
	if(type==1){
		open_url(id);
	}else if(type==2){
		open_w('info','../pub_html/info.html',{id:id});
	}else if(type==3){
		goto_good_detail(id);
	}else if(type==4){
		goto_shop_detail(id);
	}else if(type==5){
		eval(id);
	}else if(type==6){
		open_w('new_adv.html','widget://html/new_adv.html',{id:advert_id})
	}
}
//图片预览张
function imageBrowser(imgs, index) {
	if (!is_define(index)) {
		index = 0;
	}
	myimgs = imgs.split(",");
	var myimgs1 = [];
	for (var i = 0; i < myimgs.length; i++) {
		myimgs1.push(myimgs[i]);
	}
	var obj = api.require('imageBrowser');
	obj.openImages({
		imageUrls : myimgs1,
		showList : false,
		tapClose : false,
		activeIndex : index
	});
}
//时间戳格式化日期
function judge_date_time(time){
	// 例子，比如需要这样的格式：yyyy-MM-dd hh:mm:ss
	var times=time*1000;
	var date = new Date(times);
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D = date.getDate() + ' ';
	h = date.getHours() + ':';
	m = date.getMinutes() + ':';
	s = date.getSeconds();
	return (Y+M+D+h+m+s);
}
function locationServices(callback){
	 var bMap = api.require('bMap');
	 bMap.getLocationServices(function(ret, err) {
	    if (ret.enable) {
	       bMap.getLocation({
			    accuracy: '100m',
			    autoStop: true,
			    filter: 1
			}, function(ret, err) {
			    if(ret.status){
			    	callback(ret);
			    }else{
			    	callback(ret);
			    }
			});
	    } else {

	    }
	 });
}
//判读距离(m)
function judge_distancemiter(distance){
	distance=parseInt(distance);
  	var dis = '';

	if(distance<1000){
		dis = parseFloat(distance).toFixed(2)+'m';
	}else{
		dis = parseFloat(distance/1000).toFixed(2)+'km';
	}
  return dis;
}
//判读距离
function judge_distance(distance){
  var distanceStr = distance.toString().substring(0,1);
  var r = /^[1-9]?[0-9]*\.[0-9]*$/;

  var dis = '';
  if(r.test(distance)){

  	if(distanceStr==0){
  	  dis = parseFloat(distance).toFixed(2)*1000+'m';
  	}else{
  	  dis = parseFloat(distance).toFixed(1)+'km';
  	}
  }else{
  	  dis = distance+'km';
  }
  return dis;
}
//格式化人数
function judge_fans(count){
  var fans = '';
  if(count>10000){
  	  	fans=(count/10000).toFixed(1)+"万";
  }else{
  		fans=count;
  }
  return fans;
}
//时间戳格式化日期
function judge_date(time){
	// 例子，比如需要这样的格式：yyyy-MM-dd hh:mm:ss
	var times=time*1000;
	var date = new Date(times);
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D = date.getDate() + ' ';
	h = date.getHours() + ':';
	m = date.getMinutes() + ':';
	s = date.getSeconds();
	return (Y+M+D);
}
function getDateDiff(dateTimeStamp){
dateTimeStamp=dateTimeStamp*1000;
var minute = 1000 * 60;
var hour = minute * 60;
var day = hour * 24;
var halfamonth = day * 15;
var month = day * 30;

var now = new Date().getTime();
var diffValue = now - dateTimeStamp;
if(diffValue < 0){
 //若日期不符则弹出窗口告之
 //alert("结束日期不能小于开始日期！");
 }

var monthC =diffValue/month;

var weekC =diffValue/(7*day);

var dayC =diffValue/day;

var hourC =diffValue/hour;

var minC =diffValue/minute;

if(monthC>=1){

 result=parseInt(monthC) + "个月前";

 }

 else if(weekC>=1){

 result=parseInt(weekC) + "周前";

 }

 else if(dayC>=1){

 result=parseInt(dayC) +"天前";

 }

 else if(hourC>=1){

 result=parseInt(hourC) +"个小时前";

 }

 else if(minC>=1){

 result=parseInt(minC) +"分钟前";

 }else

 result="刚刚";

return result;

}
//城市编码转城市
function judge_city(city_code){
	var db = api.require('db');
	var path1 = "widget://res/city.d";
		if(api.systemType == 'ios')
		{
			path1 = "widget://res/city.d";
		}
		else
		{
			path1 = "fs://res/city.d";
		}

	var ret = db.openDatabaseSync({
	    name: 'city',
	    path:"widget://res/city.d"
	});

	var row = db.selectSqlSync({
    	name: 'city',
    	sql: 'SELECT * FROM cool_region where region_type=2 AND region_id = "' + city_code + '"'
	});
	var city = "";
	if(row.status && row.data.length){
		city = row.data[0].region_name;
	}
	return city;
}
function Token() {
    if ( typeof Token.prototype.instance === 'object') {
        return Token.prototype.instance;
    }
    Token.prototype.instance = this;
}

Token.prototype.TOKEN_TIME_KEY = "TOKEN_TIME_KEY";
Token.prototype.TOKEN_KEY = "TOKEN_KEY";
Token.prototype.ACCOUNT_KEY = "ACCOUNT_KEY";
Token.prototype.PASSWORD_KEY = "PASSWORD_KEY";


Token.prototype.setUser = function(account, password) {
    set_local(this.ACCOUNT_KEY, account);
    set_local(this.PASSWORD_KEY, password);
}
Token.prototype.getUser = function() {
	var user = null;

    var account = get_local(this.ACCOUNT_KEY);
    var password = get_local(this.PASSWORD_KEY);
    if(is_define(account)){
    	user={
    	 account:account,
    	 password:password
    	}
    }

    return user;
}

Token.prototype.set = function(token) {
    set_local(this.TOKEN_KEY, token);
    set_local(this.TOKEN_TIME_KEY, new Date().getTime());
}

Token.prototype.get = function() {
	var token = get_local(this.TOKEN_KEY);
    return token;
}


Token.prototype.needUpdate = function() {
    var result = false;
    if(this.get()){
	var now = new Date().getTime();
	var old_time=get_local(this.TOKEN_TIME_KEY)||0;
	if(now-old_time>14400000){
		result=true;
	}
    }
    return result;
}

Token.prototype.isExpired = function() {
    var result = true;
    if(this.get()){
	var now = new Date().getTime();
	var old_time=get_local(this.TOKEN_TIME_KEY)||0;
	if(now-old_time<144000000){
		result=false;
	}

    }else{
    	result=false;
    }
    return result;
}

Token.prototype.isSign = function() {
    return !this.isExpired();
}

Token.prototype.retrieve = function() {
	var account=get_local(this.ACCOUNT_KEY);
    var password=get_local(this.PASSWORD_KEY);
	var data = {
		values:{
			account:account,
			password:password
		}
	};
	var thiz = this;
    request('/user/token', data, function(respond, error){
		if(respond.code == 0){
			thiz.set(respond.token);
		}
    });
}

Token.prototype.refresh = function() {

	var data = {
		values:{
			token:this.get()
		}
	};

	var thiz = this;
    request('/user/token/refresh', data, function(respond, error){
		if(respond.code == 0){
			thiz.set(respond.token);
		}
    });
}

Token.prototype.clear = function() {
	$api.rmStorage(this.TOKEN_KEY);
	$api.rmStorage(this.TOKEN_TIME_KEY);
//	$api.rmStorage(this.ACCOUNT_KEY);
//	$api.rmStorage(this.PASSWORD_KEY);
}
