function sdk_j_init() {
	if (api.systemType == 'ios') {//ios系统不需要进行加载自动就加载了，但是需要 进行点击消息事件的监听
		sdk_j_msg_click();
	} else {
		sdk_j_load();//非ios系统需要进行加载
	}
	sdk_j_msg_set();//进行消息监听，也就是说当应用在前台的时候，也能够接收消息且进行逻辑处理
	//以下是绑定设备为别名，这里需要解释一下，我们后面后端程序进行推送消息的时候是通过别名来进行推送的，所以需要绑定一下，我们这里是绑定的设备唯一识别码，如果你是按照用户名等等的绑定这里可以不要调用。在需要绑定的地方执行sdk_j_uid_set(deviceId);
	var token = get_local('openid');
	if(is_define(token)){
		var osid=get_osid();
		sdk_j_uid_set(osid);	
	}else{
		sdk_j_uid_set();	
	}
	var ajpush = api.require('ajpush');
	ajpush.getRegistrationId(function(ret) {
	    var registrationId = ret.id;
	    set_local('registrationId',registrationId)
	});

}

function sdk_j_load() {//加载jpush
	var ajpush = api.require('ajpush');
	ajpush.init(function(ret) {
		sdk_j_msg();
	});
}
function sdk_j_msg() {//针对非IOS系统的消息点击
	api.addEventListener({
		name : 'appintent'
	}, function(ret, err) {
		sdk_j_msg_send(ret.appParam.ajpush);
	})
}

function sdk_j_msg_click() {//针对IOS系统的消息点击
	api.addEventListener({
		name : 'noticeclicked'
	}, function(ret, err) {
		sdk_j_msg_send(ret.value);
	})
}
function sdk_j_msg_set() {//消息监听，即应用在前台的时候的监听
	var ajpush = api.require('ajpush');
	ajpush.setListener(function(ret) {
		sdk_j_msg_send(ret);
	});
}

function sdk_j_clear() {//清除消息通知，一般用不到，不用管
	var ajpush = api.require('ajpush');
	var param = {
		id : -1
	};
	ajpush.clearNotification(param, function(ret)
	{
		if (ret && ret.status){
			//success
		}
	});
}
function sdk_j_num_set()//针对ios系统的清楚角标提醒数字，只要执行了就设置为空
{
	var ajpush = api.require('ajpush');
	ajpush.setBadge({badge:0});
}
function sdk_j_uid_set(phone) {//绑定别名
	var param = {
		alias : ""
	}
	var send_type=get_local('send_type');
	if(!is_define(send_type)){
		set_local('send_type',true)
		send_type=true;		
	}
	if(true){		
		if(is_define(phone)){
			param.alias=phone;
		}
	}
	var ajpush = api.require('ajpush');
	ajpush.bindAliasAndTags(param, function(ret) 
	{
		var statusCode=ret.statusCode;
		if (statusCode=='6002') 
		{
			sdk_j_uid_set(phone);
		}
	});
}
function sdk_j_msg_send(ret)//统一的消息逻辑处理
{
	console.log(json2str(ret)+"sdk");
	audioStreamer = api.require('audioStreamer');
	var extra,path,path1;
	if (api.systemType == 'ios'){
		if(ret.extra){
			extra=ret.extra;
		}else if(ret.extras){
			extra=ret.extras;
		}
		sdk_j_num_set();//清除角标
	}else{
		extra=ret.extra;
	}
	path="widget://res/newmsg.mp3";
	path1="widget://res/dingdong.mp3";
	var content=ret.content;
	var id =extra.order_id; 
	var push_type=extra.push_type;
	var is_confirm=extra.is_confirm;
	if(push_type==1){
		ue_script_f("root","home","get_home_deal()");
		ue_script_f("root","order","get_orderList('first')");
		audioStreamer.openPlayer({
		    path: path
		});
		if(is_confirm==0) {
			open_f_mask('widget://html/push_order.html',{id:id});
		}
	}else if(push_type==2){
		audioStreamer.openPlayer({
		    path: path1
		});
		close_f('mask');
		ue_script_f("root","home","get_home_deal()");
		ue_script_f("root","order","get_orderList('first')");
		ue_script_f("root","order","get_his_orderList('first')");
		ue_script_f("order_deal","order_deal_c","get_deal('"+id+"')");
		ue_script_f("root","user","user_info()");
	}
	//注，以上的逻辑稍微有点复杂，就不详细描述为什么了，简单一点说,extra是你后端传过来的json，content,是你推送的内容，我们把后端过来的extra转换成一个json对象，然后去进行逻辑。以上我们是得到了后端传过来的一个age的值
}
