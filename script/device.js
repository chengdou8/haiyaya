//扫描
function d_scan(callback,sound)//c1为成功回调,c2为取消回调,c3为失败回调
{
	if(!is_define(sound))
	{
		var sound="";
	}
	var obj = api.require('FNScanner');
	obj.openScanner(
	{
	    sound:sound,
	    autoLight: true,
	    saveToAlbum: false,
	    autorotation:true,
	    saveImg: {
	        path: '',
	        w: 200,
	        h: 200
	    }
	}, function(ret) 
	{
	     if(ret)
	     {
	     	if(ret.eventType=="success")
	     	{
		        if(is_define(callback))
		        {
		        	callback(ret.content);
		       	}
			}
			else if(ret.eventType=="cancel")
			{
				$toast('取消扫码');
			}
			else if(ret.eventType=="fail")
			{
				$toast('扫码失败');
			}
	     }
	});
	return false;
}
//生成二维码或者条码，type=bar_image为条码,type=qr_image为二维码
function d_make_code(content,type,callback)
{
	if(!is_define(type))
	{
		var type="qr_image";
	}
	var obj = api.require('FNScanner');
	obj.encodeImg({
	    type:type,
	    content:content,
	    saveToAlbum: true
	},
	function(ret)
	{
	    if(ret.status)
	    {
	        if(is_define(callback))
	        {
	        	callback(ret.albumPath);
	        }
	        else
	        {
	        	$toast('生成成功，已经保存到相册');
	        }
	    }
	});
}
function d_card_credit()
{
	var obj = api.require('cardReader');
	obj.open(function(ret,err)
	{
	    if(ret.status)
	    {
	    	$alert(json2str(ret));
	    }
	    else
	    {
	        $toast("扫描失败");
	    }
	});
}
function d_set_clip(v)
{
	if(is_define(v))
	{
		var trip="复制到剪切板成功";
	}
	else
	{
		var trip="操作失败";
	}
	var obj = api.require('clipBoard');
	obj.set(
	{
	    value:v
	},
	function(ret, err)
	{
	    if(ret.status)
	    {
	    	$toast(trip);
	    }
	    else
	    {
	    	$toast('操作失败');
	    }
	});
}
function d_get_clip(callback)
{
	var obj = api.require('clipBoard');
	obj.get(function(ret, err)
	{
		if(ret.value&&is_define(callback))
		{
			callback(ret.value);
		}
	});
}
function d_start_record()
{
	api.startRecord();
	var html="<div id='voice_record_button' onclick=d_end_record(d_play_voice) class='w30e h30e area_auto tx-c uc-a03 c-999 pd10'><img src='../image/icon/sdk/microphone.png' class='w30e h30e'></div>";
	$("body").append(html);
}
function d_end_record(callback)
{
	$("#voice_record_button").remove();
	api.stopRecord(function(ret,err)
	{
        if (ret)
        {
        	callback(ret.path);
        }
    });
}
function d_play_voice(path,callback)
{
	api.startPlay(
	{
    	path:path
	},function()
	{
		if(is_define(callback))
		{
			callback('播放完成');
		}
	});
}
function d_play_video(path)
{
	api.openVideo(
	{
    	url:path
	});
}
//打开联系人
function d_contact(callback)
{
	api.openContacts
	(
	    function(ret,err)
	    {
	        if(ret.status)
	        {
	        	if(is_define(callback))
	        	{
	        		callback(ret.name,ret.phone);
	        	}
	        }  
	    }
	);
}
//返回安卓桌面
function d_back_desk()
{
	if(get_os()=='android')
	{
		api.toLauncher();
	}
}
//指纹识别
function d_touch_id(callback_s,callback_e)
{
	var obj = api.require('touchID');
	obj.verify(
	function(ret,err){
	    if(ret.status)
	    {
	    	if(is_define(callback_s))
	    	{
	        	callback_s();
	        }
	    }
	    else
	    {
	    	if(is_define(callback_e))
	    	{
		        if(ret.index==0)//手动输入密码
		        {
		        	callback_e('密码输入正确');
		        }
		        else if(ret.index==1)//用户取消验证
		        {
		        	callback_e('取消验证');
		        }
		        else if(ret.index==2)//验证三次失败
		        {
		        	callback_e('验证失败');
		        }
		        else if(ret.index==3)//多长验证失败请锁定手机
		        {
		        	callback_e('多次验证失败,锁定手机');
		        }
		        else
		        {
		            callback_e('其他错误提示');
		        }
			}
	    }
	});
}
//锁屏
function d_lock_screen(is_modify)
{
	if(get_os()=="ios")
	{
		if(!is_define(is_modify))
		{
			var is_modify=0;
		}
		api.openWin(
		{
		    name: 'lock_screen',
		    slidBackEnabled:false,
		    url: 'widget://pub_html/lock_screen.html',
		    pageParam:{is_modify:is_modify}
		});
	}
	else
	{
		if(is_define(get_local("lock_pass")))
		{
			if(is_define(is_modify))//修改密码
			{
				var screenLock = api.require('screenLock');
				screenLock.show(
				{
					color:'#000000'
				},
				function(ret,err)
				{
					if(ret.status==111)
					{
						screenLock.set(
						{
							color:'#000000'
						},
						function(ret,err)
						{
							if(ret.status==111)
							{
								set_local("lock_pass","coolfull");
							}
						});
					}
				});
			}
			else//验证密码
			{
				var screenLock = api.require('screenLock');
				screenLock.show(
				{
					color:'#000000'
				},
				function(ret,err)
				{
					api.alert({msg:''+ret.status});
				});
			}
		}
		else//设置密码
		{
			var screenLock = api.require('screenLock');
			screenLock.set(
			{
				color:'#000000'
			},
			function(ret,err)
			{
				if(ret.status==111)
				{
					set_local("lock_pass","coolfull");
				}
			});
		}
	}
}
function d_pdf(value)
{
	var obj = api.require('pdfReader');
	obj.open(
	{
	    path:value
	});
}
function d_screen()
{
	var obj = api.require('screenClip');
	obj.screenShot(
	{
		album:true
	}
	,function(ret, err)
	{
	    if(ret.status)
	    {
	        $toast("截图完成");
	    }
	});
}
function d_zip(arr,pass,path)
{
	if(!is_define(pass))
	{
		var pass="";
	}
	if(!is_define(path))
	{
		var path="";
	}
	var obj=api.require('zip');
	obj.archive(
	{
	    password:pass,
	    files:arr,
	    toPath:path
	},
	function(ret,err)
	{
	    if(ret.status)
	    {
	        $toast("压缩成功");
	    }
	    else
	    {
	        $toast("压缩失败");
	    }
	});
}
function d_unzip(file,pass,path)
{
	if(!is_define(pass))
	{
		var pass="";
	}
	if(!is_define(path))
	{
		var path="";
	}
	var obj = api.require('zip');
	obj.unarchive(
	{
	    file:file,
	    password:pass,
	    path:path
	},function(ret,err)
	{
	    if(ret.status)
	    {
	    	 $toast("解压成功");
	    }
	    else
	    {
	        $toast(err.msg);
	    }
	});
}
function d_dir(callback)
{
	var fb = api.require('fileBrowser');
	fb.open( 
	function(ret,err)
	{
		if(is_define(callback))
		{
			callback(ret.url);
		}
		fb.close();
	})
}
function d_office(path)
{
	var obj = api.require('docReader');
	obj.open(
	{
	    path:path
	});
}