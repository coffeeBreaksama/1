/*
 * 日期
 */
(function($) {
	/* 操作类型定义，定义成全局的函数，免得到处copy */
	var opTypeMap = {"700":"删除",  "100":"审核删除",  "250":"解除封禁",  "200":"审核通过",  "500":"增加",  "600":"修改",  "400":"驳回解封申请",  "300":"删除恢复",  "150":"封禁"};
	var randomimgserver = Math.floor(Math.random()*9+1);// random from 1-9
	var imgsize         = "http://imgsize.ph.126.net/?imgurl=%s_%sx%s.jpg"; // 相册提供的图片压缩服务，比有道的好很多……
	var timge           = "http://timge"+randomimgserver+".126.net/image?w=%s&h=%s&url=%s";
	var thumbnailmap  = {"PHOTO":1, "YOUDAO":2 ,"NONE":3};
	$.getOpType = function(val){
		var desc = opTypeMap[val];
		return (typeof desc === 'undefined') ? "未知操作" : desc;
	}

	/**
	 * 缩略图服务地址
	 * 目前已知有道和网易相册都提供了缩略图服务，为了方便切换，搞个统一的缩略图函数，返回缩略图地址
	 * url 要显示缩略图的图片url，必填，不能为空
	 * sizeVar 尺寸参数，可选，格式为字符串"widthxheight"，例如"180x120"
	 */
	$.getThumbnailURL = function(url, sizeVar, thumbnailtype){
		thumbnailtype=thumbnailtype||thumbnailmap.PHOTO;
		var width = 180, height = 125;
		var result = /^(\d+)x(\d+)$/i.exec(sizeVar);
		if(result != null){
			width  = result[1], height = result[2];
		}
		
		if(thumbnailtype==thumbnailmap.PHOTO){
			if(/^http:\/\/dream\.ph\.126\.net/i.test(url)){ // 梦幻人生的图片地址处理不了，用有道的
				return $.sprintf(timge, width, height, url);
			}else{
				return $.sprintf(imgsize, url, width, height);
			}
		}else if(thumbnailtype==thumbnailmap.YOUDAO){
			return $.sprintf(timge, width, height, url);
		}else if(thumbnailtype==thumbnailmap.NONE){
			return url;
		}
	}
	
    /**
     * 格式化时间, 不支持两位年份，一位月份，一位日等。。
     * @date   时间
     * @format 格式
     */
    $.formatTime = function(timeInMs, format){// 固定格式？吧。。。暂定吧，没找到合适的
    	if(timeInMs <= 0) {
    		return "N/A";
    	}
    	format = format || "yyyy-MM-dd HH:mm";
    	var ret = format;
    	var date = new Date(timeInMs);
    	var year  = date.getFullYear();
    	var month = date.getMonth()+1;
    	var day   = date.getDate();
    	var hours = date.getHours();
    	var min   = date.getMinutes();
    	var sec   = date.getSeconds();
    	
    	if(month < 10) month = '0'+month;
    	if(day < 10)   day   = '0'+day;
    	if(hours < 10) hours = '0'+hours;
    	if(min < 10)   min   = '0'+min;
    	if(sec < 10)   sec   = '0'+sec;
    	
    	var map = [];
    	map['yyyy'] = year;
    	map['MM']   = month;
    	map['dd']   = day;
    	map['HH']   = hours;
    	map['mm']	= min;
    	map['ss']	= sec;
    	for(var p in map){
    		ret = ret.replace(p, map[p]);
    	}
    	return ret;
    }
    
    /**
     * 字符串日期解析成long类型时间函数
     * 注意：
     * 
     * A. 仅支持3种时间格式，分别为
     * 1. yyyy-MM-dd
     * 2. yyyy-MM-dd HH:mm
     * 3. yyyy-MM-dd HH:mm:ss
     * 
     * B. 对输入数据没有做验证(例如输入2012-13-33也不会报错)，请自行保证输入正确
     * 
     * C. 如果时间格式错误，那么返回-1
     */
	$.parseTime = function(val) {
		var formats = [ 
		    /^(\d{4})-(\d{2})-(\d{2})$/, 
			/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/, 
			/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/ ];
		
		var time = -1;
		for ( var i = 0; i < formats.length; i++) {
			var list = val.match(formats[i]);
			if (list != null) {
				var year  = list[1];
				var month = list[2] - 1; // 月份的范围是0-11
				var day   = list[3];
				var hour  = (typeof list[4] === 'undefined') ? '0' : list[4];
				var minute= (typeof list[5] === 'undefined') ? '0' : list[5];
				var second= (typeof list[6] === 'undefined') ? '0' : list[6];
				time = new Date(year, month, day, hour, minute, second).getTime();
				break;
			}
		}
		return time;
	}
	
	/** 将请求字符串变成json对象 */
    $.getParamMap = function(url){
    	var map = {};
    	// 截取问号后面的字符串
    	var index = url.indexOf("?");
    	if(index == -1 || index == url.length-1){
    		return map;
    	}
    	url = url.substring(index+1);
    	var reg = /(\w+)=([^&#]*)/ig;// name=value, 应该不会有人使用特殊符号作为name吧？
    	var result = null;
    	while((result = reg.exec(url)) != null){
    		map[result[1]] = result[2];// result[0]是匹配到完整的字符串，然后后面就是每个group匹配到的内容
    	}
    	return map;
    }
    
    $.zip = function(input, maxlength){
		input = input || ""; 
		if(input.length <= maxlength){
			return input;
		}
		return input.substring(0, maxlength)+"...";
	}
    
	/** 
	 * 计算了字符宽度，英文字符的宽度为1，中文字符的宽度为2
	 * ("googa",4) -> goog..  ("字符截取调用",4) -> 字符..
	 * 判断高亮与否还是比较坑的，HTML标签占去了字符串长度，最好在服务端先做截断操作，再高亮显示
	 * 参见Utils类中的zipWithWidth方法
	 *  */
    $.zipWithWidth = function(input,maxlength,tail) {
    	
    	//有个比较蛋疼的地方，如果截断的字符串中有HTML标签(字符高亮)等情况，截断操作要多考虑一些,不要从HTML标签中间去截断
    	var startTag = input.indexOf("<");
    	var endTag = input.lastIndexOf(">");

    	if (endTag >= maxlength && startTag < maxlength) { // 截断正好在HTML标签中间
			maxlength = startTag; // 截取长度舍去HTML标签部分
		}
    	
    	if (maxlength == 0) {
			return "" + tail;
		}
    	
    	if(!tail) tail = "...";
    	var result = "";
    	var currentLength = 0;
    	for(var i =0;i<input.length;i++) {
    		result+=input[i];
    		//数字宽度为1
    		if(input[i].match(/['"<>&=-@ _a-zA-z0-9]/)) {
    			currentLength += 1;
    		}else {
    			currentLength +=2;
    		}
    		if(currentLength >=maxlength) {
    			break;
    		}
    	}
    	if(input.length > result.length) {
    		return result + tail;
    	}
        return result;
    }
    
    /*简单的判定是否合法ip，比较松的一个检测, 999.999.999.999也会被算作合法*/
    $.isValidIp = function(ip){
    	if(ip == null || ip == "0.0.0.0"){// 0.0.0.0也不算合法的ip
    		return false;
    	}else{
    		return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
    	}
    }
    
    $.isDigit = function(input){
    	input = input || "";
    	return /^-?\d+$/gi.test(input);
    }
    
    $.isBlank = function(input){
    	if(input == null) return true;
    	if(typeof input != 'string') return false;
    	return /^\s*$/gi.test(input);
    }
    
    $.getRandom = function(len){
    	var seed = new Array(
    	        'abcdefghijklmnopqrstuvwxyz',
    	        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    	        '0123456789'
    	       );
    	     
    	     var idx,i;
    	     var result = '';
    	     for (i=0; i<len; i++)
    	     {
    	      idx = Math.floor(Math.random()*3);
    	      result += seed[idx].substr(Math.floor(Math.random()*(seed[idx].length)), 1);
    	     }

    	     return result;
    }
    
    /** 返回[0-max)的随机整数 */
    $.random = function(max){
    	return Math.floor(Math.random()*max);
    }
    
    /** 简直就要被xss代码烦死了 */
    $.escape = function(unsafe) {
        if(!unsafe) return "";
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /** 去除输入文本的html格式 */
    $.plainText = function(input){
        if(typeof input !== 'string'){
            return '';
        }else{
            return input.replace(/<[^>]+>/g, '');
        }
    }
    
    /**
     * 读取文件的完整地址..传入的是一个file input对象
     */
    $.getFilePath=function(fileBrowser){
    	　 if (navigator.userAgent.indexOf("MSIE")!=-1) {
     　　　　　　　 return fileBrowser.value
 	   　　　 } else　if (navigator.userAgent.indexOf("Firefox")!=-1　|| navigator.userAgent.indexOf("Mozilla")!=-1)    {
 	  　　　　　　  try {    　　　　　　　
		    	     netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
			      }catch(e){
			    	  return "";  　　　
			      } 
			      return fileBrowser.value;
 	   　　　 } else { 
 	  　　　　　　　return "";  
 	     }
    }
    
    /**
     * 将文本中的地址替换成html链接
     */
    $.linkify = function(text) {
        var pattern = /(https?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        return text.replace(pattern,"<a href='$1' target='_blank'>$1</a>"); 
    }
    
    $.cleanFontTag = function(text){
    	if(typeof text === 'undefined'){
    		return text;
    	}else{
    		return text.replace(/<\/?font.*?>/gi, '');
    	}
    }
})(jQuery);

/**
 * jquery.readmore - Substring long paragraphs and make expandable with "more" link
 * @date 7 July 2010
 * @author Jake Trent  https://github.com/jaketrent/jquery-readmore
 * @version 1.1
 */
(function ($) {
  $.fn.readmore = function (settings) {

    var opts =  $.extend({}, $.fn.readmore.defaults, settings);

    this.each(function () {
      $(this).data("opts", opts);
      if ($(this).html().length > opts.substr_len) {
        abridge($(this));
        linkage($(this));
      }
    });

    function linkage(elem) {
      elem.append(elem.data("opts").more_link);
      elem.children(".more").click( function () {
        $(this).hide();
        $(this).siblings("span:not(.hidden)").hide().siblings("span.hidden").animate({'opacity' : 'toggle'},1000);
      });
    }

    function abridge(elem) {
      var opts = elem.data("opts");
      var txt = elem.html();
      var len = opts.substr_len;
      var dots = "<span>" + opts.ellipses + "</span>";
      var shown = txt.substring(0, len) + dots;
      var hidden = '<span class="hidden" style="display:none;">' + txt.substring(len, txt.length) + '</span>';
      elem.html(shown + hidden);
    }
    
    return this;
  };

  $.fn.readmore.defaults = {
    substr_len: 500,
    ellipses: '&#8230;',
    more_link: '<a class="more">Read&nbsp;More</a>'
  };

})(jQuery);

/*
 * 水印阿哈哈哈
 * Version: Beta 1
 * Release: 2007-06-01
 */ 
(function($) {
	var map=new Array();
	$.Watermark = {
		ShowAll:function(){
			for (var i=0;i<map.length;i++){
				if(map[i].obj.val()==""){
					map[i].obj.val(map[i].text);					
					map[i].obj.css("color",map[i].WatermarkColor);
				}else{
				    map[i].obj.css("color",map[i].DefaultColor);
				}
			}
		},
		HideAll:function(){
			for (var i=0;i<map.length;i++){
				if(map[i].obj.val()==map[i].text)
					map[i].obj.val("");					
			}
		}
	}
	
	$.fn.Watermark = function(text,color) {
		if(!color)
			color="#aaa";
		return this.each(
			function(){		
				var input=$(this);
				var defaultColor=input.css("color");
				map[map.length]={text:text,obj:input,DefaultColor:defaultColor,WatermarkColor:color};
				function clearMessage(){
					if(input.val()==text)
						input.val("");
					input.css("color",defaultColor);
				}

				function insertMessage(){
					if(input.val().length==0 || input.val()==text){
						input.val(text);
						input.css("color",color);	
					}else
						input.css("color",defaultColor);				
				}

				input.focus(clearMessage);
				input.blur(insertMessage);								
				input.change(insertMessage);
				
				insertMessage();
			}
		);
	};
})(jQuery);

/**
 * sprintf and vsprintf for jQuery
 * somewhat based on http://jan.moesen.nu/code/javascript/sprintf-and-printf-in-javascript/
 * 
 * Copyright (c) 2008 Sabin Iacob (m0n5t3r) <iacobs@m0n5t3r.info>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details. 
 *
 * @license http://www.gnu.org/licenses/gpl.html 
 * @project jquery.sprintf
 */
(function($){
	var formats = {
		'b': function(val) {return parseInt(val, 10).toString(2);},
		'c': function(val) {return String.fromCharCode(parseInt(val, 10));},
		'd': function(val) {return parseInt(val, 10);},
		'u': function(val) {return Math.abs(val);},
		'f': function(val, p) {
			p = parseInt(p, 10); 
			val = parseFloat(val);
			if(isNaN(p && val)) {
				return NaN;
			}
			return p && val.toFixed(p) || val;
		},
		'o': function(val) {return parseInt(val, 10).toString(8);},
		's': function(val) {return val;},
		'x': function(val) {return ('' + parseInt(val, 10).toString(16)).toLowerCase();},
		'X': function(val) {return ('' + parseInt(val, 10).toString(16)).toUpperCase();}
	};

	var re = /%(?:(\d+)?(?:\.(\d+))?|\(([^)]+)\))([%bcdufosxX])/g;

	var dispatch = function(data){
		if(data.length == 1 && typeof data[0] == 'object') { //python-style printf
			data = data[0];
			return function(match, w, p, lbl, fmt, off, str) {
				return formats[fmt](data[lbl]);
			};
		} else { // regular, somewhat incomplete, printf
			var idx = 0; 
			return function(match, w, p, lbl, fmt, off, str) {
				if(fmt == '%') {
					return '%';
				}
				return formats[fmt](data[idx++], p);
			};
		}
	};

	$.extend({
		sprintf: function(format) {
			var argv = Array.apply(null, arguments).slice(1);
			return format.replace(re, dispatch(argv));
		},
		vsprintf: function(format, data) {
			return format.replace(re, dispatch(data));
		}
	});
})(jQuery);


/**
 * http://lions-mark.com/jquery/scrollTo/
 * 控制元素的滚动条
 */
(function($){
	$.fn.scrollTo = function( target, options, callback ){
		  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
		  var settings = $.extend({
		    scrollTarget  : target,
		    offsetTop     : 50,
		    duration      : 500,
		    easing        : 'swing'
		  }, options);
		  return this.each(function(){
		    var scrollPane = $(this);
		    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
		    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
		    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
		      if (typeof callback == 'function') { callback.call(this); }
		    });
		  });
		}
})(jQuery);

jQuery.download = function(url, data, method){
	if( url && data ){ 
		data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function(){ 
			var pair = this.split('=');
			inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
		});
		//send request
		jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
		.appendTo('body').submit().remove();
	};
};


// 注册ajax错误事件
$(document).ready(function(){
	$("body").ajaxError(function(){
		$.hideLoading();
		logger.error("请求发生异常!")
	});
})

String.prototype.endWith=function(str){
	var reg=new RegExp(str+"$");    
	return reg.test(this);        
}

String.prototype.startWith=function(str){
	var reg=new RegExp("^"+str);    
	return reg.test(this);   
}