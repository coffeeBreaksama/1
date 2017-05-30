/*
    logger tool，打印一些提示信息
    weiqiang.yang@2010-02-28
    
    需要
    1. logger.css(或者自行将以下内容添加到css文件中)
        .logz{position: absolute; padding-top: 4px; height: 24px; top: 43px; text-align: left; z-index:1024;}
        .logi{display:block; background-color:#ffffae; width:200px; padding:2px; margin:5px;}
    2. images目录下的图片文件
        var __images = {'ok':'/images/icon_ok.gif', 'info':'/images/ico_info.gif', 'error':'/images/ico_error.gif', 'debug':'/images/ico_info.gif', 'warn':'/images/ico_info.gif'};
    
*/
( function() {
    var NAMESPACE = 'logger';
    var __options = {timeout:1000, width:200, delay:300, maxlog:3};
    var __msgZone;
    var __index = 0;
    var __count = 0;
    var __idPfrefix = "$LOGGER-";
    var __images = {'ok':'/images/icon_ok.gif', 'info':'/images/ico_info.gif', 'error':'/images/ico_error.gif', 'debug':'/images/ico_info.gif', 'warn':'/images/ico_info.gif'};
    
    var debug = function(_msg){
        __appendMsg(_msg, 'debug');
    }
    var ok = function(_msg){
        __appendMsg(_msg, 'ok');
    }
    var info = function(_msg){
         __appendMsg(_msg, 'info');
    }
	var warn = function(_msg){
		__appendMsg(_msg, 'warn');
	}
    var error = function(_msg){
         __appendMsg(_msg, 'error');
    }
    
    var __init = function(){
        if(!__msgZone){
            __msgZone = document.createElement('div');
			__msgZone.className = 'logz';// setAttribute('className', xxx), setAttribute('class', xxx)... 还是className通用
            //__msgZone.style.left = (document.body.clientWidth-__options.width)/2 +'px';
            __msgZone.style.top = document.documentElement.scrollTop + 25 + 'px';
            document.body.appendChild(__msgZone);
        }
    }
    
    var __appendMsg = function(_msg, _type){
        __init();
        var _id = __idPfrefix+__index;
        var _span = document.createElement('span');
        _span.setAttribute('id', _id);
		_span.className = 'logi';
        _span.innerHTML = '<img src="'+__images[_type]+'" alt="'+_type+'"/> '+_msg;
        __msgZone.insertBefore(_span, __msgZone.firstChild);
        __msgZone.style.top = document.documentElement.scrollTop + 25 + 'px';
        
        __index++;
        __count++;
        if(__count > __options.maxlog){
        	__remove(__idPfrefix+(__index - __options.maxlog));
        }
        var _f = function(){__remove(_id);}
		var _timeout = __options.timeout + (__count * __options.delay);/*加个delay是如果瞬间出现了多个log，那么控制删除的速度*/
        setTimeout(_f, _timeout);
    }
    
    var __remove = function(_id){
        var _node = document.getElementById(_id);
        if(!!_node){
        	__count --;	
        	__msgZone.removeChild(_node);
        }
    }
    
    /*注册全局的对象*/
    window[NAMESPACE] = {};
    window[NAMESPACE].ok = ok;
    window[NAMESPACE].debug = debug;
    window[NAMESPACE].info = info;
    window[NAMESPACE].warn = warn;
    window[NAMESPACE].error = error;
})();