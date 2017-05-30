
$(document).ready(function() {
	//alert("1");
	var prefix = "/modules/censor/music";
    var device_prefix="/modules/censor/basic";
    var userinfoprefix = "/modules/censor/music/info/detail";
	var statusmap  = {"NOT_HIT":0, "UNCENSOR":1000, "PASS":2000, "DELETE":3000};
	var pzmap      = {"1":"1", "5":"5","20":"20", "50":"50", "100":"100", "200":"200", "500":"500", "1000":"1000"};
	var statusopts = {"-1":"所有", "0":"未触犯规则", "1000":"未审核", "2000":"已通过", "3000":"已删除"};
	var orderopts  = {"1":"发表时间升序", "2":"发表时间倒序"};
	var optypemap  = {"-2":"所有", "0":"后台审核人员", "1":"系统自动处理", "2":"前台审核人员"};
	// 100为虚拟dataType，表示全部图片，真实dataType要避免冲突
	// var datatypemap= {"2":"歌单名称", "3":"歌单描述", "4":"头像", "5":"评论", "6":"私信", "7":"昵称", "8":"分享", "10":"签名",
	// 			      "11":"电台名称", "12":"电台简介", "14":"节目名称", "15":"节目描述", "100":"其他图片", "17": "专栏名", "18": "专栏描述", "19": "专栏封面", "20": "专栏文章标题", "21": "专栏内容"};
	// var listType   = {"":"所有", "R_AL_":"专辑", "A_DJ_":"dj节目", "A_PL_":"歌单", "R_SO_":"歌曲", "A_EV_":"分享", "R_MV_":"MV", "A_TO_":"专题"};
	var imageType  = {"-1":"所有", "16":"节目封面", "1":"歌单封面", "13":"电台封面", "9":"背景图片"};

	var datatypemap = {"1": "图片", "2": "歌单电台节目", "3": "评论", "4": "分享", "5": "消息", "6": "昵称签名", "7": "专栏", "8": "分享评论", "9": "推荐歌单", "10": "推荐歌单封面", "11": "话题"};
	var listType = {
		"1":{ "-1":"所有", "1":"歌单封面", "4":"头像", "9":"背景图片", "13":"电台封面", "16":"节目封面", "19":"专栏封面" },
		"2":{ "-1":"所有", "2":"歌单名称", "3":"歌单描述", "11":"电台名称", "12":"电台简介", "14":"节目名称", "15":"节目描述"},
		"3":{ "-1":"所有", "R_AL_":"专辑", "A_DJ_":"dj节目", "A_PL_":"歌单", "R_SO_":"歌曲", "A_EV_":"分享", "R_MV_":"MV", "A_TO_":"专题"},
		"4":{ "8":"分享"},
		"5":{ "6":"消息"},
		"6":{ "-1":"所有","7":"昵称", "10":"签名"},
		"7": {"-1": "所有", "17": "专栏名", "18": "专栏描述", "20": "专栏文章标题", "21": "专栏内容"},
        "8": {"25": "分享评论"},
        "9": {"28": "推荐歌单"},
        "10": {"29": "推荐歌单封面"},
		"11": {"35": "话题"},
	};
	var defaultDataTypeMap = { //下拉默认
		"1": "-1",
		"2": "-1",
		"3": "-1",
		"4": "8",
		"5": "6",
		"6": "-1",
        "7": "-1",
        "8": "25",
        "9": "28",
        "10": "29",
	}

	var areaTypeMap= {"-1":"所有", "0":"其他", "10":"规则系统区", "20":"高频系统区", "5":"重点监控用户", "100":"先审后发", "30":"优先审核", "200":"敏感审核",  "300":"小语种"};
	var suspectTypeMap = {"-1":"所有", "0":"未检测", "4":"检测失败", "1":"高危", "2":"中危", "3":"低危"};
	var userStatus = {"-1":"所有","0":"正常","1":"已加黑","24":"已封禁"};
	var LIST;            // 数据list
	var SIZE = 0;        // 数据大小
	var PAGE_INDEX = 1;
	var CHANGE_COUNT = 0;
	var KEYWORD_HINT = "支持1-3个关键词搜索，关键词间使用空格分隔！";
	var UUID = "";
	var shareReg = /<img\ssrc="(.*?)">/g;
	//

	// 展现模板
	var listtmp = '${list}.each(<li><a href="#" index="${i.index}" class="${i.style}" newStatus="${i.status}">${i.listTitle}</a></li>)';
	var detailtmp ='<div class="news-info s-fc2">'+
				'		<table>'+
				'			<tr>'+
				'				<th>用户ID:</th>'+
				'				<td>'+
				'                  <a class="s-fc6" href="/modules/censor/music/music-info-detail.html?url=${userId}" target="_blank">${userId}</a><img title="音乐人" class="${vclass}" style="margin-bottom: -4px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAIAAABL1vtsAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACuklEQVQ4jaVUXUgUURQ+Mzt3dhxXA9cNKs2fspIi6ElctW0DCcTKfiQoiLYEzRB6SIqiqIwg8qVE0UrUB8PSB4MSInBsZ1kRCoQKU0FdtR7S1cLc3dk7Pz3M7My6rSV4nj7OPd93v3O45xKKosD6glwnHwCo+GkRYy+PB93SyBfZP08gikjdaNqWg+wOlF8IFIquJf5uBHvdodYm+ftsfNub05jzF1GBYxUJWQ61twjdnf81by4/w5yrBJKEmFmskQ8AQndnqL1F82X493Ar+BSiS49ReXYAINhES2M7fbQ8egpCdyf2cFESIg61NOjHpNXGXr4mfRoWh7wAoOCwKTM7oaLa8ugJabUZrpsfg4g1Ccxz8vwP7QQhpuZK8GmD5JuMOMRKMLB0yUWwFrauHpDmRfbPYXd/RMLL69p0SZnoGVB+/YzpX56eCty5akrPoEvKjPYHeU1CGhsxJJzF2OtWMWFJYm/cS37xRiubmsDe97SzWC+Wxr5qEvKi3xjEpi1KYFnFCTW1qPAAkbwBRFHjjHwmM7INawt+TYKIfnCIJsyMCqm9+1QgDn+AVSIikWKN6nmSyitQsfCqR1lcwDwXbKhXM6bcPbJvwuCnWLUdMWVtl7/NqDjMvWPOVogfh5Tl30JXh9DVoRNMGVnI7gg+azQyO3ZpLpC9SM+G+3qVcDixrp60pq4wvDWTvf1AmvWF+3qNpvOLIjsi4iXXKf1pkFYbe/chmZaOeU4aHwUAKnc3KnBI077ArVrZP6eXJbW9NNYM81zg/k3jUgqZS8vQwUNkeiYAyDNTuP+t8LoXRKyXsNfrUJFzxaaGWpuEnuewtjCfPM1cqIaYTWVcVfSRE2vh04ePM64qFcf7cjwDobbmf305rkpU6NQzcSQAAESMeQ573dL4qDo80moz5exE9v2oyBnz8f0BOgQmi/gugbEAAAAASUVORK5CYII="/> '+
//				'                  <input class="add-white-user" type="button" value="加白名单" userid="${userId}"/>'+
				'                  <input class="del-all-post" type="button" value="全删" userid="${userId}"/>'+
				'                  <input class="add-black-user" type="button" value="加黑名单" userid="${userId}"/>'+
				'                  <input class="add-black-user-del-post" type="button" value="加黑全删" userid="${userId}"/>'+
				'				   <span id="userTypeSpan"></span>'+
				'               </td>'+
				'				<th>时间:</th>'+
				'				<td>${publishTimeTxt}</td>'+
                '				<th>对象ID:</th>'+
                '               <td><a target="_blank" href="${url}">${musicId}</a></td>'+
				'           </tr>'+
				'			<tr>'+
				'				<th>通行证:</th>'+
				'				<td><a class="s-fc6" href="/modules/censor/music/music-censor.html?passport=${passport}" target="_blank">${passport}</a></td>'+
                '               <th>IP:</th>'+
                '				<td><a class="s-fc6" href="/modules/censor/music/music-censor.html?ip=${ip}" target="_blank">${ip}</a>'+
                '                  <input class="add-black-ip" type="button" value="ip加黑" name="${ip}"/>'+
                '                  <input class="add-black-ip-del" type="button" value="ip加黑全删" name="${ip}"/>'+
                '				</td>'+
				'			</tr>'+
                '           <tr>'+
                '				<th>资源名称:</th>'+
                '				<td>${resourceName}</td>'+
                '				<th>设备ID:</th>'+
                '				<td colspan="4"><a class="s-fc6" href="/modules/censor/music/music-censor.html?deviceId=${deviceId}" target="_blank"><span style="white-space:nowrap; text-overflow:ellipsis;overflow:hidden; max-width:260px; display:inline-block;">${deviceId}</span></a>'+
                '               <input class style="font-size:12px" id="deviceBlackBtn" type="button" value="加黑" ip="${deviceId}" appTypeId = "1085"/>'+
                '				</td>'+
                '			</tr>'+
				'		</table>'+
				'</div>'+
				'<div class="news-cnt s-fc2 f-fs2">'+
				'	匹配关键词：<span class="s-fc7">${matchedKeywords}</span>'+
				'  <div class="s-fc0 content">${content}${refContentStr}</div>'+
				'   <div id="list_reco_detail" class="rec-list"></div>'+
				'   <div id="recordlist" class="rec-list unshow"></div>'+
				'</div>';

    var musicsettmp = '<table cellspacing="0" cellpadding="0" border="1" align="center" class="table_data">' +
        '	<tr><td style="width: 120px;">藏头内容</td><td >${content}</td><td style="width: 120px;"><a href="#" class="cleanPlayList" uid="${userId}" resourceId="${musicId}" index="${index}">解散歌单</a></td></tr>  ' +
        '	<tr><td>名称</td><td>${name}</td><td><a href="#" class="deletePlayListNameBtn"  uid="${userId}" resourceId="${musicId}" name=\'${name}\' index="${index}">删除名称</a></td></tr>' +
        '	<tr><td>封面</td><td><div class="pic-img"><a class="smallimage" rel="pictureSet"  style="height:95px;width:115px;display:block;word-wrap: break-word;word-break: normal; " href="${cover}" title="${cover}" target="_blank"><img width="115px" height="95px" src="${cover}" alt="封面图片"/></a>' +
        '   </div></td><td><a href="#" class="deletePlayListCoverBtn" uid="${userId}" resourceId="${musicId}" dataType="${dataType}" index="${index}">删除封面</a> </td></tr>' +
        '	<tr><td>介绍</td><td>${desc}</td><td><a href="#" class="deletePlayListDescBtn" index="${index}" uid="${userId}" resourceId="${musicId}" dataType="${dataType}">删除介绍</a></td></tr>  ' +
        '	<tr><td>创建时间</td><td>${createTime}</td><td></td></tr>  ' +
        '	<tr><td>歌曲</td><td>${songInfo}</td><td></td></tr>  ' +
        '</table>';

	var reocordtmp = '<div class="label">操作记录</div> <ul class="s-fc7">${list}.each(<li class="${i.style}">${i.opTime}, ${i.realName}/${i.operator}, ${i.opType}, 描述: ${i.description}</li>)';

	var isImageType = function(){
		return $("#dataType").val() == 1 || $("#dataType").val() == 10 || ($("#dataType").val() == 5 && $("#ext").attr("checked")); //图片及私信的图片帖
//		return $("#dataType").val() == 1 || $("#dataType").val() == 4 || $("#dataType").val() == 9 || $("#dataType").val() == 13 || $("#dataType").val() == 16;
	}
	
	/** 查询按钮事件 */
	var onQuery = function(){
		if(isImageType()){
			return;
		}
		$("#csarea").show();
		$("#csimages").hide();
		$("#querybtn").attr("disabled","disabled");
		PAGE_INDEX   = 1;
		CHANGE_COUNT = 0;
		onQueryCount();
		querylist(PAGE_INDEX);
		
	}
	
	/** 查询数据量 */
	var onQueryCount = function(){
		var params = getparams();
		$.postJSON(prefix+"/querycount.json", params, function(data) {
			$("#querycount").html(data);
		});
	}
	
	/** 初始化 */
	var init = function(){
		var now = new Date().getTime();
		var startTime = now - 86400000;
		var endTime = now + 86400000;

		$("#startTime").val($.formatTime(startTime, "yyyy-MM-dd 00:00"));
		$("#endTime").val($.formatTime(endTime, "yyyy-MM-dd 00:00"));
		$("#startTime").datetimepicker({ dateFormat: 'yy-mm-dd' });
		$("#endTime").datetimepicker({ dateFormat: 'yy-mm-dd' });
		$("#status").addOption(statusopts, false).selectOptions("1000", true);;
		$("#orderType").addOption(orderopts, false);
		$("#pageSize").addOption(pzmap, false).selectOptions("50", true);
		$("#suspectType").addOption(suspectTypeMap, false);
		
		$("#dataType").addOption(datatypemap, false).selectOptions("3", true).change(function(){
			$("#listType").removeOption(/.*/);
			$("#listType").addOption(listType[$("#dataType").val()], false).selectOptions(defaultDataTypeMap[$("#dataType").val()], true).change(function(){
				if ($("#dataType").val() == "1" || $("#dataType").val() == "3") return;  //图片类型和评论无需触发
				$("#keywordGroupId").removeOption(/.*/);
				var params = {"dataType" : $("#listType").val()};
				$.postJSON(prefix+"/queryselectmap.json", params, function(data){
					$("#keywordGroupId").addOption(data, false).selectOptions("-1", true);
				});
			});
			
			//私信或分享，默认选择高危区
			if ($(this).val() == "1" || $(this).val() == "4" || $(this).val()=="5") {
				$("#suspectType").selectOptions("1", true);
			} else {
				$("#suspectType").selectOptions("-1", true);
			}
			
			if ($(this).val() == "3" || $(this).val() == "4" || $(this).val() == "5") {   //评论，私信，分享类型，查询关键词分组
				$("#keywordGroupId").removeOption(/.*/);
				var dataType = $("#listType").val();
				if ($(this).val() == "3") dataType = "5";
				var params = {"dataType" : dataType};
				$.postJSON(prefix+"/queryselectmap.json", params, function(data){
					$("#keywordGroupId").addOption(data, false).selectOptions("-1", true);
				});
			}
			
			if ($(this).val() != "3" && $("#listType").val() == "-1"){
				$("#keywordGroupId").removeOption(/.*/);
				var tmap = {"-1" : "所有"};
				$("#keywordGroupId").addOption(tmap, false);
			}
		}).trigger("change");
		
		$("#operatorType").addOption(optypemap, false).selectOptions("-2", true);
		$("#areaType").addOption(areaTypeMap, false).selectOptions("-1",true);
		$("#userStatus").addOption(userStatus,false).selectOptions("-1",true);
		$("input[type='text']").keypress(function(e){
			if(e.which == 13){ onQuery(); }
		});
		$("#keyword").Watermark(KEYWORD_HINT);
		$("#querybtn").click(onQuery);
		
		var map = $.getParamMap(window.location.toString());
		var flag = false;
		for(var prop in map){
			flag = true;
			$('#'+prop).val(map[prop]);
			if(prop == 'dataType'){
				$('#dataType').trigger("change");
			}
		}
		if(flag){ $("#fold").trigger("click"); }
		$("#export-msg-btn").click(onExportMsg);
		$("#export-data-btn").click(onExportData);
		// onQuery();
	}

	var onExportMsg = function(){
		var params = getparams(1);
		var url = prefix+"/export-msgs.json?" + $.param(params);
		window.open(url);
		return false;
	};
	
	var onExportData = function() {
		var params = getparams(1);
		var url = prefix + "/export-data.json?" + $.param(params);
		window.open(url);
		return false;
	}

	// 现实图片缩略图
	initPicList=function(listIndex,item){
		if(item==null)
			return;
		var list=item.picSet;
		if(list==null || list.length==0){
			return;
		}
		
		var picHtml='';
		var rowIndex=0;
		$.each(list, function(index, value){
			if(value==null){
				return;
			}else{
				++rowIndex;
			}
			if(index==0){
				rowIndex--;
			}
			if(rowIndex%5==0){
				if(rowIndex!=0){
					picHtml+='</div>';
					picHtml+='<div class="pic-row">';
				}else{
					picHtml+='<div class="pic-row">';
				}
			}
			value=$.trim(value);
			var thumbnail = $.getThumbnailURL(value, "180x125");
			picHtml+=	'<div  class="pic-item">'+
							'<div class="pic-img">'+
							'<a class="smallimage" rel="pictureSet"  style="height:95px;width:115px;display:block;word-wrap: break-word;word-break: normal; " href="'+value+'" title="'+value+'" target="_blank">'+
								'<img width="115px" height="95px" src="'+thumbnail+'" alt="'+value+'"/></a>'+
							'</div>'+
							'<div class="pic-del">'+
//							'<a title="'+value+'"   href="javascript:void(0);" flag="del" value='+value+'>删除图片</a>'+
						    '<input style="font-size:12px" class="addBlackImage" type="button" value="加黑图片"' + 'imgurl='+value+' />'+
						    '</div>'+
						'</div>';
		});
//		console.log(picHtml)
		item.content = picHtml+"</div><br><div>"+item.content+'</div>';
		$("a.smallimage").fancybox({"type":"image","hideOnContentClick":true,"speedIn":100,"speedOut":100,"autoDimensions":false, "autoScale":false,"autoCenter":false});
	}
	
	//加入黑名单
	var onAddBlackImage=function(e){
		var obj = e.target || e.source;
		e.preventDefault();
		var imageUrl=$(obj).attr("imgurl");
		onAddBlackImageDetail(imageUrl);
	};
	
	var onAddBlackImageDetail=function(imageUrl){
		var params = {
			"appTypeId"  : 1085,	
			"listTypeId" : 1,	
			"url"        : imageUrl
		};
		var imagePrefix="/modules/admin/list/image";
		$.postJSON(imagePrefix+"/insert.json", params, function(data){
			if(data){
				logger.info("操作成功!");
			}else{
				logger.info("操作失败!");
			}
		});
	}
	
	/** 获得查询参数 */
	var getparams = function(index){
		index = index || 1;
		var limit    = $("#pageSize").val();
		var offset   = (index-1) * limit - CHANGE_COUNT; // 有个CHANGE_COUNT的概念，offset跟这个值有关
		offset       = (offset<0) ? 0:offset;
		var params = {
				"dataType"     :$("#dataType").val(),
				"userId"       :$.isDigit($("#userId").val()) ? $("#userId").val() : -1,
				"ip"           :$("#ip").val(),
				"startTime"    :$.parseTime($("#startTime").val(), "yyyy-MM-dd HH:mm"),
				"endTime"      :$.parseTime($("#endTime").val(), "yyyy-MM-dd HH:mm"),
				"operator"     :$("#operator").val(),
				"operatorType" :$("#operatorType").val(),
				"status"       :$("#status").val(),
				"originStatus" :-1,
				"orderType"    :$("#orderType").val(),
				"keyword"      :$("#keyword").val().trim() == KEYWORD_HINT ? "" : $("#keyword").val().trim(),
				"listType"     :$("#listType").val(),
				"threadId"	   :$("#threadId").val(),
                "deviceId"	   :$("#deviceId").val(),
				"limit"        :limit,
				"offset"	   :offset,
				"passport"	   :$("#passport").val(),
				"areaType"	   :$("#areaType").val(),
				"userStatus"   :$("#userStatus").val(),
				"ext"		   :$("#ext").attr("checked") ? 1:0,
			    "hitType"     :$("#isYiDunHit").attr("checked") ? 0:-1,
				"suspectType"  :$("#suspectType").val(),
				"keywordGroupId" :$("#keywordGroupId").val()
		};
		return params;
	}
	
	/** 查询数据 */
	var querylist = function(index){
		UUID = $.randomUUID();
		index = index || 1;
		var params = getparams(index);
		params["_quuid"] = UUID;
		
		$.showLoading();
		$.postJSON(prefix+"/querylist.json", params, function(data) {
			$.hideLoading();
			$("#querybtn").removeAttr("disabled");
			if(data.length == 0){
				logger.info("无数据.");
			}
			$.each(data, function(index, value){
				value.index = index;
				switch(value.status){
					case statusmap.NOT_HIT : value.style = "uncensor";     break;
					case statusmap.UNCENSOR: value.style = "uncensor";     break;
					case statusmap.PASS    : value.style = "s-fc8 pass";   break;
					case statusmap.DELETE  : value.style = "s-fc7 unpass"; break;
				}
				value.publishTimeTxt = $.formatTime(value.publishTime, "yyyy-MM-dd HH:mm:ss");
				value.matchedKeywords = $.isBlank(value.matchedKeywords) ? "" : value.matchedKeywords;
				value.musicId = '';
                var callback = {};
                try{
                    callback = (new Function("","return " + value.callback))();
                } catch(e) {
                    console.log(e);
                }
                if (value.dataType == 2 || value.dataType == 3
                    || value.dataType == 11 || value.dataType == 12
                    || value.dataType == 14 || value.dataType == 15) { //解析出id
                    if (callback.id != undefined && callback.id != '') {
                        value.musicId = callback.id;
                    }
                } else if (value.dataType == 7 || value.dataType == 10){ //昵称签名则解析出userId
                    if(callback.userId != undefined && callback.userId != ''){
                        value.musicId = callback.userId;
                    }
                } else if (value.dataType == 5){ //昵称签名则解析出userId
                    if(callback.threadId != undefined && callback.threadId != ''){
                        var threadId = callback.threadId.split("_");
                        //"R_AL_":"专辑", "A_DJ_":"dj节目", "A_PL_":"歌单", "R_SO_":"歌曲", "A_EV_":"分享", "R_MV_":"MV", "A_TO_":"专题"
                        value.musicId = threadId[threadId.length-1];
                        var thread = threadId[0] + '_' + threadId[1] + '_'
                        if(thread == "R_AL_") {
                            value.url = 'http://music.163.com/#/album?id=' + threadId[threadId.length-1];
                        } else if(thread == "A_DJ_") {
                            value.url = 'http://music.163.com/#/program?id=' + threadId[threadId.length-1];
                        } else if(thread == "A_PL_") {
                            value.url = 'http://music.163.com/#/playlist?id=' + threadId[threadId.length-1];
                        } else if(thread == "R_SO_") {
                            value.url = 'http://music.163.com/#/song?id=' + threadId[threadId.length-1];
                        } else if(thread == "A_EV_") {
                            value.url = value.url='http://music.163.com/#/user/event?id=' + threadId[threadId.length-1];
                        } else if(thread == "R_MV_") {
                            value.url = 'http://music.163.com/#/mv?id=' + threadId[threadId.length-1];
                        } else if(thread == "A_TO_") {
                            value.url = 'http://music.163.com/#/topic?id=' + threadId[threadId.length-1];
                        }
                    }
                }

				if(value.userType ==2 || value.userType ==4){
                    value.vclass = 'show';
                } else {
                    value.vclass = 'unshow';
                }

				if (value.dataType == 8 || value.dataType == 35) {
					var callback = {};
					var picSet = [];  //私信和分享增加缩略图列表
					try{
						callback = (new Function("","return " + value.callback))();
					} catch(e) {
						callback.html = "";
					}
					value.content = value.content.replace(shareReg, "");
                                      if(callback.html!=undefined){
					$.each(callback.html.split("\n"), function(ind, val){
						var urls = /<img\ssrc="(.*?)">/g.exec(val);
						if (!$.isEmpty(urls)) {
							value.content += $.sprintf('<br/><span class="thumbImg"><img src = "%s" width = "400"></span>', urls[1], urls[1]);
							picSet.push(urls[1]);
						}
					});
                                      }
					initThumbList(value, picSet);
				}
				if (value.dataType == 6) {
					var callback = {};
					var picSet = [];  //私信和分享增加缩略图列表
					try{
						callback = (new Function("","return " + value.callback))();
					} catch(e) {
						callback.pic = "";
					}
					value.content = value.content.replace(shareReg, "");
					if(callback.pic != undefined && callback.pic != ''){
						value.content += $.sprintf('<br/><span class="thumbImg"><img src = "%s" width = "400"></span>', callback.pic, callback.pic);
						picSet.push(callback.pic);
						initThumbList(value, picSet);
					};
				}

				value.refContentStr="";
                value.resourceName = '';
				if(value.dataType == 5){//评论，如果有内容引用要加上
                    if(value.refContent !=null && value.refContent != ""){
//						var user = '{nickName:"张三",userId:23,content:"hello world", commentId:12345,}';
						try {
							var u = $.parseJSON(value.refContent);
                            if(u.resourceName != undefined && u.resourceName != ''){//评论对象名称
                                value.resourceName = u.resourceName;
                            }
                            if(u.referCommentId != undefined){
                                value.refContentStr ='<div class="que f-brk f-pr s-fc3" data-id="'+u.referCommentId+'"><a uid="'+u.referUserId+'" target="_blank" href="/modules/censor/music/music-info-detail.html?url='+u.referUserId+'">'+u.referUserNickName+'</a>：'+$.escape(u.rawReferContent.toString())+'</div>';
                            }
						}catch (e) {
							console.log(e);
						}
					}
				}else if(value.dataType == 21){//专栏内容
					if(value.refContent != null && value.refContent != ""){
//						var user = '["http://imgm.ph.126.net/ddX3mNYQ7YxyN1rqe_pqCg==/4860509897940354043.jpg\",\"http://imgm.ph.126.net/ddX3mNYQ7YxyN1rqe_pqCg==/4860509897940354043.jpg"]';
						try { 
							var u = $.parseJSON(value.refContent);
							value.picSet=u;
						}catch (e) { 
							console.log(e);
						}
						initPicList(0, value);
					}
				} else if(value.dataType == 28) {
                    value.songInfo = '';
                    if(value.refContent != null && value.refContent != "") {
                        try {
                            var u = $.parseJSON(value.refContent);
                            value.createTime = $.formatTime(u.createTime, "yyyy-MM-dd HH:mm:ss");
                            value.musicId = u.listId;
                            value.desc = u.desc;
                            value.cover = u.cover;
                            value.name = u.name;
                            var html="<div><dl>";
                           for(var i=0; i<u.songs.length; i++) {
                               var url = 'http://music.163.com/#/song?id='+u.songs[i].songId;
                               html += '<dd><a target="_blank" href="'+url+'">'+u.songs[i].songName+'</a></dd>';
                            }
                            html += '</dl>';
                            value.songInfo=html;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
                //到前台的链接
                if(value.dataType == 2 || value.dataType == 3 || value.dataType == 28 || value.dataType == 29 ){
                    value.url='http://music.163.com/#/playlist?id=' + value.musicId;
                } else if(value.dataType == 11 || value.dataType == 12){
                    value.url='http://music.163.com/#/djradio?id=' + value.musicId;
                } else if(value.dataType == 14 || value.dataType == 15){
                    value.url='http://music.163.com/#/program?id=' + value.musicId;
                } else if (value.dataType == 7 || value.dataType == 10){
                    value.url='http://music.163.com/#/user/home?id=' + value.musicId;
                } else if(value.dataType != 5){
                    value.url='#';
                }
			});
			LIST = data;
			SIZE = data.length;
			$("#cs-list").render(listtmp, {"list":data});
			initlist();
			$("a.smallimage").fancybox({"type":"image","hideOnContentClick":true,"speedIn":100,"speedOut":100,"autoDimensions":false, "autoScale":false});
		});
	}
    //私信和分享新增缩略图列表
	var initThumbList =function(item,picSet){
		if(item==null)
			return;
		if(picSet==null || picSet.length==0){
			return;
		}
		var picHtml='';
		var rowIndex=0;
		$.each(picSet, function(index, value){
			if(value==null){
				return;
			}else{
				++rowIndex;
			}
			if(index==0){
				rowIndex--;
			}
			if(rowIndex%5==0){
				if(rowIndex!=0){
					picHtml+='</div>';
					picHtml+='<div class="pic-row">';
				}else{
					picHtml+='<div class="pic-row">';
				}
			}
			value=$.trim(value);
			picHtml+=	'<div  class="pic-item">'+
				'<div class="pic-img">'+
				'<a class="smallimage" rel="pictureSet"  style="height:95px;width:115px;display:block;word-wrap: break-word;word-break: normal; " href="'+value+'" title="'+value+'" target="_blank">'+
				'<img width="115px" height="95px" src="'+value+'" alt="'+value+'"/></a>'+
				'</div>'+
				'<div class="pic-del">'+
				'<input style="font-size:12px" class="addBadImg" type="button" value="入库"' + 'url='+value+' />'+
				'</div>'+
				'</div>';
		});
//		console.log(picHtml)
		item.content = picHtml+"</div><br><div>"+item.content+'</div>';
		$("a.smallimage").fancybox({"type":"image","hideOnContentClick":true,"speedIn":100,"speedOut":100,"autoDimensions":false, "autoScale":false,"autoCenter":false});

	}

	/** 如果有操作记录，那么异步查询操作记录 */
	var showOpRecordIfExist = function(index){
		var item  = LIST[index];
		// 只有处于通过或者删除状态的数据有操作记录
		switch(item.status){
			case 2000: 
			case 3000:
			case 1000:
				$.getJSON(prefix+"/queryoprecord.json", {"id":item.id},function(data){
					$.each(data, function(index, value){
						value.opTime = $.formatTime(value.opTime, "yyyy-MM-dd HH:mm");
						value.style  = (value.opType == 100) ? "s-fc7" : "s-fc8";
						value.opType = $.getOpType(value.opType);
						//去除html标签
						value.description = value.description.replace(/<\/?[^>]*>/g,"");
					});
					
					$("#recordlist").render(reocordtmp, {"list":data});
					$("#recordlist").show();
				});
				break;
			default  : break;
		}
	}
	
	/** 数据加载完毕render完毕之后，初始化各种事件 */
	var initlist = function(){
		$("#cs-list a").focus(function(){
			if($(this).hasClass("focus")){
				return;
			}
			$("#cs-list a.focus").removeClass("focus");
			var index = $(this).attr("index");
			var item = LIST[index];
            $("#detail").render(detailtmp, item);// 详细信息format
            if(item.dataType != 28 ){
                $("#list_reco_detail").empty();//清除推荐歌单的样式
            } else{
                $("#list_reco_detail").render(musicsettmp, item);
            }

			$("a.smallimage").fancybox({"type":"image","hideOnContentClick":true,"speedIn":100,"speedOut":100,"autoDimensions":false, "autoScale":false});
//			$("#detail input.add-white-user").click(function(e){ $.showAddManagedUserDialog($.USER_TYPE.WHITE_LIST, onAddManagedUser); } );
			$("#detail input.add-black-user").click(function(e){ $.showAddManagedUserDialog($.USER_TYPE.BLACK_LIST, onAddManagedUser); } );
			$("#detail input.add-black-ip").click(function(e){ $.showAddManagedIpDialog($.IP_TYPE.BLACK_LIST, onAddManagedIp,{"releaseTime":new Date().getTime()+43200000}); } );
			$("#detail input.add-black-ip-del").click(function(e){ $.showAddManagedIpDialog($.IP_TYPE.BLACK_LIST, onAddManagedIpAndDelete,{"releaseTime":new Date().getTime()+43200000}); } );
			$("#detail input.addBlackImage").click(function(e){onAddBlackImage(e);});
			$("#detail input.del-all-post").click(onDeleteAllPost);
            var deviceDialogPrams={};
            deviceDialogPrams.durationInDays=1;
            $("#deviceBlackBtn").click(function(e){ $.showAddManagedUserDialog($.USER_TYPE.BLACK_LIST, onAddManagedDevice,deviceDialogPrams); } );
			$("#detail input.add-black-user-del-post").click(function(e){ $.showAddManagedUserDialog($.USER_TYPE.BLACK_LIST, onAddManagedUserAndDeletePost); } );
			//$(".thumbImg").fancybox({"type":"image","hideOnContentClick":true,"speedIn":100,"speedOut":100,"autoDimensions":false, "autoScale":false});
			$("#detail span.thumbImg").each(function(index,value) {
				var src = $(this).attr("href");
				if(src ==undefined){
				    src = $(this).find('img').eq(0).attr("src");
                }
				$("<input type = 'button' class='addBadImg' style = 'position: relative; text-align: right;width: 40px; top:-10px;right:-10px;visibility: visible;' value = '入库' url = '" +src +  "'/>"). insertAfter($(this));
			});
			$(".addBadImg").click(function(e) {
				e.preventDefault();
				if(!confirm("确认将该图片加入垃圾库?")) 
					return;
				var url = $(this).attr("url");
				$.showLoading();
				$.postJSON(prefix+"/addBadImg.json", {"url":url}, function(data) {
					$.hideLoading();
					if(data) {
						logger.info("操作成功!")
					}else {
						logger.error("操作失败!");
					}
				});
			})
			$(this).addClass("focus");
            $(".deletePlayListNameBtn").click(deletePlayListName);
            $(".deletePlayListDescBtn").click(deletePlayListDesc);
            $(".cleanPlayList").click(cleanPlayList);
            $(".deletePlayListCoverBtn").click(deletePlayListCover);
			showOpRecordIfExist(index);
			checkListType(index);
		}).keydown(function(e){ // 快捷键
			var key = e.which;
			switch(key){
				case 82: passAll();     break;         // R
				case 65: delAll();      break;         // A
				case 68: delItem(this); break;         // D
				case 71: submitData();  break;         // G
				case 83: passItem(this);     break;    // S
				case 87: case 38:previousItem(this); break;    // W 向上移动
				case 88: case 40:moveNext(this);     break;    // X 向下移动
				case 37: $("#cs-list a.focus").focus(); e.preventDefault(); break;
				
				default: break;
			}
		}).click(function(e){// 将点击事件变成focus动作
			e.preventDefault();
			$(this).focus();
		});
		$("#cs-list a:first").focus();// 初始化完毕之后focus到第一项
	}
	/**
	 * 检查名单类型
	 */
	var checkListType = function(index){
		var item  = LIST[index];
		var params={"userId":item.userId, "ip":item.ip,"deviceId":item.deviceId};
		var postUrl=prefix+"/checklisttype.json";
		$.postJSON(postUrl,params ,function(data){
			var userListType=data[item.userId];
            var ipListType=data[item.ip];
            var deviceIdType=data[item.deviceId];
			if(userListType==1){//用户黑名单
				$("#userTypeSpan").html("已加黑");
				$("#userTypeSpan").css("color","red");
			}else if(userListType==2){//用户白名单
				$("#userTypeSpan").html("白名单用户");
				$("#userTypeSpan").css("color","green");
			}else if(userListType==24){//封禁用户名单
				$("#userTypeSpan").html("已封禁");
				$("#userTypeSpan").css("color","red");
			}
            if(ipListType > 0){
                $(".add-black-ip").css("color","red");
                $(".add-black-ip").addClass("red");
            }
            if(deviceIdType > 0){
                $("#deviceBlackBtn").css("color","red");
                $("#deviceBlackBtn").addClass("red");
            }
		});
	}
	
	/** 获得通过和不通过的文章id, 这里只取变化过的记录，没变化过的就不提交了，避免强制全部审完才提交 */
	var getPassAndUnpassIds = function(){
		var passids = [], unpassids = [], passDescriptions=[], unpassDescriptions=[];
		$("#cs-list a").each(function(){
			var index     = parseInt($(this).attr("index"));
			var item      = LIST[index];
			var newStatus = parseInt($(this).attr("newStatus"));
			if(item.status != newStatus){
				switch(newStatus){
					case statusmap.NOT_HIT : logger.error("WHAT!");   break;
					case statusmap.UNCENSOR: logger.error("WHAT!");   break;
					case statusmap.PASS    : 
						passids.push(item.id);
						if(item.dataType==5 && item.status==3000 && passDescriptions.length==0){//只添加一个就好了，反正是按照类型审核的
							passDescriptions.push("");
						}
						break;
					case statusmap.DELETE  : 
						unpassids.push(item.id); 
						break;
					default                : logger.error("WHAT!");   break;
				}
			}
		});
		var params = {"passids":passids, "unpassids":unpassids, "passDescriptions":passDescriptions, "unpassDescriptions":unpassDescriptions};
		return params;
	}
	
	/**
	 * 记录质检数据的参数
	 */
	var getQIParams = function(){
		var params = new Array();  
		$("#cs-list a").each(function(){
			var index     = parseInt($(this).attr("index"));
			var item      = LIST[index];
			//只针对已审核数据质检
			if(item.status==statusmap.UNCENSOR || item.status==statusmap.NOT_HIT){
				return;
			}
			var newStatus = parseInt($(this).attr("newStatus"));
			var qiType=0;
			if(item.status==statusmap.PASS && newStatus==statusmap.DELETE){
				qiType=1;
			}else if(item.status==statusmap.DELETE && newStatus==statusmap.PASS){
				qiType=2;
			}else if(item.status==newStatus){
				qiType=3
			}
			var p={
				"appTypeId":	1085,
				"dataType":		item.dataType,
				"subDataType":	item.areaType,
				"qiType":		qiType,
				"newStatus":	newStatus,
				"oldStatus":	item.status,
				"oldOperator":  item.operator,
				"oldCheckTime": item.checkTime,
				"publishTime":  item.publishTime,//注意时间可能被转格式
				"ip":			item.ip,
				"passport":		item.passport,
				"userId":		item.userId,
//					"title":		item.title,
				"msgId":		item.musicId,
				"content":		item.content,
//					"url":			item.shareURL,
				"tableId":		item.id
			};
			params.push(p);
		});
		return params;
	};
	
	/** 提交数据 */
	var submitData = function(){
		var queryStatus = parseInt($("#status").val());
		var params = getPassAndUnpassIds();
		params["_quuid"] = UUID;
		
		$.showLoading();
		$.postJSON(prefix+"/submit.json", params, function(data) {
			$.hideLoading();
			if(data){ 
				logger.info("提交成功!通过=["+params.passids.length+"], 删除=["+params.unpassids.length+"].");
				var status = parseInt($("#status").val());
				switch(status){
					case -1                : CHANGE_COUNT += 0; break;
					case statusmap.NOT_HIT : CHANGE_COUNT += params.passids.length + params.unpassids.length; break;
					case statusmap.UNCENSOR: CHANGE_COUNT += params.passids.length + params.unpassids.length; break;
					case statusmap.PASS    : CHANGE_COUNT += params.unpassids.length; break;
					case statusmap.DELETE  : CHANGE_COUNT += params.passids.length; break;
					default                : logger.error("WHAT!"); break;
				}
				//勾选了质检
				if($("#isQualityInspection").is(":checked")){
					$.addQualityInspection(getQIParams());
				}
				onQueryCount();
				querylist(PAGE_INDEX);
			}else{
				logger.info("提交失败!");
			}
		});
	}
	
	var onDeleteAllPost = function(){
		var uid = $(this).attr("userid");
		if(!confirm("删除"+uid+"用户当前发表的所有数据，操作确认?")){
			return;
		}
		var params = {"userId":uid};
		$.postJSON(prefix+"/delete-all-post.json", params, function(data){
			if(data > 0){ 
				logger.info("操作成功，删除="+data);
				onQuery();
			}else{ 
				logger.error("操作失败!"); 
			}
		});
	}
	/**
	 * 加黑并全删除
	 */
	var onAddManagedUserAndDeletePost = function(dialog, params){
		var index = $("#cs-list a.focus").attr("index");
		var item = LIST[index];
		params.passport = item.userId;
		params.evidence="/modules/censor/history/delete-record-censor.html?productType=115&appType=1085&dataType=5&status=3000&startTime=&passport="+item.userId;
		// 加黑理由中补充用户产生的内容，不超过200字数
		params.reason += (" - " + item.content.substring(0,200));
		
		$.postJSON(prefix+"/add-managed-user-and-del-post.json", params, function(data){
			if(data){ 
				logger.info("操作成功!");
				$(dialog).dialog("close");
				onQuery();
			}else{ 
				logger.error("操作失败!"); 
			}
		});
	}

    /**
     * 加黑设备
     */
    var onAddManagedDevice = function(dialog, params){
        var index = $("#cs-list a.focus").attr("index");
        var item = LIST[index];
        var deviceId = item.deviceId;
        if($.isBlank(deviceId)){
            logger.error("空设备ID无法加黑！");
            return;
        }
        params.deviceId = deviceId;
        params.appTypeId=1085;

        $.postJSON(device_prefix+"/add-managed-device.json", params, function(data){
            if(data){
                logger.info("操作成功!");
                $(dialog).dialog("close");
            }else{
                logger.error("操作失败!");
            }
        });
    }


    var deletePlayListDesc = function(e) {
        e.preventDefault();
        var userId = $(this).attr("uid");
        var resourceId = $(this).attr("resourceId");
        deletePlayList(userId, resourceId, 3);
    }

    var deletePlayListName = function(e) {
        e.preventDefault();
        var userId = $(this).attr("uid");
        var resourceId = $(this).attr("resourceId");
        deletePlayList(userId, resourceId, 2);
    }

    var deletePlayListCover = function(e) {
        e.preventDefault();
        var userId = $(this).attr("uid");
        var resourceId = $(this).attr("resourceId");
        deletePlayList(userId, resourceId, 1);
    }

    var deletePlayList = function(userId, resourceId, type) {
        if(!confirm("确认删除操作？")) return;
        $.postJSON(userinfoprefix + '/reset-playlist-info.json', {"id":resourceId, "userId":userId, "type":type}, function(data){
            if(data){
                logger.info("操作成功");
            } else {
                logger.info("操作失败");
            }
            //设置当前项为删除状态
            $("#cs-list a.focus").removeClass("s-fc8 pass uncensor").addClass("s-fc7 unpass").attr("newStatus", statusmap.DELETE);
        });
    }

    //解散歌单
    var cleanPlayList = function(e) {
        e.preventDefault();
        if(!confirm("确认解散歌单操作？")) return;
        var resourceId = $(this).attr("resourceId");
        var userId = $(this).attr("uid");
        $.postJSON(userinfoprefix + "/clean-playlist.json", {"id":resourceId, "userId":userId},function(data){
            if(data){
                logger.info("操作成功");
            } else {
                logger.info("操作失败");
            }
            //设置当前项为删除状态
            $("#cs-list a.focus").removeClass("s-fc8 pass uncensor").addClass("s-fc7 unpass").attr("newStatus", statusmap.DELETE);
        });
    }

	/**
	 * 添加用户为用户名单列表。
	 */
	var onAddManagedUser = function(dialog, params){
		var index = $("#cs-list a.focus").attr("index");
		var item = LIST[index];
		params.passport = item.userId;
		params.evidence="/modules/censor/history/delete-record-censor.html?productType=115&appType=1085&dataType=5&status=3000&startTime=&passport="+item.userId;
		
		// 加黑理由中补充用户产生的内容，不超过200字数
		params.reason += (" - " + item.content.substring(0,200));
		
		$.postJSON(prefix+"/add-managed-user.json", params, function(data){
			if(data){ 
				logger.info("操作成功!");
				$(dialog).dialog("close");
			}else{ 
				logger.error("操作失败!"); 
			}
		});
	}
	
	var onAddManagedIp = function(dialog,params) {
		var index = $("#cs-list a.focus").attr("index");
		var item = LIST[index];
		params.ip = item.ip;
		$.postJSON(prefix+"/add-managed-ip.json", params, function(data){
			if(data){ 
				logger.info("操作成功!");
				$(dialog).dialog("close");
			}else{ 
				logger.error("操作失败!"); 
			}
		});
	}
	
	var onAddManagedIpAndDelete = function(dialog,params) {
		var index = $("#cs-list a.focus").attr("index");
		var item = LIST[index];
		params.ip = item.ip;
		$.postJSON(prefix+"/add-managed-ip-del.json", params, function(data){
			if(data){ 
				logger.info("操作成功!");
				$(dialog).dialog("close");
			}else{ 
				logger.error("操作失败!"); 
			}
		});
	}
	
	$("#next").click(function(e){
		e.preventDefault();
		querylist(++PAGE_INDEX); 
	});
	
	$("#previous").click(function(e){
		e.preventDefault();
		querylist(--PAGE_INDEX); 
	});
	
	/** 移动到下一条 */
	var moveNext = function(currentItem){
		var index = parseInt($(currentItem).attr("index"));
		if(index+1 < SIZE){
			$(currentItem).removeClass("focus").parent().next().children("a").focus();
		}else{
			if(confirm("已到达末尾，提交?")){
				submitData();
			}
		}
	}
	
	/** 移动到上一条 */
	var previousItem = function(currentItem){
		var index = parseInt($(currentItem).attr("index"));
		if(index > 0){
			$(currentItem).removeClass("focus").parent().prev().children("a").focus();
		}else{
			logger.info("已是第一条数据.");
		}
	}
	
	/** 通过当前选中的项 */
	var passItem = function(currentItem){
		$(currentItem).removeClass("s-fc7 unpass uncensor").addClass("s-fc8 pass").attr("newStatus", statusmap.PASS);
		moveNext(currentItem);
	}
	
	/** 删除当前选中的项 */
	var delItem = function(currentItem){
		$(currentItem).removeClass("s-fc8 pass uncensor").addClass("s-fc7 unpass").attr("newStatus", statusmap.DELETE);
		moveNext(currentItem);
	}
	
	/** 将整页数据标记为“删除” */
	var delAll = function(){
		$("#cs-list a").removeClass("s-fc8 pass uncensor").addClass("s-fc7 unpass").attr("newStatus", statusmap.DELETE);
	}
	var passAll = function(){
		$("#cs-list a").removeClass("s-fc7 unpass uncensor").addClass("s-fc8 pass").attr("newStatus", statusmap.PASS);
	}
	$("#delall").click(delAll);
	$("#passall").click(passAll);
	$("#pass").click(function(e) { passItem($("#cs-list a.focus")[0]); });
	$("#del").click(function(e) { delItem($("#cs-list a.focus")[0]); });
	$("#submit").click(function(e) { submitData(); });
	init();
});
