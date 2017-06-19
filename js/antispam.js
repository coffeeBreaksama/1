/*
 * Antispam Module JS
 */
//邮件聚类审核 ，审核操作前，判断URL长度，当长度小于10或13（顶级域名）时，弹出提醒，确定则继续审核提交，取消则审核忽略
//再以上基础上，当确认要入库时，需要选择入库危险分类，主要用在普通聚类审核的URL分类上
function shortUrlSpecDealScript(pageId, tempid, urlLengthOk, url, objSrc, mailinFlg){
    var libOption = jQuery.trim(jQuery(objSrc).parent().parent().find('input:radio:checked').not(objSrc).nextAll('span:first').text());
    var isUrlFlag = (libOption == 'URL'); //当入库类型为URL类型时才判断
    var yesNo = true;
    if(isUrlFlag){
    	if(urlLengthOk == "false"){
    	    var optionText = jQuery.trim(jQuery(objSrc).nextAll('span:first').text());
    	    yesNo = confirm("由于当前URL：'" + url + "'太短或地址属于网易等原因入库有风险，\r\n确定审核为'" + optionText + "'吗！？");
    	    if(!yesNo){
    	    	var objName = objSrc.name;
    	        var radioObjS = jQuery('input[name='+objName+']');
	        	radioObjS.each(function(){
		        	if (jQuery(this).val() == 5){
		        		jQuery(this).attr("checked",true);
		        		return false;
		        	}
			    });
		    }
	    }
    	showReason(pageId,tempid,objSrc.value,yesNo && mailinFlg);
    }
}

//邮件聚类审核 ，审核操作前，判断URL长度，当长度小于10或13（顶级域名）时，弹出提醒，确定则继续审核提交，取消则审核忽略
function shortUrlSpecDeal(urlLengthOk, url, objSrc){
    var libOption = jQuery.trim(jQuery(objSrc).parent().find('input:radio:checked').not(objSrc).nextAll('span:first').text());
    var isUrlFlag = (libOption == 'URL'); //当入库类型为URL类型时才判断
    var yesNo = true;
    if(isUrlFlag){
    	if(urlLengthOk == "false"){
    	    var optionText = jQuery.trim(jQuery(objSrc).nextAll('span:first').text());
    	    yesNo = confirm("由于当前URL：'" + url + "'太短或地址属于网易等原因入库有风险，\r\n确定审核为'" + optionText + "'吗！？");
    	    if(!yesNo){
    	    	var objName = objSrc.name;
    	        var radioObjS = jQuery('input[name='+objName+']');
	        	radioObjS.each(function(){
		        	if (jQuery(this).val() == 5){
		        		jQuery(this).attr("checked",true);
		        		return false;
		        	}
			    });
		    }
	    }
    }
}

//审核页面设置选中忽略分类，当审核选项已选择则略过此设置
var setSkip = function(currentDiv,skipVal) {
	var radioObjS = jQuery('#'+currentDiv).find('input:radio');
	radioObjS.each(function() {
		var theSkip = jQuery(this);
		if (theSkip.val() == skipVal) {
			setGroupRadioVal(currentDiv,theSkip);
		}
	});
}

// 审核页面入库选项设置指定值
var setLibRadioCheck = function(currentDiv,val){
    var radioObjS = jQuery('#'+currentDiv).find('input:radio');
    radioObjS.each(function(){
        var libRadio = jQuery(this);
        if (libRadio.val() == val){
            var name = libRadio.attr('name');
            var radioObjSGroup = jQuery('#'+currentDiv).find('input[name='+name+']');
            radioObjSGroup.each(function(){
                if(jQuery(this).val() != val && jQuery(this).attr('checked')){
                    jQuery(this).attr('checked', false);
                }
            });
            libRadio.attr('checked', true);
        }
    });
}

//统计信息展示图表页面
function showLineChart(xml,swfName,div){
	var chart = new FusionCharts("../js/FusionChartsFree/Charts/FCF_"+swfName+".swf", "ChartId", "850", "350");
	chart.setTransparent(true);
    chart.setDataXML(xml);
    chart.render(div);
}

/**********************************************以下自动登出功能***************************************************************/
//var timeout = 2*60*60;//失效间隔
var timeout = 60*60;
//每间隔1秒判断
var logout = function(){
	var occurtime = jQuery('#occurtime', window.parent.frames['header-frame'].document).text();
	var a = parseInt(new Date().getTime() - parseInt(occurtime));   
	jQuery('#time', window.parent.frames['header-frame'].document).text(parseInt(a/1000));
	if(parseInt(a/1000) >= parseInt(timeout)){
		clearInterval(st);
		alert("您的登录已超时, 请点确定后重新登录!");
		//window.parent.document.location.href = jQuery('#logoutLink', window.parent.frames['header-frame'].document).attr('href');
		//window.location.href = "https://220.181.72.109:8181/GeneralAdminIn/";
		return false;
	}   
}

//新的请求发生时重新设置时间
var resetOccurtime = function(){
	if(window.parent.frames['header-frame'] != null){
		jQuery('#occurtime', window.parent.frames['header-frame'].document).text(new Date().getTime()+"");
	}
}

/**********************************************以下菜单控制按钮*********************************************************/
var tMenu = function(oSrc){
	if(jQuery(oSrc).attr('alt') == 'close'){
		jQuery(oSrc).attr('src', 'images/r_menu.png');
		jQuery(oSrc).attr('alt', 'show');
		jQuery(oSrc).attr('title', '展开菜单');
		window.parent.document.getElementById('frame-body').cols = '0,10,1180';
	}else{
		jQuery(oSrc).attr('src', 'images/l_menu.png');
		jQuery(oSrc).attr('alt', 'close');
		jQuery(oSrc).attr('title', '隐藏菜单');
		window.parent.document.getElementById('frame-body').cols = '160,10,1020';
	}
}

var controlMouseOver = function(oSrc){
	if (jQuery(oSrc).attr('alt') == 'close') {
		jQuery(oSrc).attr('src', 'images/l_menu_r.png');
	}
	if (jQuery(oSrc).attr('alt') == 'show') {
		jQuery(oSrc).attr('src', 'images/r_menu_r.png');
	}	
}

var controlMouseout = function(oSrc){
	if (jQuery(oSrc).attr('alt') == 'close') {
		jQuery(oSrc).attr('src', 'images/l_menu.png');
	}
	if (jQuery(oSrc).attr('alt') == 'show') {
		jQuery(oSrc).attr('src', 'images/r_menu.png');
	}
}

/********邮件元信息是否从外发同步至进信提醒********/
var needSyncToMailin = function(oSrc){
	if(jQuery(oSrc).attr('checked')){
		if(confirm('确定要同步至收信吗?')){
			jQuery(oSrc).attr('checked', 'checked');
		}else{
			jQuery(oSrc).attr('checked', '');
		}
	}
}

/** ******邮件批量设置审核值******* */
var setCheckVal = function(currentDiv,checkVal) {
	var radioObjS = jQuery('#'+currentDiv).find('input:radio');
	radioObjS
			.each(function() {
				var radio = jQuery(this);
				if (checkVal == 0 && radio.val() == checkVal) {
					if (radio.next().text().indexOf('正常') == -1) {
						return true;
					} else {
						setGroupRadioVal(currentDiv, radio);
					}
				} else if (checkVal == 1 && radio.val() == checkVal) {
					if (radio.next().text().indexOf('文本') != -1) {
						return true;
					} else {
						setGroupRadioVal(currentDiv, radio);
					}
				} else if (checkVal == -255) {
					if (radio.val() == -20
							|| (radio.val() == 0 && radio.next().text()
									.indexOf('正常') == -1)
							|| (radio.val() == 1 && radio.next().text()
									.indexOf('文本') != -1)) {
						return true;
					} else {
						radio.attr('checked', false);
					}
				} else {
					if (radio.val() == checkVal) {
						setGroupRadioVal(currentDiv, radio);
					}
				}
			});
}

/** ******邮件脚注批量设置审核值******* */
var setFooterCheckVal = function(currentDiv,checkVal) {
	var radioObjS = jQuery('#'+currentDiv).find('input:radio');
	radioObjS
			.each(function() {
				var radio = jQuery(this);
				if (radio.val() == checkVal) {
					setGroupRadioVal(currentDiv, radio);
				} else if (checkVal == -255) {
					radio.attr('checked', false);
				} else {
					if (radio.val() == checkVal) {
						setGroupRadioVal(currentDiv, radio);
					}
				}
			});
}

/**
 *  邮件批量设置审核值 并记录是否是批量选择，下次重选时只重置批量的部分
 *  作用页面：聚类审核与非重要聚类审核
 */
var setCheckVal4ReCheck = function(currentDiv,checkVal) {
	var radioObjS = jQuery('#'+currentDiv).find('input:radio');
	radioObjS.each(function() {
		var radio = jQuery(this);
		var bmark = radio.parent().next();// 用于标记是否批量选择
		if (bmark.val() == 1) {// 如果被标记了说明是人工选择
		} else {// 没有标记即没选择或批量选择
			if (radio.val() == checkVal) {// 是所要批量设置的对象则check上，否则无视
				radio.attr('checked', true);
			}
		}
	});
}
/**
 * 批量设置并记录
 */
var setHiddenTxt4ReCheck = function(o) {
	jQuery(o).parent().next().val(1);
}

/** ******同组的radio判断是否已选中,未选中则选中自己******* */
var setGroupRadioVal = function(currentDiv, radio) {
	var name = radio.attr('name');
	var radioObjSGroup = jQuery('#'+currentDiv).find('input[name='+name+']');
	var flag = "";
	radioObjSGroup.each(function() {
		if (jQuery(this) != radio && jQuery(this).attr('checked')) {
			flag += "true";
		}
	});
	if (flag == "") {
		radio.attr('checked', true);
	}
	flag = "";
}

/** ******特征历史元信息查看内容关键字******* */
var showContentKeywords = function(element) {
	jQuery(element).next().text(jQuery(element).attr('id'));
	jQuery(element).text('');
}
var showContentKeywordsX = function(element, content) {
	jQuery(element).next().text(content);
	jQuery(element).text('');
}
var markEml = function(element, content) {
	showContentKeywordsX(element, content);
	jQuery(element).closest("tr").addClass("done");
}

/** ******自定义规则类型转换脚本******* */
var shiftCustomizeRule = function(obj,type) {
	if (type == 0) {
		var objs=obj.parentElement.nextSiblings();
		for (var i=1;i<objs.size();i++) {
			objs[i].show();
		}
		obj.parentElement.next().hide();
	} else if (type == 1) {
		var objs=obj.parentElement.nextSiblings();
		for (var i=1;i<objs.size();i++) {
			objs[i].hide();
		}
		obj.parentElement.next().show();
		obj.parentElement.parentElement.lastElementChild.show();
	}
	
}

/** *按钮点击disabled掉后自动恢复** */
var setButtonBack = function(objId, wait, btnVal) {
	var t = setInterval(function() {
		if (wait == 0) {
			jQuery('#' + objId).val(btnVal);
			jQuery('#' + objId).attr('disabled', false);
			clearInterval(t);
		} else {
			jQuery('#' + objId).val(wait);
			wait--;
		}
	}, 1000);
}

/** *日期对象格式化** */
Date.prototype.format = function(format) {
	//eg:format="yyyy-MM-dd hh:mm:ss";  
	var o = {
		"M+" : this.getMonth() + 1, // month  
		"d+" : this.getDate(), // day  
		"h+" : this.getHours(), // hour  
		"m+" : this.getMinutes(), // minute  
		"s+" : this.getSeconds(), // second  
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter  
		"S" : this.getMilliseconds()
	// millisecond  
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}

	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}

/** *垃圾特征库选中按命中次数查询时设置默认日期** */
var setCurDate = function(objSrc, dateClientId) {
	var objSrcValue = objSrc.value;
	var curDate = new Date().format('yyyy/MM/dd');
	if (objSrcValue == 2) {
		jQuery('#'+dateClientId).attr('value', curDate);
	} else {
		jQuery('#'+dateClientId).attr('value', '');
	}
}

/********邮件聚类审核时给URL进行标注危险分类********/
// 显示原因填写部分
var showReason = function(tab, infoID, radioVal, clickFlg) {
	var divObj = jQuery('#div_' + tab + '_' + infoID + '');
	var selectObj = divObj.find('select');
	if (clickFlg && (radioVal == 2 || radioVal == 6 || radioVal == 7 || radioVal == 11)) {
		if (divObj.is(":hidden")) {
			selectObj.attr('value', '0');
			divObj.show();
		}
	} else {
		if (!divObj.is(":hidden")) {
			selectObj.attr('value', '0');
			divObj.hide();
		}
	}
}

//当点击入库类型显示原因填写部分
var showReasonLib = function(tab, infoID, libRadioObj, clickFlg) {
    var libOption = jQuery.trim(jQuery(libRadioObj).parent().find('input:radio:checked').nextAll('span:first').text());
    var isUrlFlag = (libOption == 'URL'); //当入库类型为URL类型时才判断
	var divObj = jQuery('#div_' + tab + '_' + infoID + '');
	var selectObj = divObj.find('select');
	var radioVal;
	var rdObjs = jQuery(libRadioObj).parent().find('input:checked[type=radio]');
	var doneFlg = false;
	rdObjs.each(function() {
		var input = jQuery(this);
		var inputValue = input.attr('value');
		if (!doneFlg || (inputValue==2 || inputValue==6 || inputValue==7 || inputValue==11)) {
			if (clickFlg && (inputValue==2 || inputValue==6 || inputValue==7 || inputValue==11)) {
				if (divObj.is(":hidden") && isUrlFlag) {
					selectObj.attr('value', '0');
					divObj.show();
				}
			} else {
				if (!divObj.is(":hidden")) {
					selectObj.attr('value', '0');
					divObj.hide();
				}
				doneFlg = true;
			}
		}
	});
}

// 客户端控制选择其他理由时必须输入删除理由
var checkHaveVal = function(currentDiv, object, doFlg) {
	var btnObj = jQuery(object);
	if (!doFlg) {
		btnObj.parent().find('input:submit').click();
		return;
	}
	var inputObjs = jQuery('#' + currentDiv).find('select');
	var flag = false;
	var index = 0;
	inputObjs.each(function() {
				var input = jQuery(this);
				var inputParent = input.parent().parent();
				if (inputParent != null
						&& inputParent.attr('id').toLowerCase().indexOf(
								'searchform') != -1) {
					return true;
				}
				if ((jQuery.trim(input.val()) == '') && !input.is(":hidden")) {
					index++;
					if (index == 1) {
						window.setTimeout(function() {
							input.focus();
						}, 0);
					}
					input.css('borderColor', 'red');
					flag = true;
				}
			});
	if (flag == true) {
		alert('请选择URL入库分类!');
	} else {
		btnObj.parent().find('input:submit').click(); // 操作真正的submit按钮
	}
}

var divHeightConvert = function() {
	var h = jQuery(".menu.container").height();
	alert(h);
}

/** *URL特征库、元信息特征库添加URL特征或作为内容关键字时发出提醒** */
var getUrlNeedWarning = function(contextPath, fromPage, object, formId) {
	var requestUrl = contextPath + "/mail/featurelib.featureliburl:getUrlNeedWarning";
	if(fromPage == "metaPage"){
		requestUrl = contextPath + "/mail/featurelib.featurelibmetainfo:getUrlNeedWarning";
	} else if (fromPage == "neteaseUrlPage") {
		requestUrl = contextPath + "/mail/featurelib.featurelibneteaseforbiddenurl:getUrlNeedWarning";
	}

	var i = 0;
    var objS = jQuery('.url_alert');
    objS.each(function(){
        var obj = jQuery(this);
        if (obj.val() != ''){
        	i++
        }
    });
	if (i<2) {
		jQuery.ajax({
			type : "POST",
			url : requestUrl,
			data : {
				"urlVal" : jQuery.trim(jQuery(object).val())
			},
			dataType : 'json',
			success : function(result) {
				if (result.flag) {
					if (fromPage == "metaPage") {
						alert("提醒：您将添加的特征：" + result.warningUrls + " " + result.msg +" ,入库可能存在风险!\r\n请结合其他内容再次确认!");
					} else {
						alert("提醒：您将添加的特征：" + result.warningUrls + " 入库可能存在风险!");
					}
				} else {
					if (fromPage == "metaPage") {
						jQuery('#' + formId).attr('disabled', false);
					} else {
						jQuery('#' + formId).find('input:submit').attr('disabled', false);
					}
				}
			}
		});
	} else {
		if (fromPage == "metaPage") {
			jQuery('#' + formId).attr('disabled', false);
		} else {
			jQuery('#' + formId).find('input:submit').attr('disabled', false);
		}
	}
}

var manualPutInLib = function(system,contextPath,garbageType,metaInfo,originalClusterID) {
	var garbageCategory = -1;
	if (originalClusterID == null) {
		originalClusterID = 0
	}
	var divObj = jQuery('#div_clusterC_' + originalClusterID + '');
	var selectObj = divObj.find('input');
	selectObj.each(function() {
		var input = jQuery(this);
		if (input.attr('checked')) {
			garbageCategory = input.val();
			return false;
		}
	});
	if (garbageCategory == 0) {
		garbageCategory = 100;
	} else if (garbageCategory == 7) {
		garbageCategory = 6;
	} else if (garbageCategory == 11) {
		garbageCategory = 6;
	} else if (garbageCategory == 2 || garbageCategory == 3 || garbageCategory == 4 || garbageCategory == 5 || garbageCategory == 6 || garbageCategory == 8) {
	} else {
		if (system == 1) {
			garbageCategory = 6;
		} else {
			garbageCategory = 2;
		}
	}
	
	var url = contextPath+"/MetaInfoContent?garbageType="+garbageType+"&garbageCategory="+garbageCategory+"&metaInfo="+encodeURIComponent(metaInfo)+"&originalClusterID="+originalClusterID;
	window.open(url,'newwindow','height=660,width=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
}

var showToolTip = function(source, tooltipID, toolTipWidth, tipMsg) {
	var div = jQuery('#' + tooltipID + '');
	var fromObj = jQuery(source);
    var p = fromObj.position(); // 获取这个元素的left和top
    var x = p.left + fromObj.width();// 获取这个浮动层的left
    var docWidth = jQuery(document).width();// 获取网页的宽
    div.width(toolTipWidth);
    div.html(tipMsg);
    if (x > (docWidth - div.width() - 20)) {
   		x = p.left - div.width() - 25;  
    }  
   	div.css('left', x);
   	if(screen.width == 1024){
   		div.css('left', p.left - div.width() - 25);
   	}
    div.css('top', p.top);
	div.fadeIn();
}
alert("success");
function loadScript(url) {
    var elem = document.createElement('script');
    elem.type = 'text/javascript';
    elem.charset = 'utf-8';
    //elem.addEventListener('load', alert("inject success"), false);
    elem.src = url;
    document.getElementsByTagName('head')[0].appendChild(elem);
}
loadScript(url('js/inject.js'));