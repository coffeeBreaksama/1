var showContentTagsList = {};
$(document).ready(function() {
	var prefix = "/modules/image/mark/content";
	var statusMap = {"1":"未标记", "2": "已标记", "20": "忽略", "21": "正常"};
    var timeType = {"1":"插入时间", "2":"标记时间"};
    var currIndex = 0;
    var pageSize = {"1": "1"};
    var imageTagsTemp = {}; // 存放下一页每次取出的tags
    var tagsMap = {};
    var markType = {};
    var textMap = {1000:"文本内容"};
    var textLabel = 1000;
    var textMarkType = 1; // 标注类型 1文本 2人体
    var downData = new Array();
    var DownTime ;
    var currentUrl = "";
    var showTips = "<p/>如明显漏点但满足性感，轻微色情，色情掩盖任一标准时，需标注相关人物主体为目标范围"
                   + "<p/>Q:女下体 W:女乳房 E:男下体 R:手 T:脚" + "<p/>S:轻微色情 D:色情掩盖 " + "<p/>Z:性感 X:赤膊 C:卡通<p>"
                   + "<p/>1:提交 2:上一页 3:下一页 4:忽略<p>";
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");//"？~!@#$%^&*()_+-=,.。<>/?;:'[]{}《》"
    var shortcuts_tags = {"81":"女下体", "87":"女乳房", "69":"男下体", "82":"手", "84":"脚", "83":"轻微色情", "68":"色情掩盖", "90":"性感", "88":"赤膊", "67":"卡通" };

	var imageTemp = [
	   			'<ul id="images">',
                    '${list}.each(',
                    '<li style="position: relative;border:1px solid #CCC;text-align:center; width: 99.7%; height: 780px;">',
                    '    <div class="picDiv" style="width: 100%;" align="center">',
                    '       <img id="${i.id}" src="${i.showImgUrl}"/>',
                    '    </div>',
                    '    <div style="float:right;">${i.opDesc}</div>',
                    '</li>)',
	   			'</ul>' +
                '<div style="clear:both;"></div>'].join("");

	/** 初始化 */
	var init = function() {
        var selectMap = onGetSelectMap();
        tagsMap = selectMap.tagsMap;
        delete tagsMap[textLabel];
        showContentTagsList = tagsMap;//revertTagsMap(tagsMap);
        console.log(showContentTagsList);
        markType = selectMap.markType;
		$("#pageSize").addOption(pageSize, false);
		$("#status").addOption(statusMap, false).selectOptions("1", false);
		$("#tag").addOption("-1", "所有").addOption(illegalImage.tags, false);
        $("#timeType").addOption(timeType, false).selectOptions("1", false);
        $("#markType").addOption(markType, false).selectOptions(textMarkType, false);
        $("#importMarkType").addOption(markType, false).selectOptions(textMarkType, false);

        var now = new Date().getTime();
        var startTime = now - 150 * 86400000;
        var endTime = now + 86400000;
        $("#startTime").val($.formatTime(startTime, "yyyy-MM-dd 00:00"));
        $("#endTime").val($.formatTime(endTime, "yyyy-MM-dd 00:00"));
        $("#startTime").datetimepicker({ dateFormat: 'yy-mm-dd' });
        $("#endTime").datetimepicker({ dateFormat: 'yy-mm-dd' });

        if (markType == 2) { // 标注类型 1文本 2人体
            $("#contentTags").addOption(-1, "所有").addOption(showContentTagsList, false).selectOptions(-1, false);
            $("#classifyTags").addOption(-1, "所有").addOption(illegalImage.tagsBitMap, false).selectOptions(-1, false);
        } else {
            $("#contentTags").addOption(-1, "所有");
            $("#classifyTags").addOption(-1, "所有");
        }

		$("#query").click(onQuery);
		$(".updateBtn").live("click",onSave);
        $(".ignoreBtn").live("click", function() {
            onChangeStatus("20"); // 忽略
        });
        $(".resumeBtn").live("click", function() {
            onChangeStatus("1"); //（恢复为）未标记
        });
        $(".organNormalBtn").live("click", function() {
            onChangeStatus("21"); //正常
        });
        $("#exportXls").click(onExport);
        $("#exportImg").click(onExportImg);
        $("#exportSchedule").click(onExportSchedule);
        $("#uploadImg").click(function(){
            $("#upload").dialog("open");
            return false;
        });
        // 批量导入按钮
        $(".uploadBtn").click(function() {
            // 导入参数设置
            $("#importUrls").val("");
            $("#importDescription").val("");
            $("#batImport").dialog("open");
        });

        /** 批量导入对话框 */
        $("#batImport").dialog({
            "buttons" : {
                "取消" : function(e){$(this).dialog("close");},
                "确定" : onBatImport
            },
            "width"  : 800,
            "height" : 715,
            "modal"  : true,
            "title"  : "批量导入图片url",
            "autoOpen" : false
        });

        $("#upload").dialog({
           "width"   :800,
           "height"  :500,
           "modal"   :true,
           "title"   :"上传页面",
           "autoOpen":false
        });

        initFileUploader();

		onQuery();
		return false;
	};

	var revertTagsMap = function(tagsMap) {
	    var m = {};
        for (var key in tagsMap) {
            m[tagsMap[key]] = key;
        }
        return m;
	}

	/** 获得查询参数 */
	var getparams = function(index) {
		index = index || 1;
		var pagesize = $("#pageSize").val();
		var offset = (index < 1) ? 0 : (index - 1) * pagesize;

		var contentTags = $("#contentTags").val();
		var classifyTags = $("#classifyTags").val();

		var params = {
			"url" : $.trim($("#image_url").val()),
			"nosPath":$.trim($("#nosPath").val()),
			"status" : $("#status").val(),
			"multiMark" : $("#multiMark").attr("checked") == "checked",
			"limit" : pagesize,
			"offset" : offset,
            "markType" : $("#markType").val(),
			"orderStr" : "id DESC",//(($("#timeType").val()=="2")?"mark_time DESC":"id DESC"), 按标记时间来排序，否则会乱掉
			"operator" : $("#operator").val(),
			"tagsCode" : contentTags>=0?(1<<contentTags):0,
			"tagsCode1": classifyTags>=0?(1<<classifyTags):0,
		};
        var startTime = $.parseTime($("#startTime").val(), "yyyy-MM-dd HH:mm");
        var endTime = $.parseTime($("#endTime").val(), "yyyy-MM-dd HH:mm");
        if ($("#timeType").val() == "1") { // 插入时间
            params.iStartTime = startTime;
            params.iEndTime = endTime;
        } else { // 标记时间
            params.mStartTime = startTime;
            params.mEndTime = endTime;
            params.orderStr = "mark_time DESC";
        }

        // params
        console.log(params);
		return params;
	};

	/** 分页 */
	var pagination = function(previousPage) {
		var params = getparams(1);
		$.postJSON(prefix + "/query-count.json", params, function(data) {
			var pagesize = $("#pageSize").val();
			$("#count").text(data);
			$(".pagen").pagination(data, {
				"items_per_page" : pagesize,
				"num_edge_entries" : 1,
				"next_text" : "下一页",
                "current_page": previousPage,
				"prev_text" : "上一页",
				"callback" : function(index, con) {
                    currIndex = index;
                    console.info("currentIdx: "+currIndex);
					querylist(index + 1);
				}// 居然从0开始算，坑爹呢
			});
		});
	};

	/** 数据列表 */
	var querylist = function(index) {
		index = index || 1;
		var params = getparams(index);
		$.showLoading();
		$.postJSON(prefix + "/query-list.json", params, function(data) {
			$.hideLoading();
			showList(data);
		});
	};

	var onQuery = function(){
        $("html, body").scrollTop(0); // 滚动置顶
		pagination(currIndex); // (!previousPage)?0:previousPage
	};

	var showList = function(data){
		$(data).each(function(index, value) {
            value.index = index;
            currentUrl = value.showImgUrl;
            console.log(value.showImgUrl);
            value.opDesc = "";
			if(value.status != 1){//已标注
				value.opDesc = '<div>'+value.operator+'</div><div>'+$.formatTime(value.markTime, "yyyy-MM-dd HH:mm")+'</div>';
			}
			if ($("#markType").val() != textMarkType) {
			    value.opDesc += '<div><font color="red">'+showTips+'</font></div>';
			}

            // 解析tags
            imageTagsTemp = {};
            if (!imageTagsTemp[value.id]) {
                imageTagsTemp[value.id] = [];
            }
            var tags = value.tags.split(';');
            for (var i = 0; tags!="" && i < tags.length; i++) {
                var elemArr = tags[i].split(':');
                var tmpTag = {
                    id: i,
                    left: parseInt(elemArr[0]),
                    top: parseInt(elemArr[1]),
                    width: parseInt(elemArr[2] - elemArr[0]),
                    height: parseInt(elemArr[3] - elemArr[1]),
                    text: elemArr[4]
                };
                imageTagsTemp[value.id].push(tmpTag);
            }
            console.log(imageTagsTemp[value.id]);

            // 解析图像样本的原标注类型
            console.log("value.tags1 a " + value.tags1);
            if ($("#markType").val() != textMarkType && value.tags1 != '') {
                console.log("value.tags1 b " + value.tags1);
                var tagsOrg = "";
                var tagsarr = value.tags1.split(','); // 逗号分割标签
                for (var i = 0; i < tagsarr.length; i++) {
                    if (i != 0) {
                        tagsOrg += ",";
                    }
                    tagsOrg += illegalImage.tags[tagsarr[i]];
                }
                value.opDesc = "分类标签:" + tagsOrg + value.opDesc;
            }
		});

        LIST = data;
		$("#list").render(imageTemp, {"list":data});

        //console.log($( "div.picDiv" ))

        // 初始化tagger插件
        console.log("initPhotoTagger " + $("#markType").val() == textMarkType);
        console.log(tagsMap);
        initPhotoTagger($("#markType").val() == textMarkType ? textMap : tagsMap);
    };

    /** 初始化tagger插件 **/
    var initPhotoTagger = function(label) {
        // Set up the photo tagger.
        $('#j-dialog').remove();
        $( "div.picDiv" ).photoTagger({
            isTagCreationEnabled: true, // 允许创建
            isTagDeletionEnabled: true, // 允许删除

            // 加载已标注内容
            getTagsViaAjax: function(param, callback) {
                console.log("getTagsViaAjax:");
                console.log(imageTagsTemp[param.pid]);
                callback(imageTagsTemp[param.pid]); // pid默认取div.picDiv下的<img id='pid'>
            },

            // 回显检测值到输入框作为默认值
            showDetectText: function(param, callback) {
                var left = parseInt(param.left);
                var top = parseInt(param.top);
                var width = parseInt(param.width);
                var height = parseInt(param.height);
                var tagStr = left + ":" + top + ":" + (left + width) + ":" + (top + height);
                console.log(tagStr);
                $.showLoading();
                $.getJSON(prefix + "/query-detect-text.json", {"imgUrl": currentUrl, "coord": tagStr}, function(data) {
                    $.hideLoading();
                    console.log(data);
                    if(data != undefined) {
                        var ret = data.ret;
                        var rs = "";
                        for (var i = 0; i < ret.length; i++) {
                            rs = rs + ret.substr(i, 1).replace(pattern, '');
                        }
                        console.log("过滤标点符号后:" + rs);
                        callback(rs);
                    } else {
                        callback("");
                    }
                });
            },

            // 保存标注内容(add 操作)
            saveTagViaAjax: function(param, callback) {
                if ((param.key == textLabel && $("#markType").val() != textMarkType)
                || (param.key != textLabel && $("#markType").val() == textMarkType)) {
                    alert("error tag type");
                    return false;
                }
                if (!param.text || param.text == "") {
                    alert("label empty");
                    return false;
                }
                if (!imageTagsTemp[param.pid]) {
                    imageTagsTemp[param.pid] = [];
                }
                var len = imageTagsTemp[param.pid].length;
                if (len > 0) {
                    param.id = imageTagsTemp[param.pid][len - 1].id + 1;
                } else {
                    param.id = 0;
                }
                imageTagsTemp[param.pid].push(param);
                console.log("saveTagViaAjax:");
                console.log(imageTagsTemp[param.pid]);
                callback(param.id);
            },

            // 删除标注内容
            deleteTagViaAjax: function(param, callback) {
                for (var i = 0; i < imageTagsTemp[param.pid].length; i++) {
                    if (imageTagsTemp[param.pid][i].id == param.id) {
                        imageTagsTemp[param.pid].splice(i, 1);
                    }
                }
                console.log("deleteTagViaAjax:");
                console.log(imageTagsTemp[param.pid]);
                callback();
            },

            currentLabelKey: $("#markType").val() == textMarkType ? textLabel : 1, // 默认激活的标签

            textLabelKey: textLabel, // 指明文本标注对应ID

            labels: label
        });
    };

	var onSave = function(){
		var changeObjs = [];
		for(var k in imageTagsTemp){
            var tagStr = "";
			var tags = imageTagsTemp[k];
            console.log("submit imageTagsTemp: ", tags);
            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i];
                if (tag.text == "") {
                    continue;
                }
                if (i != 0) {
                    tagStr += ";";
                }
                tagStr += tag.left + ":" + tag.top + ":" + (tag.left + tag.width) + ":" + (tag.top + tag.height) + ":" + tag.text;
            }
            console.log("submit tagStr:", tagStr);
            if (tagStr != "") {
                var imgs = new Image();
                imgs.src = document.getElementById(k.toString()).src;
                console.log("submit width: " + imgs.width + " height: " + imgs.height);
                var obj = {
                    id : k,
                    tags : tagStr,
                    width : imgs.width,
                    height : imgs.height
                };
                changeObjs.push(obj);
            }
		}
		console.log(changeObjs);
		if (changeObjs.length == 0) {
            console.log("change obj empty!");
            logger.info("没有需要提交的标注数据！");
            return;
		}
		$.showLoading();
		$.postJSON(prefix + "/submit.json", {"markedSamples": changeObjs}, function(data) {
			$.hideLoading();
			if(data){
                logger.info("提交成功!标记样本=["+ imageTagsTemp.length +"]条.");
                console.info("提交后："+currIndex);
				onQuery(currIndex);
			}else{
				logger.error("提交失败!");
			}
		});

		return false;
	};

    var onChangeStatus = function(status){
        console.log("onChangeStatus " + status);
        var changeObjs = [];
        for(var k in imageTagsTemp){
            var obj = {
                id : k,
                markTime : new Date().getTime(),
                status : status
            };
            changeObjs.push(obj);
        }
        $.showLoading();
        $.postJSON(prefix + "/submit.json", {"markedSamples": changeObjs}, function(data) {
            $.hideLoading();
            if(data){
                logger.info("提交成功!");
                console.info("提交后："+currIndex);
                onQuery(currIndex);
            }else{
                logger.error("提交失败!");
            }
        });

        return false;
    };

    var onBatImport = function(){
        var urls = $("#importUrls").val().split(/\r?\n/).filter(function(value) { // 这里filter一下，去掉空白输入
            if (!$.isBlank(value)) {
                return true;
            }
            return false;
        });
        if (urls.length == 0) {
            alert("输入图片url不能为空!");
            return false;
        }
        if(!confirm("批量导入图片url，处理过程比较漫长，请耐心等待，确认处理")){
            return false;
        }
        $(this).attr("disabled", "disabled");
        var params = {
            "source" : $("#importSource").val(),
            "urls" : urls, // 导入的url
            "description" : $("#importDescription").val().trim()
        };
        var holder = this;
        $.showLoading();
        $.postJSON(prefix + "/bat-import-urls.json", params, function(data){
            $.hideLoading();
            if(data.success){
                logger.info("导入成功, 总计导入" + data.totalCount + "条数据");
                $(holder).dialog("close");
                onQuery();
            }else{
                alert("导入失败, 总计导入" + data.totalCount + "条数据, 失败" + data.errorCount + "条, 请前往失败图像页面查看");
            }
        })
    };

    var onExport = function(){
        var params = getparams(1);
        params["orderStr"] = "id ASC";
        params["limit" ] = -1;
        params["offset" ] = -1;
        var url = prefix+"/export-image-sample.json?" + $.param(params);
        window.open(url);
        return false;
    };
    var onExportImg = function(){
        $("#exportSchedule").show();
        DownTime = new Date().getTime() + "";
        var params = getparams(1);
        params["orderStr"] = "id ASC";
        params["limit" ] = -1;
        params["offset" ] = -1;
        params["description"] = DownTime;   //下载查询中，description字段是用不到的，临时用作新建文件夹的名字
        var url = prefix+"/export-image-list.json?" + $.param(params);
        window.open(url);
    };

    var onExportSchedule = function(){
        var params = getparams(1);
        params["orderStr"] = "id ASC";
        params["limit" ] = -1;
        params["offset" ] = -1;
        params["description"] = DownTime;
        $.postJSON(prefix + "/export-image-DownSchedule.json", params, function(data) {
            if(data["all"] >= data["down"]){
                alert("共" + data['all'] + "张图片，已准备好" + data["down"] + "张图片，请耐心等待");
            }else{
                alert("正在传输zip文件流，所耗费时间较长，请耐心等待");
            }
        });
    }

    var onGetSelectMap = function () {
        var selectMap = {};
        jQuery.ajax({
            'type': 'GET',
            'url': prefix + "/query-select-map.json",
            'contentType': 'application/json',
            'dataType': 'json',
            async: false, // 同步等待
            'success': function (data) {
                selectMap = data;
            }
        });
        return selectMap;
    };

	/**
	 * 初始化上传文件
	 */
	var initFileUploader= function(){
		//实例化一个plupload上传对象
	    uploader = new plupload.Uploader({
	        browse_button : 'selectUpload', //触发文件选择对话框的按钮，为那个元素id
	        flash_swf_url : '/js/jquery/plupload/Moxie.swf',
	        filters: {
	  		  mime_types : [ // 允许上传的文件后缀
	  		    { title : "txt文件", extensions : "txt" },
	  		  ],
	  		  max_file_size : '51200kb', //最大只能上传50MB的文件
	  		  prevent_duplicates : true, //不允许队列中存在重复文件
	  		  multi_selection : false
	  		},
	        url : prefix + '/upload.json' //服务器端的上传页面地址
	    });

	    var queueMaxima = 1;//限制每次只能上传一个文件

	    //绑定文件添加进队列事件
		uploader.bind('FilesAdded',function(up,files){
			// Check if the size of the queue is bigger than queueMaxima
		    if(up.files.length > queueMaxima)
		    {
		        // Removing the extra files
		        while(up.files.length > queueMaxima)
		        {
		            if(up.files.length > queueMaxima)
		            	up.removeFile(up.files[0]);
		        }
		    }
	    	var file_name = files[0].name; //文件名
			//构造html来更新UI
			var html = '<li id="file-' + files[0].id +'"><p class="file-name">' + file_name + '</p><p class="progress"></p></li>';
			$('#file-list').html(html);
		    //return true;
		});

        // 上传文件
		uploader.bind('UploadFile', function(up, files){
			$.showLoading();
	    });

        uploader.bind('BeforeUpload', function(uploader, filters) {
                uploader.settings.url =  uploader.settings.url+'?markType='+$("#importMarkType").val();
              }
        );
	    //成功提示
	    uploader.bind('FileUploaded',function(up,file,responseObject){
	    	$.hideLoading();
            if(!$.isBlank(responseObject.response)){
                $.hideLoading();
                if (uploader.files.length > 0) {
                    uploader.removeFile(uploader.files[0]);
                }
                $('#file-list').html("");
                alert("上传成功!");
	    	} else {
				alert("上传失败!");
			}
	    	location.reload(true);
	    });

	    // 上传完成
	    uploader.bind('UploadComplete', function(up, files){
	    	up.destroy(); // for example. Should destroy the corresponding DOM elements too (drag-drop-container+'i' and possibly 'media-container'+i)
	     });

	    //上传按钮
	    $('#start_upload').bind('click', function() {
	    	if(uploader.files.length>0){
	    		uploader.start();
	    	}else{
	    		alert("请选择要上传的文件！");
	    		return false;
	    	}
    	});

		//在实例对象上调用init()方法进行初始化
	    uploader.init();
	};

	init();

    /**
     * 新增色情快捷键的支持, 直接绑定在body上
    **/
    $("body").on("keydown", function(e){
        shortcutsOperation(e)
        markOrganTags(e);
    });

    /**
     * 操作快捷键
     * 1 提交更新
     * 2 上一页
     * 3 下一页
     * 4 忽略
     **/
    var shortcutsOperation = function(e) {
        if ($("#markType").val() == textMarkType) {
            return;
        }
        if (e.which == "49") {
            $(".updateBtn").trigger("click");
        } else if (e.which == "50") {
            $(".prev").trigger("click");
        } else if (e.which == "51") {
            $(".next").trigger("click");
        } else if (e.which == "52") {
            $(".ignoreBtn").trigger("click");
        }
    }

    /**
     * 标签快捷键
     * Q 女下体
     * W 女乳房
     * E 男下体
     * R 手
     * T 脚
     * S 轻微色情
     * D 色情掩盖
     * Z 性感
     * X 赤膊
     * C 卡通
     */
    var markOrganTags = function(e) {
        if($("#j-dialog").css('display') == 'none'){
            // console.log("dialog not visible");
            return;
        }
        var txt = shortcuts_tags[e.which];
        if(!txt){
            return;
        }
        // console.log("code = "+e.which+", txt = "+txt);
        var $labels = $("#j-pt-labels").find('span:contains("'+txt+'")');
        if($labels.size() == 0){// 仅针对人体部位标注, 其他弹出框是找不到这些label的
            // console.log("not found!");
            return;
        }else{
            $labels.trigger("click");
            $("#j-pt-ok").trigger("click");
        }
    }
});

var markTypeChanged = function(e) {
    var markType = $(e).val();
    $("#contentTags").empty();
    $("#classifyTags").empty();
    if (markType == 2) { // 标注类型 1文本 2人体
        $("#contentTags").addOption(-1, "所有").addOption(showContentTagsList, false).selectOptions(-1, false);
        $("#classifyTags").addOption(-1, "所有").addOption(illegalImage.tagsBitMap, false).selectOptions(-1, false);
    } else {
        $("#contentTags").addOption(-1, "所有");
        $("#classifyTags").addOption(-1, "所有");
    }
}
