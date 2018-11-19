//定义数据服务器地址
var serverURL = "http://raf.zv100.cn/api/api.php";
//设置本地存储
function set_local(key,val)
{
	$api.setStorage(key,val);
	//set_local(key, val);
}
//获取本地存储
function get_local(key)
{
	return $api.getStorage(key);
	//return get_local(key);
}
//json转字符串
function json2str(j)
{
	return JSON.stringify(j);
}
//字符串转json
function str2json(s)
{
	var json = eval('(' + s + ')');
	return json;
}
//是否是json对象
function is_json(obj) {
	var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isjson;
}
//判断字符串是否在array中
function in_array(stringToSearch, arrayToSearch)
{
 	for(s=0;s<arrayToSearch.length;s++)
	{
  		thisEntry = arrayToSearch[s].toString();
  		if(thisEntry == stringToSearch)
		{
   			return true;
  		}
 	}
 	return false;
}
/*
 *Loading
 */
function loading(time) {
	var str = "";
	str += '<div id="zv_Loading"></div><div id="zv_main"></div><div id="Loadbox">';
	str += '<div class="LoadBoxList">';
	str += '<div id="loadbg"><img src="../image/nobg.png" style="width:5em; height:5em"></div>';
	str += '<div id="loadingimgbox"><img src="../image/logo.png" id="loadingimg"></div>';
	str += '<div id="loadingimgboxtxt">加载中...</div>';
	str += '</div>';
	str += '</div>';
	var d = document.createElement('DIV');
	d.innerHTML = str;
	document.body.appendChild(d);
	if (parseInt(time) < 0) {
		document.getElementById("zv_main").style.display = "none";
		document.getElementById("Loadbox").style.display = "none";
		//fadeEffect.init('fadeIn', 1)
	}
	if (parseInt(time) == 0) {
		document.getElementById("zv_main").style.display = "block";
		document.getElementById("Loadbox").style.display = "block";
	}
	if (parseInt(time) > 0) {
		document.getElementById("zv_main").style.display = "block";
		document.getElementById("Loadbox").style.display = "block";
		setTimeout(function()
		{
			$api.css($api.byId("content"),"display:block");
			document.getElementById("zv_main").style.display = "none";
			document.getElementById("Loadbox").style.display = "none";
			//fadeEffect.init('fadeIn', 20)
		},time);
	}
}
/**
 * 判断是否是空
 * @param value
 */
function is_define(value)
{
	if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof (value) == 'undefined')
	{
		return false;
	}
	else
	{
		value = value + "";
		value = value.replace(/\s/g, "");
		if (value == "")
		{
			return false;
		}
		return true;
	}
}
//控制只能输入小数
//控制只能输入小数
function input_float(v)
{
    for(var i = v.value.length; i > 0; i--)
    {
        if(!/^\d*(\.\d*)?$/.test(v.value[i]))
        {
	        if(!/^\d*\.?\d{0,2}$/.test(v.value))//只能输入两位小数
	        {
	        	$toast("输入值必须大于0");
	            v.value=v.value.substr(0,v.value.length-1);
	        }
	    }
    }
}
//控制只能输入整数
function input_int(v)
{
    v.value= v.value.replace(/[^\d]/g,'');
}
//是否手机号码
function is_mobile(v)
{
	var reg=/^0{0,1}(13[0-9]|18[0-9]|17[0-9]|14[0-9]|15[0-9]|16[0-9]|19[0-9])[0-9]{8}$/;
	return reg.test(v);
}
/**
 * 根据时间戳获取年、月、日
 * @param String str 时间戳
 * @param Boolean f 是否在原来的基础上*1000，true要*，false或不填就不*
 */
function timetostr(str,f)
{
	var t=(f)?parseInt(str):parseInt(str)*1000;
	var datetime=new Date(t);
	var y=datetime.getFullYear();
	var m=num_two(datetime.getMonth()+1);
	var d=num_two(datetime.getDate());
	var hour=num_two(datetime.getHours());
	var min=num_two(datetime.getMinutes());
	var sec=num_two(datetime.getSeconds());
	return y+"-"+m+"-"+d+" "+hour+":"+min+":"+sec;
}
function num_two(s)//自动补零
{
	return (parseInt(s)>9)?s:'0'+s;
}
function log(s)//控制台日志
{
	console.log(s);
}
function emoji(emoMsg)
{
	if (is_define(emoMsg))
	{
		var emoPath, transMsg;
		var reg = /\[(.*?)\]/gm;
		transMsg = emoMsg.replace(reg, function(match)
		{
			for (var i = 0, len = emotionJson.length; i < len; i++)
			{
				if (emotionJson[i].text === match)
				{
					emoPath = '../image/sdk/chat/emotion/' + emotionJson[i].name + '.png';
					return '<img width="20" height="20" src="' + emoPath + '" />'
				}
			}
			return match;
		});
		return transMsg;
	} else {
		return emoMsg;
	}
}
function scroll_to(id)
{
	window.location.hash = "#" + id;
}

function km_m(m)
{
	if(m>1000)
	{
		return (m/1000).toFixed(2)+"km";
	}
	else
	{
		return m.toFixed(2)+"m";
	}
}
function is_code(idCard)//身份证是否正确
{
	//15位和18位身份证号码的正则表达式
 	var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
	//如果通过该验证，说明身份证格式正确，但准确性还需计算
 	if(regIdCard.test(idCard))
 	{
  		if(idCard.length==18)
  		{
   			var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
   			var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
   			var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
   			for(var i=0;i<17;i++)
   			{
    			idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
   			}
   			var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
   			var idCardLast=idCard.substring(17);//得到最后一位身份证号码
   			//如果等于2，则说明校验码是10，身份证号码最后一位应该是X
   			if(idCardMod==2)
   			{
    			if(idCardLast=="X"||idCardLast=="x")
    			{
    				return true;
    			}
    			else
    			{
    				return false;
    			}
   			}
   			else
   			{
    			//用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
    			if(idCardLast==idCardY[idCardMod])
    			{
    				return true;
    			}
    			else
    			{
    				return false;
    			}
   			}
  		}
 	}
 	else
 	{
    	return false;
 	}
}
function url_change(v)
{
	var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
	v = v.replace(reg, "<a tapmode='' href='javascript:;' onclick=goto_adv('$1$2')>$1$2</a>").replace(/\n/g, "<br />");
	return v;
}
function is_number(String)
{
	var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
	if(!re.test(String))
	{
		return false;
	}
	else
	{
		return true;
	}
}
function clear_html(s)
{
	var dd=s.replace(/<\/?.+?>/g,"");
 	dd=dd.replace(/ /g,"");//dds为得到后的内容
	dd=dd.replace(/[ ]/g,"");
	dd=dd.replace(/\ +/g,"");//去掉空格
	dd=dd.replace(/\r\n/g,"");
	dd=dd.replace(/\n/g,"");
	return dd;
}
