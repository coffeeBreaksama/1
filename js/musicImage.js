
$(document).ready(function() {
	//alert("1");
	var prefix     = "/modules/censor/music";
//	var urlpat     = "http://t.163.com/%s/status/%s";
	var statusmap  = {"NOT_HIT":0, "UNCENSOR":1000, "PASS":2000, "DELETE":3000};
	var statusclaz = {"-1":"", "0":"", "1000":"s-fc2", "2000":"s-fc8", "3000":"s-fc7"};
	var statusopts = {"-1":"所有", "0":"未触犯", "1000":"未审核", "2000":"已通过", "3000":"已删除"};
	//var randomserver = ['a','b','c'][$.random(3)]+[1,2,3,4,5,6,7,8][$.random(8)];
	var thumbnailmap = {"1":"相册缩略图服务","2":"有道缩略图服务","3":"无缩略图服务","100":"产品缩略图服务"};
	var LIST;            // 数据list
	var PAGE_INDEX   = 1;
	var CHANGE_COUNT = 0;
	var AREA_IMAGE   = 80;
	var UUID = "";
	var KEYWORD_HINT = "支持1-3个关键词搜索，关键词间使用空格分隔！";
	
	var imglist = '${list}.each('+
			    '<li class="mb-image" style="height:180px;">'+
				'    <div class="mb-imagebox"><a aid="${i.id}" href="#" class="smallimage"><img class="${i.style}" src="${i.thumbnail}" width="120px" height="120px"/></a>'+
				'    </div>'+
				'       <div class="j-checkbox-wrap">'+
				'				<span id="j-checkbox-img-${i.id}" class="j-checkbox ${i.style}">'+
				'				<div class="j-checkbox-checkmark"></div>'+
				'			</span>'+
				'		</div>'+
				'    <div class="info" style="text-align:center;">'+
				'    <div>'+
				'		<span class="${i.statusClass}">操作人: ${i.operatorRealName} ${i.checkTimeStr}</span>'+
				'    </div>'+
				'		<div style="padding-bottom:5px;"><div style="display: inline-block;">'+
				'		<p class="${i.statusClass} ${i.operatorRealName}">描述: ${i.operator}</p>'+
                '       <input style="font-size:12px" class="adduntrustlist" type="button" value="敏感" index="${i.index}" />'+
				'       <span class="${i.statusClass}">${i.statusText}</span>'+
				'       <a href="/modules/censor/music/music-info-detail.html?type=1&url=${i.userId}" target="_blank" title="用户详细信息">用户信息</a></div>'+
				'		<a href="${i.content}" class="fdimage"><img title="查看原图" src="/images/fd.png" style="border:0px;"/></a>'+
				'       <span style="display:none;"><input class="delcheck pl5 ${i.style}" img="${i.content}" type="checkbox" status="${i.status}" id="${i.id}" publishtime="${i.publishTime}" passport="${i.passport}"/><label for="${i.id}">选择</label></span>'+
				'    </div>'+
				'    </div>'+
				'</li>)';
	
	var isNotImageType = function(){
        return !($("#dataType").val() == 1 || $("#dataType").val() == 10 || ($("#dataType").val() == 5 && $("#ext").attr("checked")));
//		return $("#dataType").val() != 1 && $("#dataType").val() != 4 && $("#dataType").val() != 9 && $("#dataType").val() != 13 && $("#dataType").val() != 16;
	}
	
	/** 查询按钮事件 */
	var onQuery = function(){
		if(isNotImageType()) return;
		$("#csarea").hide();
		$("#csimages").show();
		CHANGE_COUNT = 0; // 只需要在每次查询的时候重置一下
		pagination();
	}
	
	var pagination = function(){
		var params = getparams();
		$.showLoading();
		$.postJSON(prefix+"/querycount.json", params, function(data) {
			$.hideLoading();
			$(".imgCount").html(data);
			var pagesize = $("#pageSize").val();
			$(".pagen").pagination(data, {
				"items_per_page":pagesize,
				"num_edge_entries":1,
				"next_text":"下一页",
				"prev_text":"上一页",
				"callback":function(index,con){querylist(index+1);}// 居然从0开始算，坑爹呢
			});
		});
	}
	
	// 查询数据
	var querylist = function(index){
		UUID = $.randomUUID();
		index = index || 1;
		var params = getparams(index);
		params["_quuid"] = UUID;
		
		$.showLoading();
		$.postJSON(prefix+"/querylist.json", params, function(data) {
			$.hideLoading();
			if(data.length == 0){
				logger.info("无数据.");
			}
			$.each(data, function(index, value){
				value.index = index;
				value.statusText  = statusopts[value.status];
				value.statusClass = statusclaz[value.status];
				switch(value.status){
					case statusmap.NOT_HIT : value.style = "uncensor";     break;
					case statusmap.UNCENSOR: value.style = "uncensor";     break;
					case statusmap.PASS    : value.style = "s-fc8 pass";   break;
					case statusmap.DELETE  : value.style = "s-fc7 unpass"; break;
				}
				if($("#dataType").val() == 5 && value.content[0] == '<'){  //私信图片开始上线时要做个兼容，他保存的是<img src="http://p3.mus">
                    value.content=value.content.replace(/<img src=\"([^\"]*?)\">/gi,function(){
                        return arguments[1];
                    });
                }
//				value.url         = $.sprintf(urlpat, value.screenName, value.microBlogIdStr);
				value.thumbnail   = $.getThumbnailURL(value.content, "120x120", $("#thumbnail").val()); // 增加略缩图服务选项
				//使用产品缩略图服务
				/**
				 * 陆俊峰 -  说: (2015-02-06 10:48:05)
					歌单、专辑: 224y224   节目：100y100   头像：120y120   电台: 200y200  个人背景:640y640
					陆俊峰 -  说: (2015-02-06 10:48:38)
					节目没有224，100y100如果不满足你们的话，我们只有另外一种640y640尺寸的了
				 */
				if($("#thumbnail").val()==100){
					if(value.dataType==1){//歌单封面
						value.thumbnail=value.content+"?param=224y224";
					}else  if(value.dataType==4){//头像
						value.thumbnail=value.content+"?param=120y120";
					}else  if(value.dataType==9){//背景
						value.thumbnail=value.content+"?param=640y640";
					}else  if(value.dataType==13){//电台封面
						value.thumbnail=value.content+"?param=200y200";
					}else  if(value.dataType==16){//节目封面
						value.thumbnail=value.content+"?param=100y100";
					}else  if(value.dataType==19){//专栏封面
						value.thumbnail=value.content+"?param=100y100";
					}
				}
				
				value.publishTimeTxt = $.formatTime(value.publishTime, "yyyy-MM-dd HH:mm:ss");
				value.checkTimeStr = value.checkTime == 0?" N/A": $.formatTime(value.checkTime,"MM-dd HH:mm");
				value.checkTimeTxt   = value.checkTime == 0?" N/A": $.formatTime(value.checkTime, "yyyy-MM-dd HH:mm:ss");
			});
			LIST = data;
			$("#cs-list-img").render(imglist, {"list":data});
			// 非机器审核的重复图片，隐藏“描述”
			$('.info p:not(.机器)').hide();
			$(".smallimage").click(function(e){
				e.preventDefault();
				var checkbox=$("#j-checkbox-img-"+$(this).attr("aid"));
				var checked=checkbox.hasClass("j-checkbox-checked");
				if(checked){
					checkbox.removeClass("j-checkbox-checked");
					$(this).children("img").removeClass("j-checkbox-img");
					$("#"+$(this).attr("aid")).removeAttr("checked");
				}else{
					checkbox.addClass("j-checkbox-checked");
					$(this).children("img").addClass("j-checkbox-img");
					$("#"+$(this).attr("aid")).attr("checked", "true");//选中隐藏的checkbox。这样其他代码就不用改了
				}
			});
			$("#cs-list-img .j-checkbox-wrap .unpass").addClass("j-checkbox-checked");
			$("#cs-list-img img.unpass").addClass("j-checkbox-img");
			$("#cs-list-img input.unpass").attr("checked", "checked");
			$("a.fdimage").fancybox({"type":"image","hideOnContentClick":true,"speedIn":100,"speedOut":100,"autoDimensions":false, "autoScale":false});
            $(".adduntrustlist").click(function(e) {
                var index = $(this).attr('index');
                var item = LIST[index];
                if(item.userId == 0){
                    return ;
                }
                $.showLoading();
                var reason = "彭丽媛-"+item.content;
                $.postJSON(prefix+"/addsensitivelist.json", {"callback":item.callback, "reason":reason, "dataType":item.dataType}, function(data) {
                    $.hideLoading();
                    if(data) {
                        logger.info("操作成功!")
                    } else {
                        logger.error("操作失败!");
                    }
                });
            });
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
				"passport"	   :$("#passport").val(),
				"ext"		   :$("#ext").attr("checked") ? 1:0,
				"suspectType"  :$("#suspectType").val(),
			    "distinctImage":$("#isDistinctImage").is(":checked") ? true : false,
				"limit"        :limit,
				"offset"	   :offset
		};
		return params;
	}
	
	/**
	 * 记录质检数据的参数
	 */
	var getQIParams = function(data){
		var passids = data.passids;
		var unpassids = data.unpassids;
		var params = new Array();
		$.each(LIST, function(index, value){ // LIST存储有数据的旧状态
			var id = value.id;
			var oldStatus = value.status;
			var newStatus = 0;
			var qiType = 0;
			var needPush = false;
			if(oldStatus==1000 || oldStatus==0){
				return;
			}
			if (oldStatus == 2000 && $.arrayContains(unpassids, id)) { // 旧状态是通过的
				qiType = 1; // 误通过
				newStatus = 3000;
				needPush = true;
			} else if (oldStatus == 3000 && $.arrayContains(passids, id)) { // 旧状态是删除的
				qiType = 2; // 误删除
				newStatus = 2000;
				needPush = true;
			}else{
				qiType = 3; // 已通过
				newStatus = oldStatus;
				needPush = true;
			}
			if (needPush) {
				var content = '<img src="'+ value.content +'"/>';
				var p = {
						"appTypeId":	1085,
						"dataType":		value.dataType,
						"subDataType":	value.areaType,
						"qiType":		qiType,
						"newStatus":	newStatus,
						"oldStatus":	oldStatus,
						"oldOperator":  value.operator,
						"oldCheckTime": value.checkTime,
						"publishTime":  value.publishTime,//注意时间可能被转格式
						"ip":			value.ip,
						"passport":		value.passport,
						"userId":		value.userId,
//						"nickName":		value.nickName,
//						"title":		item.title,
						"msgId":		value.musicId,
						"content":		content,
//						"url":			value.url,
						"tableId":		value.id
				};
				params.push(p);
			}
		});
		return params;
	};
	
	var onSubmit = function(e){
		var passids = [], unpassids=[], passImages=[], unpassImages=[], maxPublishTime = 0;
		$("#cs-list-img .delcheck").each(function(index, value){
			var nowstatus=$(this).attr("status");
			if($(this).is(":checked")){
				if(nowstatus!=3000){
					unpassids.push($(this).attr("id"));
					if(maxPublishTime < $(this).attr("publishtime")){
						maxPublishTime = $(this).attr("publishtime")
					}
					if($("#isDistinctImage").is(":checked")){
						unpassImages.push($(this).attr("img"));
					}
				}
			}else{
				if(nowstatus!=2000){
					passids.push($(this).attr("id"));
					if(maxPublishTime < $(this).attr("publishtime")){
						maxPublishTime = $(this).attr("publishtime")
					}
					if($("#isDistinctImage").is(":checked")){
						passImages.push($(this).attr("img"));
					}
				}
			}
		});
		
		var params =getparams();
		params.limit=-1;
		params.offset=-1;
		params.passids=passids;
		params.unpassids=unpassids;
		params.maxPublishTime=maxPublishTime;
		params.passImages=passImages;
		params.unpassImages=unpassImages;
		params._quuid=UUID;
		
		
		$.postJSON(prefix+"/submitImages.json", params, function(data) {
			$.hideLoading();
			if(data){ 
				logger.info("提交成功!通过=["+params.passids.length+"], 删除=["+params.unpassids.length+"].");
				//勾选了质检
				if($("#isQualityInspection").is(":checked")){
					$.addQualityInspection(getQIParams(params));
				}
				onQuery();
				$("#top").focus();
			}else{
				logger.info("提交失败!");
			}
		});
	}
	
	var init = function(){
		$("#thumbnail").addOption(thumbnailmap, false).selectOptions("1", true); // 增加略缩图选项，默认使用相册
		$("#querybtn").click(onQuery);
		$(".img-delbtn").click(onSubmit);
		onQuery();
	}
	$("#dataType").change(function(){
		if($("#dataType").val()==5){
			$("#thumbnail").addOption(thumbnailmap, false).selectOptions("3", true);
		}else {
			$("#thumbnail").addOption(thumbnailmap, false).selectOptions("1", true);
		}
	})
	init();
});
