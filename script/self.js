var download_url="http://download.taojino2o.com";
var app_version="0.0.4";
var arr_wel=new Array();
var no_data="<div class='box'><p class='ovd pdt10 tx-c'><img src='../image/no_data.png' class='w3 inblock'></p><p class='tx-c ftz10 t-gra umh3 pdb05'>暂无数据</p></div>";
//存储历史搜索的用户表
var sql = "CREATE TABLE IF NOT EXISTS historywords(id INTEGER PRIMARY KEY AUTOINCREMENT,section varchar(4000) NOT NULL,content varchar(4000) NOT NULL)";

arr_wel[0]='widget://image/welcome/1.jpg';
arr_wel[1]='widget://image/welcome/2.jpg';
arr_wel[2]='widget://image/welcome/3.jpg';
//创建
function start_welcome(callback)
{
	first_start.open(
	{
		rect:{x:0,y:0,w:api.winWidth,h:api.winHeight},
		data:{paths:arr_wel},
		placeholderImg:arr_wel[0],
		contentMode:'scaleToFill',
		interval:10000,
		auto:false,
		loop: false,
		fixedOn:'',
		fixed: true,
		styles:
		{
	        indicator:
	        {
	            dot:{
	               w:0,
	               h:0
	            },
	            align:'center',
	            color:'#393939',
	            activeColor:'#f39915'
	        }
	    },
	},
	function(ret, err)
	{
		if(ret.status)
		{
			if(ret.eventType=='click')
			{
				if(ret.index==(arr_wel.length-1))
				{
					start_home();
				}
			}
		}
	});
}
//阻止div事件冒泡
function cancelBubble(e) { 
   var evt = e ? e : window.event; 
    if (evt.stopPropagation) {  //W3C 
     evt.stopPropagation(); 
    }else {  //IE  
     evt.cancelBubble = true; 
    } 
}
//判断定位权限是否开启
function judge_location(callback){
	var sys = api.systemType;
	
	if(sys=='ios'){
		var privacy = api.require('privacy');
		privacy.location(function(ret, err) {
			
		    if (ret.status) {
		        callback();
		    } else {
		        api.confirm({
				    title: '提示',
				    msg: '系统定位权限未开启,是否去开启',
				    buttons: ['确定', '取消']
				}, function(ret, err) {
				   	if(ret.buttonIndex==1){
				   		 api.openApp({
					        iosUrl:"app-settings:﻿"
					    },function(ret,err){
					        
					    });
				   	}else{
				   		
				   	}
				});
		    }
		});
	}else{
		callback();
	}
}
function no_open()
{
	$toast("嗨丫丫正在跑步前进，稍后将会到达");
}
function goto_trip()
{
	open_w("trip","widget://pub_html/trip.html");
}
function set_header_title(v)
{
	$("#header_title").text(v);
}
function sys()
{
	d_scan(function(ret)
	{	
		if(is_define(ret))
		{
			if(ret.indexOf("jmparam")>=0)
			{
				var ret_arr=ret.split("jmparam");
				var sys_str=ret_arr[1].replace('=','');
				var sys_result=str2json(sys_str);
				if(sys_result.type=="person")//个人二维码
				{
					if(is_define(get_local("openid")))
					{
						var nickname=decodeURI(sys_result.nickname);
						goto_person(sys_result.openid,nickname);
					}
					else
					{
						open_w("reg","widget://user/reg.html",{invite:sys_result.invite});
					}
				}
				else if(sys_result.type=="group")//群组二维码
				{
					goto_group_info(sys_result.group_id,sys_result.group_name);
				}
				else if(sys_result.type=="shop")//商户二维码
				{
					goto_shop_detail(sys_result.shop_id,sys_result.shop_name);
				}
				else if(sys_result.type=="pay")//支付二维码
				{
					if(is_define(get_local("openid")))
					{
						if(sys_result.openid==get_local("openid"))
						{
							$toast("自己不能给自己付款");
							return false;
						}
						else
						{
							api.prompt(
							{
								title:'发起收款请求',
								msg:'请输入收款金额',
							    buttons: ['确定', '取消']
							}, function(ret, err)
							{
							    var index = ret.buttonIndex;
							    var text = ret.text;
							    if(index==1)
							    {
							    	if(is_define(text))
							    	{
							    		if(is_number(text))
							    		{
							    			if(text>0)
							    			{
												sendCommandNotificationMessage(sys_result.openid,'PRIVATE','receive_money',text);
							    			}
							    			else
							    			{
							    				$toast("金额必须大于0");
							    			}
							    		}
							    		else
							    		{
							    			$toast("金额格式不对");
							    		}
							    	}
							    	else
							    	{
							    		$toast("请输入收款金额");
							    	}
							    }
							});
						}
					}
					else
					{
						goto_login();
					}
				}
				else if(sys_result.type=="order")
				{
					if(get_local("openid")==sys_result.shop_id){
						open_w("order_detail","widget://user/order_detail.html",{id:sys_result.order_no});
					}else{
						$toast("不是您的订单");
					}
				}
				else
				{
					$toast("外部二维码不能识别");
				}
			}
			else
			{
				var value=ret.substr(0,4);
				if (value=='http'||value=='HTTP')
				{
					open_url(ret);
					return false;
				}
				else
				{
					$toast("没有识别结果");
				}
			}
		}
		else
		{
			$toast("没有识别结果");
		}
	});
}
function goto_city()
{
	open_w("city","widget://pub_html/city.html");
}
function goto_city_select(win_type)
{
	if(!is_define(win_type))
	{
		var win_type="root";
	}
	open_w("province_select","widget://pub_html/province_select.html",{win_type:win_type});
}
function push_down_motive(callback)
{ 
	api.setCustomRefreshHeaderInfo(
	{
	    bgColor: '#eee',
	    images: [
	        'widget://image/push/motive/loding_00000.png',
	        'widget://image/push/motive/loding_00001.png',
	        'widget://image/push/motive/loding_00002.png',
	        'widget://image/push/motive/loding_00003.png',
	        'widget://image/push/motive/loding_00004.png',
	        'widget://image/push/motive/loding_00005.png',
	        'widget://image/push/motive/loding_00006.png',
	        'widget://image/push/motive/loding_00007.png',
	        'widget://image/push/motive/loding_00008.png',
	        'widget://image/push/motive/loding_00009.png'
	    ],
	    tips: {
	        pull:'下拉刷新',
	        threshold:'松开立即刷新',
	        load:'正在刷新'
	    }
	},function()
	{
	    if(is_define(callback))
		{
			callback();
		}
	});
}
function push_down_flash(callback)
{
	api.setCustomRefreshHeaderInfo(
	{
	    bgColor: '#ffffff',
//	    image: {
//	        pull: [
//	            'widget://image/refresh/dropdown0.png',
//	            'widget://image/refresh/dropdown1.png',
//	            'widget://image/refresh/dropdown2.png',
//	            'widget://image/refresh/dropdown3.png',
//	            'widget://image/refresh/dropdown4.png',
//	            'widget://image/refresh/dropdown5.png',
//	            'widget://image/refresh/dropdown6.png'
//	        ],
//	        load: [
//	            'widget://image/refresh/loading0.png',
//	            'widget://image/refresh/loading1.png',
//	            'widget://image/refresh/loading2.png',
//	            'widget://image/refresh/loading3.png',
//	            'widget://image/refresh/loading4.png'
//	        ]
//	    },
	    isScale: true,
	}, function()
	{
	    if(is_define(callback))
		{
			callback();
		}
	});
}
function push_down_water(callback)
{
	api.setCustomRefreshHeaderInfo(
	{
        bgColor: '#ffffff',
        dropColor:'#18b4ed',
   	}, function()
   	{
   		setTimeout(function()
   		{
	   		if(is_define(callback))
			{
				callback();
			}
   		},1000);
	});
}
function listener_page(c1,c2)
{
	document.addEventListener("scroll", function(event)
	{
		if(is_define(c1))
		{
			c1(event);
		}
	});
	document.addEventListener("touchmove", function(event)
	{
		if(is_define(c1))
		{
			c1(event);
		}
	});
	document.addEventListener("touchend", function(event)
	{
		if(is_define(c1))
		{
			c1(event);
		}
		if(is_define(c2))
		{
			c2(event);
		}
	});
	document.addEventListener("touchstart", function(event)
	{
		if(is_define(c1))
		{
			c1(event);
		}
	});
}
function list_reload_data(data)
{
	UIListView.reloadData(
	{
		data:data
	},function()
	{
		if(ret.status)
		{
        	//alert('刷新数据成功');
		}
		else
		{
			list_view(data);
		}
	});
}
function oss_pic(pic,w,h,widget)
{
	if(is_define(pic))
	{
		var oss_str=pic+"?x-oss-process=image/resize,limit_0,m_fill";
		if(is_define(w))
		{
			if(w>1)
			{
				oss_str=oss_str+",w_"+w;
			}
		}
		else
		{
			oss_str=oss_str+",w_550";
		}
		if(is_define(h))
		{
			if(h>1)
			{
				oss_str=oss_str+",h_"+h;
			}
		}
		else
		{
			oss_str=oss_str+",h_550";
		}
	}
	else
	{
		if(is_define(widget))
		{
			oss_str="widget://image/logo.png";
		}
		else
		{
			oss_str="../image/logo.png";
		}
	}
	return oss_str;
}
function get_location(callback)
{
	var map = api.require('bMap');
	map.getLocation(
	{
	    accuracy: '100m',
	    autoStop: true,
	    filter: 1
	}, function(ret,err)
	{
		if(ret.status)
		{
			callback(ret.lat,ret.lon);
		}
	})
}
function goto_login()
{
	open_w("login","widget://user/login.html");
}
function is_login(callback)
{
	if(is_define(get_local("openid")))
	{
		if(is_define(callback))
		{
			callback();
		}
	}
	else
	{
		goto_login();
	}
}
function goto_single_chat(id,nickname,share_title,share_desc,share_img,share_id,link_type)
{
	if(is_define(get_local("openid")))
	{
		if(id==get_local("openid"))
		{
			$toast("自己不能与自己聊天");
			return false;
		}
		else
		{
			if(!is_define(share_title))
			{
				var share_title="";
			}
			if(!is_define(share_desc))
			{
				var share_desc="";
			}
			if(!is_define(share_img))
			{
				var share_img="";
			}
			if(!is_define(share_id))
			{
				var share_id="";
			}
			if(!is_define(link_type))
			{
				var link_type="";
			}
			api.openWin(
			{
				name : 'single_chat',
				url : 'widget://chat/single_chat.html',
				pageParam:{id:id,nickname:nickname,share_id:share_id,share_title:share_title,share_desc:share_desc,share_img:share_img,link_type:link_type},
				reload:false
			});
		}
	}
	else
	{
		open_w("login","widget://user/login.html");
	}
}
function goto_customer_chat(id,nickname,share_id,share_title,share_desc,share_img,link_type)
{
	if(is_define(get_local("openid")))
	{
		if(id==get_local("openid"))
		{
			$toast("自己不能与自己聊天");
			return false;
		}
		else
		{
			if(!is_define(share_title))
			{
				var share_title="";
			}
			if(!is_define(share_desc))
			{
				var share_desc="";
			}
			if(!is_define(share_img))
			{
				var share_img="";
			}
			if(!is_define(share_id))
			{
				var share_id="";
			}
			if(!is_define(link_type))
			{
				var link_type="";
			}
			api.openWin(
			{
				name : 'customer_chat',
				url : 'widget://chat/customer_chat.html',
				pageParam:{id:id,nickname:nickname,share_id:share_id,share_title:share_title,share_desc:share_desc,share_img:share_img,link_type:link_type},
				reload:false
			});
		}
	}
	else
	{
		open_w("login","widget://user/login.html");
	}
}
function goto_group_chat(id,name)
{
	api.openWin(
	{
		name : 'group_chat',
		url : 'widget://chat/group_chat.html',
		pageParam:{id:id,group_name:name},
		reload:false
	});
}
function goto_person(id,name)
{
	
	is_login(function(){open_w("person","widget://chat/person.html",{id:id,nickname:name})});
	return false
//	request("/user/friend/detail",{values:{'id':id}}, function(data, error)
//	{
//		if(data.user.isAngle==0)
//		{
//			open_w("person","widget://chat/person.html",{id:id,nickname:name});
//		}
//		else
//		{
//			open_w("angel","widget://chat/angel.html",{id:id,nickname:name});
//		}
//	})
}
function goto_group_info(id,name)
{
	is_login(function(){open_w("group_info","widget://chat/group_info.html",{id:id,name:name})});
}
function goto_angel(id,name,shop_id)
{
	open_w("angel","widget://chat/angel.html",{id:id,nickname:name,shop_id:shop_id});
}
function goto_person_news(id,name)
{
	open_w("person_news","widget://chat/person_news.html",{id:id,name:name});
}
function goto_nav(lat,lon,title,address)
{
	open_w("map_nav","widget://pub_html/map_nav.html",{lat:lat,lon:lon,title:title,address:address});
}
function goto_info(id,name)
{
	open_w('info','widget://pub_html/info.html',{id:id,name:name});
}
function goto_good_detail(id,name,angel,shop_id)
{
	if(!is_define(angel)){
		angel=0;
	}
	if(!is_define(shop_id)){
		shop_id=0;
	}
	open_w('good_detail'+id,'widget://html/good_detail.html',{name:name,id:id,angel:angel,shop_id:shop_id})
}
function goto_shop_detail(id,name)
{
	open_w('shop_detail','widget://html/shop_detail.html',{name:name,id:id})
}
function goto_shop_detail_info(data,is_angel)
{
	open_w('shop_detail_info','widget://html/shop_detail_info.html',{data:data,is_angel:is_angel});
}
function goto_shop_list(id,name)
{
	open_w('shop_list','widget://html/shop_list.html',{id:id,name:name})
}
function goto_good_list(id,name)
{
	open_w('good_list','widget://html/good_list.html',{id:id,name:name})
}
function goto_factory_list(id,name)
{
	open_w('good_list','widget://factory/good_list.html',{id:id,name:name})
}
function goto_cart()
{
	open_w('cart','widget://html/cart.html');
}
function goto_buy(data,callback)
{
	open_w('buy','widget://html/buy.html',{data:data});
	if(is_define(callback))
	{
		callback();
	}
}
function goto_buy_once()
{
	open_w('buy_once','widget://html/buy_once.html')
}
function goto_pay()
{
	$toast("开发中");return false;
	open_w('pay','widget://html/pay.html')
}
function goto_order_detail(id)
{
	open_w('order_detail','widget://user/order_detail.html',{id:id});
}
function goto_trading_detail(id)
{
	open_w('trading_detail','widget://user/trading_detail.html',{id:id})
}
function change_time_out(time) {

	if (time == '') {
		return;
	}
	var now = new Date().getTime();
	if (now - time < 5 * 60 * 1000) {
		return "刚刚";
	}
	if (timetostr("ymd", time, true) == timetostr("ymd", now, true)) {
		return timetostr("hm", time, true);
	} else if (timetostr("ymd", time, true) == timetostr("ymd", now - 86400000, true)) {
		return "昨天 " + timetostr("hm", time, true);
	} else if (timetostr("y", time, true) != timetostr("y", now, true)) {
		return timetostr("ymdc", time, true);
	} else {
		return timetostr("mdhmc", time, true);
	}
	return time;
}
function timetostr(type, str, f) {
	var t = (f) ? parseInt(str) : parseInt(str) * 1000;
	var datetime = new Date(t);
	var y = datetime.getFullYear();
	var m = num_two(datetime.getMonth() + 1);
	var d = num_two(datetime.getDate());
	var hour = num_two(datetime.getHours());
	var min = num_two(datetime.getMinutes());
	var sec = num_two(datetime.getSeconds());
	if (type == "y") {
		return y;
	} else if (type == "m") {
		return m;
	} else if (type == "d") {
		return d;
	} else if (type == "hour") {
		return hour;
	} else if (type == "min") {
		return min;
	} else if (type == "sec") {
		return sec;
	} else if (type == "ymd") {
		return y + "-" + m + "-" + d;
	} else if (type == "ymdc") {
		return y + "年" + m + "月" + d + "日";
	} else if (type == "mdc") {
		return m + "月" + d + "日";
	} else if (type == "ymdhm") {
		return y + "年" + m + "月" + d + "日" + " " + hour + ":" + min;
	} else if (type == "md") {
		return m + "-" + d;
	} else if (type == "mdhm") {
		return m + "-" + d + " " + hour + ":" + min;
	} else if (type == "mdhmc") {
		return m + "月" + d + "日 " + hour + ":" + min;
	} else if (type == "hm") {
		return hour + ":" + min;
	} else {
		return y + "-" + m + "-" + d + " " + hour + ":" + min + ":" + sec;
	}
}
//section:版块名  column：栏目名  pagehtml:页面
function goto_search(section,pagehtml)
{
	open_w_anmation('search','widget://pub_html/search.html',{section:section,pagehtml:pagehtml});
}
function get_first_letter(str)
{
	return (str.substring(0,1)).toUpperCase();
}
function news_detail(id)
{
	request("/user/moment/detail",{values:{id:id}}, function(data, error)
	{
		var imageBrowser = api.require('imageBrowser');
		imageBrowser.openImages(
		{
		    imageUrls:data.moment.pictures,
		    showList:false,
		    bg:"#000000"

		});
	})
	return false;
	api.openFrame(
	{
		name:'group_news_detail',
		url:'../html/group_news_detail.html',
		rect:
		{
			x : 0,
			y : 0,
			w : api.winWidth,
			h : api.winHeight
		},
		bounces : true,
		pageParam:{id:id},
		bgColor : 'rgba(0,0,0,0)',
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		reload : true
	});
}
function moment_del(id)
{
	dialogBox.alert(
	{
		texts:
		{
			title: '确认',
			content: '确定删除动态吗？',
			leftBtnTitle: '取消',
			rightBtnTitle: '确认'
		},
		styles:
		{
			bg: '#fff',
			corner:5,
			w: 300,
			title:
			{
				marginT: 20,
				icon: 'widget://image/gif/cry.gif',
				iconSize: 40,
				titleSize: 14,
				titleColor: '#000'
			},
			content:
			{
				color: '#000',
				size: 14
			},
			left:
			{
				marginB: 7,
				marginL: 20,
				w: 130,
				h: 35,
				corner: 2,
				bg: '#e4e4e4',
				color:'#666666',
				size: 12
			},
			right:
			{
				marginB: 7,
				marginL: 10,
				w: 130,
				h: 35,
				corner: 2,
				bg: '#fa2e2f',
				color:'#ffffff',
				size: 12
			}
		},
		tapClose:true
	},function(ret)
	{
		if (ret.eventType == 'left')
		{
			dialogBox.close(
			{
				dialogName: 'alert'
			});
		}
		else if (ret.eventType == 'right')
		{
			show_doing();
			request("/user/moment/delete",{values:{id:id}}, function(data, error)
			{
				hide_doing();
				if(data.code==0)
				{
					$("#moment_"+id+"").remove();
					dialogBox.close(
					{
						dialogName: 'alert'
					});
				}
			})
		}
	});
}
function moment_zan(obj,id)
{
	if($(obj).find("img").attr("src")=="../image/icon/group/zan.png")//还没有点赞
	{
	    show_doing();
		request("/user/moment/praise",{values:{id:id}}, function(data, error)
		{
			hide_doing();
			if(data.code==0)
			{
				$(obj).find("img").attr("src","../image/icon/group/zan_act.png");
				request("/user/moment/detail",{values:{id:id}}, function(data, error)
				{
					if(is_define(data.moment.friendPraises))
					{
						$(obj).find(".zan_num").text(data.moment.friendPraises.length);
						$("#moment_"+id+" .zan_list").text((data.moment.friendPraises).join(",")+" 赞过").removeClass("dspn");
					}
					else
					{
						$(obj).find(".zan_num").text("");
						$("#moment_"+id+" .zan_list").text("").addClass("dspn");
					}
				})
			}
		})
	}
	else if($(obj).find("img").attr("src")=="../image/icon/group/zan_act.png")//还没有点赞
	{
	    show_doing();
		request("/user/moment/unpraise",{values:{id:id}}, function(data, error)
		{
			hide_doing();
			if(data.code==0)
			{
				$(obj).find("img").attr("src","../image/icon/group/zan.png");
				request("/user/moment/detail",{values:{id:id}}, function(data, error)
				{
					if(is_define(data.moment.friendPraises))
					{
						$(obj).find(".zan_num").text(data.moment.friendPraises.length);
						$("#moment_"+id+" .zan_list").text((data.moment.friendPraises).join(",")+" 赞过").removeClass("dspn");
					}
					else
					{
						$(obj).find(".zan_num").text("");
						$("#moment_"+id+" .zan_list").text("").addClass("dspn");
					}
				})
			}
		})
	}
}
function moment_comment(obj,id)
{
	dialogBox.input(
	{
	    keyboardType: 'default',
	    texts: {
	        title: '添加评论',
	        placeholder: '请输入评论内容',
	        leftBtnTitle: '取消',
	        rightBtnTitle: '确定'
	    },
	    styles:
	    {
	        bg: '#fff',
	        corner: 5,
	        w: 300,
	        h: 140,
	        title:
	        {
	            h: 30,
	            alignment: 'center',
	            size: 14,
	            color: '#000'
	        },
	        input: {
	            h: 53,
	            marginT: 4,
	            textSize: 14,
	            textColor: '#000',
	            alignment: 'left',
	            verticalCenter:false
	        },
	        dividingLine:
	        {             //（可选项）JSON对象；按钮与输入框之间的分割线的配置
       			width: 0.5,              //（可选项）数字类型；分割线粗细；默认：0.5
       			color: '#fff'         //（可选项）字符串类型；分割线颜色，支持rgb、rgba、#；默认：#696969
    		},
	        left: {
	            bg: 'rgba(0,0,0,0)',
	            color: '#007FFF',
	            size: 14,
	            h:40
	        },
	        right: {
	            bg: 'rgba(0,0,0,0)',
	            color: '#007FFF',
	            size: 14,
	            h:40
	        }
	    }
	},function(ret)
	{
	    if (ret.eventType=='left')
	    {
	        dialogBox.close(
	        {
	            dialogName: 'input'
	        });
	    }
	    else if(ret.eventType=='right')
	    {
	    	var text = ret.text;
	    	if(!is_define(text))
	    	{
	    		$toast("请输入评论内容");return false;
	    	}
	    	else
	    	{
				request("/user/moment/addcomment",{values:{id:id,content:text}}, function(data, error)
				{
					if(data.code==0)
					{
						request("/user/sns/user",{values:{'id':get_local("openid")}}, function(datas, error)
						{
							if(datas.code==0)
							{
								$("#moment_"+id+" .comments_list").append('<span class="w10 ovd ftz08 t-gra"><b class="t-18b4ed">'+datas.user.nickname+':</b>'+text+'</span>').removeClass("dspn");
								$("#moment_"+id+" .comment_num").text($("#moment_"+id+" .comments_list span").size());
							}
						});
					}
					else
					{
						$toast(ret.error);
					}
					dialogBox.close(
			        {
			            dialogName: 'input'
			        });
				})
			}
	    }
	});
}
function reply_moment_comment(obj,moment_id,comment_id,reply_name)
{
	dialogBox.input(
	{
	    keyboardType: 'default',
	    texts: {
	        title: '回复['+reply_name+']评论',
	        placeholder: '请输入回复内容',
	        leftBtnTitle: '取消',
	        rightBtnTitle: '确定'
	    },
	    styles:
	    {
	        bg: '#fff',
	        corner: 5,
	        w: 300,
	        h: 140,
	        title:
	        {
	            h: 30,
	            alignment: 'center',
	            size: 14,
	            color: '#000'
	        },
	        input: {
	            h: 53,
	            marginT: 4,
	            textSize: 14,
	            textColor: '#000',
	            alignment: 'left',
	            verticalCenter:false
	        },
	        dividingLine:
	        {             //（可选项）JSON对象；按钮与输入框之间的分割线的配置
       			width: 0.5,              //（可选项）数字类型；分割线粗细；默认：0.5
       			color: '#fff'         //（可选项）字符串类型；分割线颜色，支持rgb、rgba、#；默认：#696969
    		},
	        left: {
	            bg: 'rgba(0,0,0,0)',
	            color: '#007FFF',
	            size: 14,
	            h:40
	        },
	        right: {
	            bg: 'rgba(0,0,0,0)',
	            color: '#007FFF',
	            size: 14,
	            h:40
	        }
	    }
	},function(ret)
	{
	    if (ret.eventType=='left')
	    {
	        dialogBox.close(
	        {
	            dialogName: 'input'
	        });
	    }
	    else if(ret.eventType=='right')
	    {
	    	var text = ret.text;
	    	if(!is_define(text))
	    	{
	    		$toast("请输入评论内容");return false;
	    	}
	    	else
	    	{
				request("/user/moment/addcomment",{values:{id:moment_id,content:text,pid:comment_id}}, function(data, error)
				{
					if(data.code==0)
					{
						request("/user/sns/user",{values:{'id':get_local("openid")}}, function(datas, error)
						{
							if(datas.code==0)
							{
								$("#moment_"+moment_id+" .comments_list").append('<span class="w10 ovd ftz08 t-gra" tapmode="" onclick=reply_moment_comment(this,"'+moment_id+'","'+data.lastId+'","'+datas.user.nickname+'")><b class="t-18b4ed">'+datas.user.nickname+':</b> 回复<b class="t-999"> '+reply_name+' </b>'+text+'</span>').removeClass("dspn");
								$("#moment_"+moment_id+" .comment_num").text($("#moment_"+moment_id+" .comments_list span").size());
							}
						});
					}
					else
					{
						$toast(ret.error);
					}
					dialogBox.close(
			        {
			            dialogName: 'input'
			        });
				})
			}
	    }
	});
}
function moment_action(id,this_openid)
{
	var buttons=new Array();
	if(this_openid==get_local("openid"))
	{
		buttons.push("删除");
	}else{
		buttons.push("举报");
	}
	api.actionSheet(
	{
		title : '选择操作',
		cancelTitle : '关闭',
		buttons : buttons
	}, function(ret, err)
	{
		if(ret.buttonIndex==1)
		{
			if(this_openid==get_local("openid"))
			{
				moment_del(id);
			}
			else
			{
				open_w('report','widget://pub_html/report.html',{type:5,id:id});
			}
		}
	})
}
function goto_factory_srdz()
{
	is_login(function()
	{
		open_w('srdz','widget://factory/srdz.html')
	})
}
function goto_factory_cjzx()
{
	is_login(function()
	{
		open_w('cjzx','widget://factory/cjzx.html')
	})
}
function goto_adv(url,name)
{
	if(!is_define(name))
	{
		var name="";
	}
	open_w('adv','widget://pub_html/adv.html',{url:url,name:name});
}
function scroll_adv(arr)
{
	$("body").css("padding-top",parseInt(api.winWidth/2.5)+"px");
  	var adv_pic=new Array();
  	for(i=0;i<arr.length;i++)
  	{
  		adv_pic.push(oss_pic(arr[i].picture,960,320));
  		adv_action_type.push(arr[i].type);
  		adv_action_content.push(arr[i].content);
  	}
  	adv_scroll.open(
	{
		rect:{x:0,y:0,w:api.winWidth,h:parseInt(api.winWidth/2.5)},
		data:{paths:adv_pic},
		placeholderImg:adv_pic[0],
		contentMode:'scaleToFill',
		interval:5,
		auto:true,
		loop: true,
		fixedOn:api.frameName,
		fixed: false,
		styles:
		{
	        indicator:
	        {
	            align:'center',
	            color:'#fff',
	            activeColor:'#4FA4DD'
	        }
	    },
	},
	function(ret, err)
	{
		if(ret.status)
		{
			if(ret.eventType=='click')
			{
				advert_goto(adv_action_type[ret.index],adv_action_content[ret.index]);
			}
		}
	});
}
