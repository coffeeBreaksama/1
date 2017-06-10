var onOffPass = 0;
$(document).ready(function() {
	//alert("success");
	var prefix = "/modules/censor/yuedu/open";
	var statusmap  = {"NOT_HIT":0, "UNCENSOR":1000, "PASS":2000, "DELETE":3000};
	var pzmap      = {"1":"1", "5":"5","20":"20", "50":"50", "100":"100", "200":"200", "500":"500", "1000":"1000"};
	// 区域和频道是有关联关系的，所以说。。。这里要动态的查询出来
	var statusopts = {"-1":"所有", "0":"未触犯规则", "1000":"未审核", "2000":"已通过", "3000":"已删除"};
	var orderopts  = {"1":"发表时间升序", "2":"发表时间倒序"};
	var optypemap  = {"-2":"所有", "0":"后台审核人员", "1":"系统自动处理", "2":"前台审核人员"};
	var audittypemap = {"0":"普通数据","1":"恢复数据","2":"历史数据"};
	var kwscope    = {"1":"内容", "2":"标题", "3":"内容+标题","4":"书名"};
	var selectmap  = {}; // 联动数据
	var LIST;            // 数据list
	var SIZE = 0;        // 数据大小
	var PAGE_INDEX = 1;
	var CHANGE_COUNT = 0;
	var UUID = "";
	var releasetimemap = {"1":"长期","2":"1个月","3":"3天"};
	var reasonmap = {"-1":"请选择",  "1":"骚扰用户", "2":"违法有害广告", "3":"色情低俗暴力", "4":"政府指示", "5":"用户要求", "6":"其他"};
	
	// 展现模板
	var listtmp = '${list}.each(<li><a href="#" index="${i.index}" class="${i.style}" newStatus="${i.status}"> ${i.title} </a></li>)';
	var detailtmp ='<div class="news-info s-fc2">'+
				'		<table>'+
				'			<tr>'+
				'				<th>类型:</th>'+
				'				<td>${dataTypeName}</td>'+
				'				<th>时间:</th>'+
				'				<td>${publishTimeTxt}</td>'+
				'				<th>IP:</th>'+
				'				<td>${ip}</td>'+
				'           </tr><tr>'+
				'				<th>通行证:</th>'+
				'				<td>'+
				'                   <a class="s-fc6" href="/modules/censor/yuedu/yuedu-open-censor.html?passport=${passport}" target="_blank">${passport}</a>'+
				//'                   <input class="delUserAllbtn" type="button" value="全删" passport="${passport}"/>'+
				'                   <input class="bubtn addBlackUser" type="button" value="加黑" userId="${userId}"/>'+
				'                   </td>'+
				'				<th>用户id:</th>'+
				'				<td>${userId}</td>'+
				'				<th>授权方:</th>'+
				'               <td><a class="s-fc6" href="/modules/censor/yuedu/yuedu-open-censor.html?authorId=${authorId}&sourceType=1" target="_blank">${author}</a></td>'+
				'			</tr>'+
				'		</table>'+
				'</div>'+
				'<div class="news-cnt s-fc2 f-fs2">'+
				'	匹配关键词：<span class="s-fc7">${matchedKeywords}</span>'+
				'	<h3 class="f-fw0 ">书名：<a class="s-fc6 title" href="http://yuedu.163.com/book_reader/${originalId}" target="_blank">${bookName}</a>'+
				'	<h3 class="f-fw0 ">标题：<a class="s-fc6 title" href="${url}" target="_blank">${title}</a>'+
				'   </h3><div class="s-fc0 content">${content}</div>'+
				'   <div id="recordlist" class="rec-list unshow"></div>'+
				'</div>';
	var reocordtmp = '<div class="label">操作记录</div> <ul class="s-fc7">${list}.each(<li class="${i.style}">${i.opTime}, ${i.realName}/${i.operator}, ${i.opType}, 描述: ${i.description}</li>)';
	var KEYWORDNOTE='支持1-3个关键词搜索，关键词间使用空格分隔！';
	
	/** 查询按钮事件 */
	var onQuery = function(){
		$("#querybtn").attr("disabled","disabled");
		PAGE_INDEX   = 1;
		CHANGE_COUNT = 0; // 只需要在每次查询的时候重置一下
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

	// 初始化
	var init = function(){
		var now = new Date().getTime();
		var startTime = now - 86400000;
		var endTime = now + 86400000;

		$("#startTime").val($.formatTime(startTime, "yyyy-MM-dd 00:00"));
		$("#endTime").val($.formatTime(endTime, "yyyy-MM-dd 00:00"));
		$("#startTime").datetimepicker({ dateFormat: 'yy-mm-dd' });
		$("#endTime").datetimepicker({ dateFormat: 'yy-mm-dd' });
		
		//$("#commentType").addOption(cmttypemap, false).selectOptions("-1", true);
		$("#status").addOption(statusopts, false).selectOptions("1000", true);;
		$("#orderType").addOption(orderopts, false);
		$("#pageSize").addOption(pzmap, false).selectOptions("50", true);
		$("#operatorType").addOption(optypemap, false).selectOptions("-2", true);
		$("#auditType").addOption(audittypemap,false);
		$("#keywordScope").addOption(kwscope, false);
		$("#keyword").val(KEYWORDNOTE);
		$("#keyword").css("color","gray");
		$("#keyword").focus(function(){
			if($(this).val()==KEYWORDNOTE){
				$(this).val("");
				$("#keyword").css("color","black");
			}
		});
		$("#keyword").blur(function(){
			if($(this).val()==""){
				$(this).val(KEYWORDNOTE);
				$("#keyword").css("color","gray");
			}else{
				var keywords=$(this).val().split(" ");
				var checkwords=[];
				for(i=0;i<keywords.length;i++){
					if(keywords[i]!=""){
						if(checkwords.length<3){
							checkwords.push(keywords[i]);
						}else{
							logger.info("最多支持三个关键词！");
							$(this).val(checkwords.join(" "));
							break;
						}
					}
				}
			}
		});
		
		
		$("#select-reason-dlg").addOption(reasonmap, false)
		$("input[type='text']").keypress(function(e){
			if(e.which == 13){ onQuery(); }
		});
		$("#querybtn").click(onQuery);
		// 导出数据
		$("#export-btn").click(onExport);
		
		initselect(onQuery, 1); // 获取联动数据，然后开始查询
		
	}
	
	var onExport = function(){
		var params = getparams(1);
		var url = prefix+"/export.json?" + $.param(params); // url中展开所有参数
		window.open(url);
		return false;
	};
	
	// 初始化下拉框联动数据
	var initselect = function(callback, params){
		$.getJSON(prefix+"/queryselectmap.json", null, function(data){
			selectmap = data;
			// 如果有url传递过来的参数，那么设置从url传递过来的参数，并且展开过滤输入框
			$("#dataType").addOption(selectmap.dataTypeMap, false);
			$("#keywordGroupId").addOption(selectmap.originalKeywordSetMap, false).selectOptions("-1", true);
			$("#areaType").addOption(selectmap.areaTypeMap, false);
			$("#sourceType").change(function(){
				$("#keywordGroupId").removeOption(/./);
				if($(this).val()==0 || $(this).val()==3 ){
					$("#keywordGroupId").addOption(selectmap.originalKeywordSetMap, false).selectOptions("-1", true);
				}else if($(this).val()==1 || $(this).val()==2){
					$("#keywordGroupId").addOption(selectmap.cooperationBookKeywordSetMap, false).selectOptions("-1", true);
				}
			});
			var map = $.getParamMap(window.location.toString());
			var flag = false;
			for(var prop in map){
				flag = true;
				$('#'+prop).val(map[prop]);
			}
			if(flag){ $("#fold").trigger("click"); }
			callback(params);
		});
		
	}
	
	// 获得参数
	var getparams = function(index){
		index = index || 1;
		var limit    = $("#pageSize").val();
		var offset   = (index-1) * limit - CHANGE_COUNT; // 有个CHANGE_COUNT的概念，offset跟这个值有关
		offset       = (offset<0) ? 0:offset;
		// logger.info("offset = "+offset+", index = "+index+", change_count="+CHANGE_COUNT);
		// CHANGE_COUNT = 0;                               // reset change count，不需要reset...累加的。。
		var params = {
				"sourceType"	:$("#sourceType").val(),
				"dataType"		:$("#dataType").val(),
				"areaType"		:$("#areaType").val(),
				"keywordGroupId":$("#keywordGroupId").val(),
				"postId"		:$("#postId").val(),
				"originalId"    :$("#originalId").val().trim(),
				"operator"      :$("#operator").val(),
				"operatorType"  :$("#operatorType").val(),
				"status"        :$("#status").val(),
				"auditType" :$("#auditType").val(),
				"ip"           	:$("#ip").val(),
				"passport"		:$("#passport").val(),
				"userId"       	:$.isDigit($("#userId").val()) ? $("#userId").val():"-1",
				"authorId"      :$.isDigit($("#authorId").val()) ? $("#authorId").val():"0",
				"startTime"    	:$.parseTime($("#startTime").val(), "yyyy-MM-dd HH:mm"),
				"endTime"      	:$.parseTime($("#endTime").val(), "yyyy-MM-dd HH:mm"),
				"orderType"    	:$("#orderType").val(),
				"keyword"      :$("#keyword").val()==KEYWORDNOTE?"":$("#keyword").val().trim(),
				"keywordCount"  :$.isBlank($("#keywordCount").val())? 0:$("#keywordCount").val(),
				"keywordScope" 	:$("#keywordScope").val(),
				"forceLoad"	   :!$("#multiCensor").attr("checked"),
				"limit"        	:limit,
				"offset"	   	:offset
		};
		return params;
	}
	var threeList = new Array(100);
	var keywordList = new Array(100);
	// 查询数据
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
				value.checkTimeTxt   = value.checkTime == 0?" N/A": $.formatTime(value.checkTime, "yyyy-MM-dd HH:mm:ss");
				value.matchedKeywords = $.isBlank(value.matchedKeywords) ? "" : value.matchedKeywords;
				threeList[index]=value.matchedKeywords.split(",").length;
				keywordList[index]= value.matchedKeywords;
				value.dataTypeName=selectmap.dataTypeMap[value.dataType];
			});
			LIST = data;
			SIZE = data.length;
			$("#cs-list").render(listtmp, {"list":data});
			initlist();
		});
	}
	// 增加黑名单操作
	var onAddBlackUser = function(dialog, reason,duration){
		var index = $("#cs-list a.focus").attr("index");
		var item = LIST[index];
		var userid = item.userId.toString();
		var passport= item.passport;//有些是为空的
		var params = {"userId":userid,"passport":passport,"reason":reason,"duration":duration};
		
		if(!confirm("将账号 ["+userid+"] 加入黑名单，设置后，该用户发表的所有内容将被系统自动删除(慎用!!)，确定？")) return;
		$.postJSON(prefix+"/addblackuser.json", params, function(data){
			if(data){ 
				logger.info("操作成功!");
				$(dialog).dialog("close");
			}else{ 
				logger.error("操作失败!"); 
			}
		});
	}
	
	var onShowAddUserDialog = function(handler){
		$("#select-releasetime-dlg").removeOption(/./); //清空
		$("#select-releasetime-dlg").addOption(releasetimemap, false).selectOptions("1", true);
		$("#select-reason-dlg").selectOptions("-1", true);
		$("#supplement").val("");
		
		$("#dialog").dialog({
			"buttons": {
				"取消":function(){ $(this).dialog("close"); },
				"确定":function(){
					var code = $("#select-reason-dlg").val();
					var supp = $("#supplement").val();
					if(code == -1 && $.isBlank(supp)){
						logger.info("请选择/填写理由.");
						return;
					}
					var reason = (code == -1 ? "" : reasonmap[code]) +" "+ supp ;
					var duration=$("#select-releasetime-dlg").val();
					handler(this, reason,duration);
				}
			},
			"title"  : "加黑操作确认",
			"modal"  : true,
			"width"  : 450,
			"height" : 250
		});
		
	}
	/** 删除用户发表的所有 */
	var onDelAllUserPost = function(e){
		e.preventDefault();
		var passport = $(this).attr("passport");
		if(!confirm("将用户 ["+passport+"] 所有信息都删除吗(卷名，卷介绍，作品介绍，章节内容)？")) return;
		$.showLoading();
		logger.info("已提交后台处理~~ps.可以做其他操作，不影响的:)");
		$(this).attr("disabled", "disabled");
		$.postJSON(prefix+"/delalluserpost.json", passport, function(data){
			$.hideLoading();
			if(data>0){ logger.info("成功删除用户["+passport+"] "+data+" 条."); }else{ logger.error("操作失败!"); }
		});
	}
	
	/** 如果有操作记录，那么异步查询操作记录 */
	var showOpRecordIfExist = function(index){
		var item  = LIST[index];
		// 只有处于通过或者删除状态的数据有操作记录
		switch(item.status){
			//未审核也进行查询
			case 1000:
			case 2000: 
			case 3000:
				$.getJSON(prefix+"/queryoprecord.json", {"id":item.id},function(data){
					$.each(data, function(index, value){
						value.opTime = $.formatTime(value.opTime, "yyyy-MM-dd HH:mm");
						value.style  = (value.opType == 100) ? "s-fc7" : "s-fc8";
						value.opType = $.getOpType(value.opType);
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
			//$("#detail input.delUserAllbtn").click(onDelAllUserPost);
			$("#detail input.addBlackUser").click(function(e){ onShowAddUserDialog(onAddBlackUser); } );
			$(this).addClass("focus");
			showOpRecordIfExist(index);
			//先滚动到顶部
			/*$("#detail").scrollTop(0);
			var detailTop = $("#detail").offset().top;//全局高度
			var keywordTop = detailTop;
			var ruleTop = detailTop;
			if($("#detail .hilight").length>0) {
				keywordTop = $("#detail .hilight:first").offset().top;//全局高度
			}
			if($("#detail .rule-hilight").length>0) {
				ruleTop = $("#detail .rule-hilight:first").offset().top;
			}
			var theTop = keywordTop>ruleTop ? keywordTop:ruleTop;
			$("#detail").scrollTop(theTop-detailTop);*/
		}).keydown(function(e){ // 快捷键
			var key = e.which;
			switch(key){
				case 65: delAll();      break;         // A
				case  70: passAll(); break;						 // F 全过
				case 68: delItem(this); break;         // D
				case 71: submitData();  break;         // G
				case 83: passItem(this);     break;    // S
				case 87: case 38:previousItem(this); break;    // W 向上移动
				case 88: case 40:moveNext(this);     break;    // X 向下移动
				case 69: focusOnRed();break; //E 移动到红条目
				case 37: $("#cs-list a.focus").focus(); e.preventDefault(); break;
				
				default: break;
			}
		}).click(function(e){// 将点击事件变成focus动作
			e.preventDefault();
			$(this).focus();
		});
		$("#cs-list a:first").focus();// 初始化完毕之后focus到第一项
		passAllButThree();
		addMatchKeyOnTitle();
		
	}
	$("#next").click(function(e){
		e.preventDefault();
		querylist(++PAGE_INDEX); 
	});
	
	$("#previous").click(function(e){
		e.preventDefault();
		querylist(--PAGE_INDEX); 
	});
	
	// 移动到下一条
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
	
	var previousItem = function(currentItem){
		var index = parseInt($(currentItem).attr("index"));
		if(index > 0){
			$(currentItem).removeClass("focus").parent().prev().children("a").focus();
		}else{
			logger.info("已是第一条数据.");
		}
	}
	
	// 通过当前选中的项
	var passItem = function(currentItem){
		// 去掉删除class, 增加通过class
		$(currentItem).removeClass("s-fc7 unpass uncensor")
			.addClass("s-fc8 pass")
			.attr("newStatus", statusmap.PASS);
		$(currentItem).attr("style","none");
		moveNext(currentItem);
	}
	
	// 删除当前选中的项
	var delItem = function(currentItem){
		$(currentItem).removeClass("s-fc8 pass uncensor")
			.addClass("s-fc7 unpass")
			.attr("newStatus", statusmap.DELETE);
		$(currentItem).attr("style","none");
		moveNext(currentItem);
	}
	
	// 将整页数据标记为“删除”
	var delAll = function(){
		$("#cs-list a").removeClass("s-fc8 pass uncensor")
			.addClass("s-fc7 unpass")
			.attr("newStatus", statusmap.DELETE);
	}
	
	var passAll = function(){
		$("#cs-list a").removeClass("s-fc7 unpass uncensor")
		.addClass("s-fc8 pass")
		.attr("newStatus", statusmap.PASS);
	}


	var addMatchKeyOnTitle = function(){
		for(var i=0;i<$("#cs-list a").length;i++)
		{
			var title = $("#cs-list a").eq(i).text() + "("+keywordList[i]+")";
			$("#cs-list a").eq(i).text(title);
		}	
	}
	
	var passAllButThree = function(){
		if(onOffPass == 1)
		{$("#cs-list a").removeClass("s-fc7 unpass uncensor")
		.addClass("s-fc8 pass")
		.attr("newStatus", statusmap.PASS);
		//var index;
		for(var i=0;i<$("#cs-list a").length;i++)
		{
			if(threeList[i]>2)
			{
				//console.log($("#cs-list a").eq(i));
				//$("#cs-list a").eq(i).css("color","purple");
				$("#cs-list a").eq(i).removeClass("s-fc8 pass")
			.addClass("s-fc7 unpass")
			.attr("newStatus", statusmap.DELETE);
			}
		
		}}
		else if(onOffPass == 0)
		{
			for(var i=0;i<$("#cs-list a").length;i++)
			{
				if(threeList[i]>2)
				{
					//console.log($("#cs-list a").eq(i));
					$("#cs-list a").eq(i).css("color","purple");
				}
			
			}
		}
	}
	
	var focusOnRed = function()
	{
		for(i=0;i<$("#cs-list a").length;i++)
		{
			var item = $("#cs-list a").eq(i);
			if(item.hasClass("s-fc7 unpass")||item.attr("style")=="color: rgb(128, 0, 128);")
			{	
				if(item.attr("hasFocus") == "true")
				{
					continue;
				}
				else 
				{
					item.trigger("click");
					item.attr("hasFocus",true);
				}
				break;
			}
		}
		//console.log($("#cs-list a").eq(i).class());
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
						passDescriptions.push(item.url);
						break;
					case statusmap.DELETE  : 
						unpassids.push(item.id); 
						if(item.status == statusmap.PASS) {
							unpassDescriptions.push(item.url + " 误通过，修正")
						}else {
							unpassDescriptions.push(item.url);
						}
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
				"appTypeId":	1031,
				"dataType":		item.sourceType,
				"subDataType":	item.dataType,
				"qiType":		qiType,
				"newStatus":	newStatus,
				"oldStatus":	item.status,
				"oldOperator":  item.operator,
				"oldCheckTime": item.checkTime,
				"publishTime":  item.publishTime,//注意时间可能被转格式
				"ip":			item.ip,
				"passport":		item.passport,
				"userId":		item.userId,
				"title":		item.title,
				"msgId":		item.postId,
				"content":		item.content,
				"url":			item.url,
				"tableId":		item.id
			};
			params.push(p);
		});
		return params;
	};
	
	// 提交数据
	var submitData = function(){
		var queryStatus = parseInt($("#status").val());
		var params = getPassAndUnpassIds();
		params["_quuid"] = UUID;
		$.showLoading();
		$.postJSON(prefix+"/submit.json", params, function(data) {
			$.hideLoading();
			if(data){ 
				logger.info("提交成功!通过=["+params.passids.length+"], 删除=["+params.unpassids.length+"].");
				// 根据当前的状态调整offset
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

	$("#delall").click(delAll);
	
	$("#passall").click(passAll);

	$("#pass").click(function(event) {
		passItem($("#cs-list a.focus")[0]);
	});

	$("#del").click(function(event) {
		delItem($("#cs-list a.focus")[0]);
	});

	$("#submit").click(function(event) {
		submitData();
	});
	init();
});
