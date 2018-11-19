var toast_time=3000;
var appid="A6921224287309";
//关闭启动图
function close_start_page(callback)//config.xml中的autoLaunch设置为false;
{
	if(is_define(callback))
	{
		callback();
	}
	setTimeout(function()
	{
		api.removeLaunchView(
		{
			animation:
			{
				type : 'push',
				duration : 500
			}
		});
	}, 2000);
}
//ios使用webview方式
function open_f_useWKWebView(name,url,pageParam)
{
	if(is_define(pageParam))
	{
		var pageParam=pageParam;
	}
	else
	{
		var pageParam=new Object();
	}
	var $header = $api.dom('#header');
	var $footer = $api.byId('footer');
	$api.fixStatusBar($header);
	var $body = $api.dom('body');
	var body_h=api.winHeight;
	var header_h = $api.offset($header).h;
	var footer_h = $api.offset($footer).h;
	var rect_h = body_h - header_h - footer_h;
	api.openFrame(
	{
		name:name,
		url:url,
		rect:
		{
			x : 0,
			y : header_h,
			w : 'auto',
			h : rect_h
		},
		bounces : true,
		//opaque : true,
		useWKWebView : true,
		pageParam:pageParam,
		bgColor : 'rgba(0,0,0,0)',
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		reload : true
	});
}
//ajax函数封装
function r_ajax(serverURL,data,callback)
{
	var token="";
	var city_name=get_local("city_name");
	if (!is_json(data))
	{
		data=str2json(data);
		data.values.app_version=app_version;
		if(!is_define(data.values.token))
		{
			if(is_define(get_local("token")))
			{
				uid=get_local("token");
			}
			data.values.token=token;
		}
		if(!is_define(data.values.city_name))
		{
			data.values.city_name=get_local("city_name");
		}
	}
	show_doing();
	api.ajax({
		url : serverURL,
		method : 'post',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		data : data
	}, function(ret, err)
	{
		hide_doing();
		if (ret)
		{
			callback(ret)
		}
		else
		{
			net_error();//请求失败
		}
	});
}

function open_f_mask(url,pageParam)
{
	if(is_define(pageParam))
	{
		var pageParam=pageParam;
	}
	else
	{
		var pageParam=new Object();
	}
	api.openFrame(
	{
		name : 'mask',
		url : url,
		rect : 
		{
			x : 0,
			y : 0,
			w : 'auto',
			h : 'auto'
		},
		bounces : false,
		opaque : false,
		pageParam:pageParam,
		allowEdit : false,
		bgColor : 'rgba(0,0,0,0.3)',//主要是这里起作用哦
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		reload : false
	});
}
//打开带动画的浮动窗口
function open_f_mask_anmation(url,pageParam)
{
	if(is_define(pageParam))
	{
		var pageParam=pageParam;
	}
	else
	{
		var pageParam=new Object();
	}
	api.openFrame(
	{
		name : 'mask',
		url : url,
		rect : 
		{
			x : 0,
			y : 0,
			w : 'auto',
			h : 'auto'
		},
		bounces : false,
		opaque : false,
		pageParam:pageParam,
		allowEdit : false,
		bgColor : 'rgba(0,0,0,0.3)',//主要是这里起作用哦
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		reload : false,
		animation :{
			    type:"movein",                
			    subType:"from_right",       
			    duration:300                
					}
	});
}
//打开新窗口
function open_w(name,url,pageParam)
{
	if(is_define(pageParam))
	{
		var pageParam=pageParam;
	}
	else
	{
		var pageParam=new Object();
	}
	api.openWin({
		name : name,
		url : url,
		pageParam:pageParam,
		reload:true
	});
}
//打开新窗口(不允许back)
function open_w_nb(name,url,pageParam)
{

	if(is_define(pageParam))
	{
		var pageParam=pageParam;
	}
	else
	{
		var pageParam=new Object();
	}
	api.openWin(
	{
		name : name,
		url : url,
		pageParam:pageParam,
		reload:true,
		slidBackEnabled:false
	});

}
//打开新窗口(带动画,主要针对搜索界面)
function open_w_anmation(name,url,pageParam)
{    var anmation ;
    if(api.systemType == 'ios'){
        anmation = {
			    type:"fade",        
			    duration:300                
					}
    }else{
    	anmation = {};
    }
	if(is_define(pageParam))
	{
		var pageParam=pageParam;
	}
	else
	{
		var pageParam=new Object();
	}
	api.openWin({
		name : name,
		url : url,
		pageParam:pageParam,
		animation:anmation
	});
}
//关闭当前页面
function close_w()
{
	api.closeWin();
}
//关闭指定页面
function close_name_w(name)
{
	if (api.systemType == 'ios')
	{
		setTimeout
		(
			function()
			{
				api.execScript(
				{
					name: "root",
					script: "api.closeWin({name:'"+name+"'});"
				});
			},500
		)
	}
	else
	{
		api.closeWin({name:name});
	}
}
//打开浮动窗口
function open_f(name,url,pageParam,refresh)
{
	if(is_define(pageParam))
	{
		var pageParam=pageParam;
	}
	else
	{
		var pageParam=new Object();
	}
	if(!is_define(refresh))
	{
		var refresh="UIPullRefreshMotive";
	}
	var $header = $api.dom('#header');
	$api.fixStatusBar($header);
	var $body = $api.dom('body');
	var header_h = $api.offset($header).h;
	api.openFrame(
	{
		name:name,
		url:url,
		rect:
		{
			x : 0,
			y : header_h,
			w : 'auto',
			h : 'auto'
		},
		bounces : false,
		//opaque : true,
		pageParam:pageParam,
		customRefreshHeader:refresh,
		bgColor : 'rgba(0,0,0,0)',
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		reload : true
	});
}
//打开浮动窗口
function open_f_nobues(name,url,pageParam,refresh)
{
	if(is_define(pageParam))
	{
		var pageParam=pageParam;
	}
	else
	{
		var pageParam=new Object();
	}
	if(!is_define(refresh))
	{
		var refresh="UIPullRefreshMotive";
	}
	var $header = $api.dom('#header');
	$api.fixStatusBar($header);
	var $body = $api.dom('body');
	var header_h = $api.offset($header).h;
	api.openFrame(
	{
		name:name,
		url:url,
		rect:
		{
			x : 0,
			y : header_h,
			w : 'auto',
			h : 'auto'
		},
		bounces : false,
		//opaque : true,
		pageParam:pageParam,
		customRefreshHeader:refresh,
		bgColor : 'rgba(0,0,0,0)',
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		reload : true
	});
}
//打开浮动窗口
function open_f_f(name,url,pageParam,refresh)
{
	if(is_define(pageParam))
	{
		var pageParam=pageParam;
	}
	else
	{
		var pageParam=new Object();
	}
	if(!is_define(refresh))
	{
		var refresh="UIPullRefreshMotive";
	}
	var $header = $api.dom('#header');
	var $footer = $api.byId('footer');
	$api.fixStatusBar($header);
	var $body = $api.dom('body');
	var body_h=api.winHeight;
	var header_h = $api.offset($header).h;
	var footer_h = $api.offset($footer).h;
	var rect_h = body_h - header_h - footer_h;
	api.openFrame(
	{
		name:name,
		url:url,
		rect:
		{
			x : 0,
			y : header_h,
			w : 'auto',
			h : rect_h
		},
		bounces : false,
		//opaque : true,
		customRefreshHeader:refresh,
		pageParam:pageParam,
		bgColor : 'rgba(0,0,0,0)',
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		reload : true
	});
}
//打开侧滑
function open_slide() 
{
	api.openSlidPane({type : 'left'});
}
//关闭侧滑
function close_slide()
{
	api.closeSlidPane();
}

//隐藏frame
function hide_f(name)
{
	api.setFrameAttr(
	{
		name:name,
		hidden:true,
	});
}
//显示frame
function show_f(name)
{
	api.setFrameAttr(
	{
		name:name,
		hidden:false,
	});
}
//关闭frame
function close_f(name)
{
	api.closeFrame(
	{
    	name:name
	});
}
function get_f_h()
{
	return api.frameHeight;
}
//页面滚动
function scroll_page(type,callback)
{
	if(type=="up")
	{
		api.pageUp
		(
			{"top":true},
		    function(ret)
		    {
		        if(is_define(callback))
		        {
		        	callback();
		        }
		    }
		);
	}
	else if(type=="down")
	{
		api.pageDown
		(
			{"bottom":true},
		    function(ret)
		    {
		        if(is_define(callback))
		        {
		        	callback();
		        }
		    }
		)
	}
}
//提示框
function $toast(txt,duration,location)
{
	if (!is_define(txt))
	{
		txt='Loading...';
	}
	if (!is_define(duration))
	{
		duration=toast_time;
	}
	if (!is_define(location))
	{
		location='middle';
	}
	api.toast({
		msg : txt,
		duration : duration,
		location : location
	});
}
//警告框
function $alert(txt,title,button)
{
	if(!is_define(title))
	{
		var title="";
	}
	if(!is_define(button))
	{
		var button="确定";
	}
	api.alert(
	{
		title : title,
		msg : txt,
		buttons:[button]
	});
}
//type=date选择日期，type=date_time选择日期时间,type=time选择时间
function open_datetime(type,title,datetime,callback)
{
	if(get_os()=="android"&&type=="date_time")
	{
		var true_type="date";
	}
	else
	{
		var true_type=type;
	}
	if(!is_define(title))
	{
		var title="";
	}
	if(!is_define(datetime))
	{
		var datetime="";
	}
	api.openPicker({
    type: true_type,
    date: datetime,
    title:title
	},function(ret,err)
	{
		if(type=="date")
		{
			var back_str=ret.year+"-"+num_two(ret.month)+"-"+num_two(ret.day);
			if(is_define(callback))
			{
				callback(back_str);
			}
		}
		else if(type=="time")
		{
			var back_str=num_two(ret.hour)+":"+num_two(ret.minute);
			if(is_define(callback))
			{
				callback(back_str);
			}
		}
		else if(type=="date_time")
		{
			if(get_os()=="ios")
			{
				var back_str=ret.year+"-"+num_two(ret.month)+"-"+num_two(ret.day)+" "+num_two(ret.hour)+":"+num_two(ret.minute);
				if(is_define(callback))
				{
					callback(back_str);
				}
			}
			else
			{
				var back_str=ret.year+"-"+num_two(ret.month)+"-"+num_two(ret.day);
				api.openPicker(
				{
			    	type: 'time',
			    	title:'选择时间'
				},function(rets,errs)
				{
					back_str=back_str+" "+num_two(rets.hour)+":"+num_two(rets.minute);
					if(is_define(callback))
					{
						callback(back_str);
					}
				})
			}
		}
	});
}
//下拉刷新
function push_down(callbak) {
	api.setRefreshHeaderInfo({
		visible : true,
		loadingImg : 'widget://image/refresh.png',
		bgColor : '#f1f1f1',
		textColor : '#4d4d4d',
		textDown : '下拉刷新...',
		textUp : '松开刷新...',
		showTime : true
	}, function(ret, err)
	{
		if (callbak)
		{
			callbak();
		}
	});
}

//下拉刷新恢复
function push_down_over()
{
	api.refreshHeaderLoadDone();
}
function push_up(callback)
{
	api.addEventListener(
	{
    	name:'scrolltobottom',
    	extra:
    	{
        	threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
    	}
	},function(ret,err)
	{
		var html='<div id="pushup_trip" class="h15e tx-c w10 ftz10 pdt10 pdb10"><img class="w15e h15e" src="../image/loading_more.gif"></div>';
		$("body").append(html);
		if(is_define(callback))
		{
			callback();
		}
	});
}
function push_up_over()
{
	$("#pushup_trip").remove();
}
//拨打电话
function call_tel(tel)
{
	api.call(
	{
		type : 'tel_prompt',
		number : tel
	});
}
//发送短息
function send_sms(tel,text,c1,c2)
{
	api.sms(
	{
    	numbers:[tel],
    	text:text
	},function(ret, err)
	{
	    if(ret.status)
	    {
	    	if(is_define(c1))
	    	{
	    		c1();
	    	}
	    	else
	    	{
	    		$toast('发送成功');
	    	}
	    }
	    else
	    {
	    	if(is_define(c2))
	    	{
	    		c2();
	    	}
	    	else
	    	{
	    		$toast('发送失败');
	    	}
	    }
	});
}

//加载网页
function open_url(url)
{
	if (get_os()=='ios')
	{
		api.openApp({
			iosUrl : url
		},function(ret, err)
		{
		});
	}
	else
	{
		api.openApp(
		{
			androidPkg : 'android.intent.action.VIEW',
			mimeType : 'text/html',
			uri : url
		},function(ret, err)
		{
		});
	}
}

//获得设备编号
function get_osid(callback)
{
	var deviceId = api.deviceId;
	deviceId = deviceId.replace(/\-/g, "");
	if(is_define(callback))
	{
		callback(deviceId);
	}
	else
	{
		return deviceId;
	}
}
//显示模态加载
function show_doing(title,text)
{
	if(!is_define(title))
	{
		var title='';
	}
	if(!is_define(text))
	{
		var text='';
	}
	api.showProgress(
	{
	    style: 'default',
	    animationType: 'fade',
	    title:title,
	    text:text
	});
}
//关闭模态加载
function hide_doing()
{
	api.hideProgress();
}

function check_update()
{
	var mam = api.require('mam');
	mam.checkUpdate(function(ret, err)
	{
    	if (ret) 
    	{
        	var result = ret.result;
        	if(ret.status==1)
        	{
        		if(result.update)
        		{
        			api.confirm(
					{
						title:'版本更新',
						msg : '发现新版本：'+result.version+','+result.updateTip,
						buttons : ['确定更新', '稍后再说']
					},
					function(ret, err)
					{
						if (ret.buttonIndex==1)
						{
							if (api.systemType=='ios') 
							{
								api.installApp(
								{
								    appUri:result.source       //安装包对应plist地址
								});
								exit_app();
							}
							else
							{
								location.href=result.source;
							}
						}
					})
        		}
        		else
        		{
        			$toast('暂无新版本','1000');
        		}
        	}
        	else
        	{
        		$toast('暂无新版本','1000');
        	}
    	}
    	else
    	{
        	api.alert({msg:err.msg});
    	};
	});
}
//静默更新
function update_widget()
{
	api.addEventListener({
	    name:'smartupdatefinish'
    },
    function(ret,err)
    {
    	if(is_define(ret.value[0].extra))
		{
			$confirm(ret.value[0].extra,'请重启应用','',new Array('',exit_app));
		}
    });
}
function getNowFormatDate() {
    var date = new Date();
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate =  date.getHours() + seperator2 + date.getMinutes()
    return currentdate;
}
function exit_app()
{
	api.closeWidget(
	{
	    id: appid,
	    retData: {name:'closeWidget'},
	    animation: 
	    {
	        type: 'flip',
	        subType: 'from_bottom',
	        duration: 500
	    },
	    silent:true
	});
}
//退出App
function android_exit()
{
	api.addEventListener(
	{
		name:'keyback'
	},
	function(ret,err)
	{
		api.toast(
		{
			msg : '再按一次返回键退出'+api.appName,
			duration : 2000,
			location : 'bottom'
		});
		api.addEventListener(
		{
			name:'keyback'
		},
		function(ret, err)
		{
			exit_app();
		});
	});
}
//执行指定窗口界面
function ue_script(winname,fun)
{
	api.execScript(
	{
		name:winname,
		script:fun
	});
}
//执行指定窗口界面
function ue_script_f(winname,framename,fun)
{
	api.execScript(
	{
		name:winname,
		frameName:framename,
		script:fun
	});
}

//清楚缓存
function clear_cache(callback)
{
	api.clearCache
	(
	    function(ret,err)
	    {
	    	$toast('已清除',1000);
			if(is_define(callback))
			{
				callback();
			}
	    }
	);
}
//网络不好的情况
function net_error(callback)
{
	$toast('网络开小差',1000);
	if(is_define(callback))
	{
		callback();
	}
}
function select_img(callback)
{
	if(!is_define(callback))
	{
		var callback='';
	}
	api.actionSheet(
	{
		title : '上传头像',
		cancelTitle : '关闭',
		buttons : ['打开相机', '本地图库']
	}, function(ret, err)
	{
		if(ret.buttonIndex==3)
		{
			return false;
		}
		else
		{
			var type_arr=new Array('camera','library');
			api.getPicture(
			{
				sourceType : type_arr[ret.buttonIndex-1],
				encodingType : 'jpg',
				mediaValue : 'pic',
				destinationType : 'url',
				allowEdit : false,
				quality : 80,
				saveToPhotoAlbum : false
			},function(ret, err)
			{
				if (ret)
				{
					if(is_define(callback))
					{
						callback(ret.data);
					}
				}
			})
		}
	});
}
function get_par()
{
	return api.pageParam;
}
function download(url,callback)
{
	var file_arr=url.split(".");
	var file_arr_len=file_arr.length;
	var ext_name=file_arr[file_arr_len-1];//得到扩展名
	var filename=new Date().getTime()+"."+ext_name;
	var savepath='fs://'+filename;
	api.download(
	{
	    url: url,
	    savePath: savepath,
	    report: true,
	    cache: true,
	    allowResume:true
	},function(ret,err)
	{
	    if (ret.state==1)
	    {
	        if(is_define(callback))
	        {
	        	callback(ret.savePath);
	        }
	    }
	});
}
function get_os(callback)
{
	var os=api.systemType;
	if(is_define(callback))
	{
		callback(os);
	}
	else
	{
		return os;
	}
}
function get_location(callback)
{
	api.getLocation
	(
	    function(ret,err)
	    {
	        if(ret.status)
	        {
	        	api.stopLocation();
	        	if(is_define(callback))
	        	{
	        		callback(ret.latitude,ret.longitude);
	        	}
	        }
	        else
	        {
	            $toast('定位失败');
	        }
	    }
	);
}
function get_net()
{
	//如果unknown-未知，ethernet-以太网，wifi-wifi，2g-2G网络，3g-3G网络，4g-4G网络，none-无网络
	return api.connectionType;
}
//打开不浮动窗口
function open_f_nobounces(name,url,pageParam)
{
	if(is_define(pageParam))
	{
		var pageParam=pageParam;
	}
	else
	{
		var pageParam=new Object();
	}
	var $header = $api.dom('#header');
	$api.fixStatusBar($header);
	var $body = $api.dom('body');
	var header_h = $api.offset($header).h;
	api.openFrame(
	{
		name:name,
		url:url,
		rect:
		{
			x : 0,
			y : header_h,
			w : 'auto',
			h : 'auto'
		},
		bounces : false,
		//opaque : true,
		allowEdit : false,
		pageParam:pageParam,
		bgColor : 'rgba(0,0,0,0)',
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		reload : false
	});
}
function get_par()
{
	return api.pageParam;
}
function open_navigation(start_lat, start_lon, start_place, end_lat, end_lon, end_place) {
	var systemType = api.systemType;
	var appBundle = '';
	var appStore = 'https://itunes.apple.com/cn/app/bai-du-tu-shou-ji-tu-lu-xian/id452186370?mt=8';
	if (systemType == 'ios') {
		appBundle = 'bdmap'
	} else {
		appBundle = 'com.baidu.BaiduMap'
	}
	api.appInstalled({
		appBundle : appBundle
	}, function(ret, err) {
		if (ret.installed) {
			//应用已安装
			api.openApp({
				androidPkg : 'android.intent.action.VIEW',
				mimeType : 'text/html',
				uri : "intent://map/direction?destination=latlng:" + end_lat + "," + end_lon + "|name:" + end_place + "&origin=latlng:" + start_lat + "," + start_lon + "|name:" + start_place + "&mode=driving&src=osm#Intent;scheme=bdapp;package=com.baidu.BaiduMap;end",
				iosUrl : "baidumap://map/direction?destination=latlng:" + end_lat + "," + end_lon + "|name:" + end_place + "&origin=latlng:" + start_lat + "," + start_lon + "|name:" + start_place + "&mode=driving&src=osm#Intent;scheme=bdapp;package=com.baidu.BaiduMap;end"
			});
		} else {
			if (systemType == 'ios') {
				api.confirm({
					title : '提示',
					msg : "您的的设备未安装百度地图应用，是否要前往AppStore下载",
					buttons : ['确定', '取消']
				}, function(ret, err) {
					if (ret.buttonIndex == 1) {
						api.installApp({
							appUri : appStore //安装包对应plist地址
						});
					}
				});
			} else {
				$toast("请先安装百度地图应用", 2000);
			}
		}
	});
}