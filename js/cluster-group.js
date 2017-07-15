	//alert("surprise matherfucker!");
	//对应的类别：HDEL色情，IDEL广告，JDEL违禁，KDEL暴恐，MDEL涉政，NDEL谩骂，XDEL灌水，PASS通过，PASSALL全通过
	var autoMain = 0;
	var delListWord = new Array();
	delListWord[0] = "傻逼:NDEL";//前面是要搜索的关键词，后面是类别，看上面，中间用英文符号:隔开
	delListWord[1] = "傻叉:NDEL";
	delListWord[2] = "操你妈:NDEL";
	delListWord[3] = "草泥马:NDEL";


require.config({
    baseUrl : '/javascript/lib',
    paths : {
        'jquery.pagination' : 'jquery.pagination.input',
        'jquery.selectboxes': 'jquery.selectboxes.pack',
        'jquery.checkfs': 'jquery.checkfs'
    },
    shim : {
        'jquery.pagination' : {
            deps : [ 'jquery' ],
            exports : '$'
        },
        'jquery.selectboxes' : {
            deps : [ 'jquery' ],
            exports : '$'
        }
    }
});
// require config
require([ '/javascript/lib/config.js' ], function(config) {
//////////////////////////////////////////////////////////////////////////////////	
    config.push('jquery.pagination');
    config.push('jquery.selectboxes');
    config.push('jquery.checkfs');
    require(config, function($) {
		////////////////////////////////
function whileDelay(func)
{
	function delayExecut(num,func)
	{
		var flag = true;
		var delayVal = window.setInterval(function(){
			flag = false;
			func();
			executingFlag = 0;
			delayVal = window.clearInterval(delayVal);		
		},num);
		//while(flag){};
	}
	function searchStr(str)
	{
		$("#keyword").val(str);
		//$(".u-check input").find("name:multiable").attr("checked",false);
		console.log("search " + str);
		$("#queryBtn").trigger("click");
	}
	function checkContinueSubmit()
	{
		if($('#checklist a').length > 0)
		{
			step = 1;
		}
		else
		{
			nowDelWordIndex += 1;
			if(nowDelWordIndex >= delListWord.length)
			{
				nowDelWordIndex = 0;
			}
			step = 0;
		}
	}
	
	function delList(action)
	{
		if($('#checklist a').length == 0)
		{
			console.log("无数据");
			return;
		}
		for(var i = 0;i < $("#checklist a").length;i++)
		{
			if($('#checklist a.z-select')!= null)
			{
				dealItem(action);
			}
		}
		$("#cancelBtn").trigger("click");
		submit();
		/* curPage++;//后面改成submit;
		$("#queryBtn").trigger("click"); */
	}
	
	var executingFlag = 0;
	var ajaxStop = 0;
	var step = 0;
	var nowDelWordIndex = 0;
	var Main = window.setInterval(function(){
		var ajaxFlag = $(".msg").length;
		if(ajaxFlag > 0)
		{
			ajaxStop = 1;
			console.log("ajax stop");
		}
		else
		{
			ajaxStop = 0;
			//console.log("executing");
		}
		if(ajaxStop == 0&&executingFlag == 0&&autoMain == 1){
			switch(step)
			{
				case 0: 
					console.log(step+"start");
					executingFlag = 1;
					delayExecut(1000,function(){
						searchStr(delListWord[nowDelWordIndex].split(":")[0]);
						step = 1;
					});
				break;
				case 1: 
					console.log(step+"start");
					executingFlag = 1;
					delayExecut(1000,function(){
						delList(delListWord[nowDelWordIndex].split(":")[1]);
						step = 2;
					});
				break;
				case 2: 
					console.log(step+"start");
					executingFlag = 1;
					delayExecut(2000,function(){
						checkContinueSubmit();
					});
				break;
				case 3: 
					console.log(step+"start");
					executingFlag = 1;
					delayExecut(3000,function(){
						console.log("3s end"+step);
						step = 4;
					});
				break;
				case 4: 
					console.log(step+"start");
					executingFlag = 1;
					delayExecut(3000,function(){
						console.log("3s end"+step);
						step = 5;
					});
				break;
				case 5: 
					console.log(step+"start");
					executingFlag = 1;
					delayExecut(3000,function(){
						console.log("3s end"+step);
						step = 6;
					});
				break;
				case 6: 
					console.log("end");
					step = null;
				break;
				case -666: 
					console.log("End autoSearch");
					Main = window.clearInterval(Main);
				break;
				default:break;
			}
		}
		
		
		
	},1*1000);
}
whileDelay();
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  // fullscreen initial
      $('#workspace').checkfs({originId:"#originPosition"});

    	var getmapurl = "/censor/cluster/get-text-group-target-map.json";
    	var queryrecordurl = "/base/query-data-record.json";
		var counturl = "/censor/cluster/query-count.json";
		var dataurl = "/censor/cluster/query-data.json";
		var showdetail = "/censor/cluster/show-detail.json";
		var submiturl = "/censor/cluster/submit.json";
		var addUrl = "/manage/cluster/spam/add.json";
		var qualityInspectionUrl="/manage/quality/batch-insert.json";
		var curPage = 1;
    	var totalPage;
		var DEL_INDEX=[];
		var PASS_INDEX=[];
		var keymap = {
				"65" : "DELALL",
				"68" : "DEL",
				"53" : "HDEL",
				"52" : "IDEL",
				"55" : "JDEL",
				"56" : "KDEL",
				"54" : "MDEL",
				"49" : "NDEL",
				"50" : "XDEL",
				"48" : "PASS",
				"83" : "PASS",
				"96" : "PASS",
				"71" : "SUBMIT",
				"87" : "UP",
				"40" : "DOWN",
				"104" : "KDEL",
				"98" : "XDEL",
				"100" : "IDEL",
				"102" : "MDEL",
				"101" : "HDEL",
				"103" : "JDEL",
				"97" : "NDEL",
				"70" : "PASSALL"
			};
		var statusmap = {
				"DELETE" : "3000",
				"PASS" : "2000"
			};
		var qualityInspectionStatus={
				"UNKNOWN":0,
				"WUPAN":1,
				"LOUPAN":2,
				//质检结果优化
				"HUMAN_WUPAN":3,//人工误判
				"MACHINE_WUPAN":4,//机器误判
				"MACHINE_LOUPAN":5,//机器漏判
				"TO_BE_OPTIMIZED":6 //待优化状态
		};
		var textstatusmap = {
				"NO_RULE_HIT":"0",
				"UN_CENSORED":"1000",
				"PRECENSOR":"1500",
				"DELETE" : "3000",
				"PASS" : "2000"
			};
		var operatorTypeMap ={
				"UNKNOW":0,
				"HUMAN":2,
				"MACHINE":4,
				"PRODUCT_ADMIN":8
			};
		var statusDescMap={
				"0":"未触犯规则",
				"1000":"未审核",
				"1500":"预审",
				"2000":"审核通过",
				"3000":"审核删除"
		};
		var statusstylemap = {
				"0" : "",
				"1000" : "",
				"1500" : "",
				"2000" : "z-pass",
				"3000" : "z-del"
			};
		var levelmap = {
				"0":"低危",
				"2":"高危"
		};
		var opcolormap  = {
				"1000":"grey",
				"2000":"#23a78f",
				"3000":"#f00"
		};
		var optypemap  = {
				"1000":"先发后审",
				"2000":"审核通过",
				"3000":"审核删除"
		};
		var listTypeMap = {
		        "0" : "正常",
                "1" : "白名单",
                "2" : "黑名单",
                "4" : "必审名单",
                "8" : "预审名单"
        };
		var productMap;
		var productTargetMap;
		var requestMap;
		var LIST = [];
		var allLabels = ["100","200","300","400","500","600","700"];
    	//url查询字符串对象
    	var map = $.getParamMap(window.location.toString());
    	if((map.groupId==null || map.groupId=='undefined')){
    		logger.error("访问错误!");
    		return;
    	}

    	/**
    	 * 选择产品后，业务随产品ID做级联更新
    	 */
    	var onChangeProduct = function(){
    		$("#targetId").removeOption(/../);
    		if($("#productId").val()!=-1){
    			$("#targetId").addOption(productTargetMap[$("#productId").val()] , false);
    		}
    		$("#targetId").addOption({"-1":"所有"},false);

			//酷狗这个线上用户等级选所有
			if($("#productId").val() == 5177){
				$("#level").val("-1");
			}else{
				$("#level").val("2");
			}
    	}

        var init = function() {
        	$.ipAccountInit(8);
        	requestMap= $.getParamMap(window.location.toString());
    		$.postForm(getmapurl, {"groupId":map.groupId}, function(result){
				productMap = result['data'].productMap;
				productTargetMap  = result['data'].productTargetMap;

				//默认选第一个产品
				var productId = -1;
				for (var prop in productMap) {
					if (productMap.hasOwnProperty(prop)) {
						productId = prop;
						break;
					 }
				}

				//初始化产品和业务列表框
				$("#productId").change(onChangeProduct);
				$("#productId").val(productId);
	    		$("#targetId").addOption({"-1":"所有"},false);
				$("#productId").addOption(productMap, false);
				if(requestMap["productId"]!=undefined){
   					$("#productId").selectOptions(requestMap["productId"],true);
   					onChangeProduct();//手工触发一次
   				}
				if(requestMap["targetId"]!=undefined){
   					$("#targetId").selectOptions(requestMap["targetId"],true);
   				}
				$("#productId").chosen({no_results_text: "未找到匹配项"});
				query();
    		});
            $('.j-date').datetime();
			$('#queryBtn').click(function(e) {
				e.preventDefault();
				curPage = 1;
				query();
			});
			$("#pageSize").val("50");
			// dialog init
			$("#clusterDetailDlg").dialog({
				dialogClass : 'm-modal', // 此配置项为必需项
				autoOpen : false,
				width : 1000,
				height : 500,
				modal : true,
        close: function() {
            $(this).dialog("close");
            $('#workspace').hide();
            setTimeout(function() {
                $('#workspace').show();
            }, 0);
        },
				buttons: [
					{
	                    text: "确定",
	                    click: function() {
	                        $(this).dialog("close");
                          $('#workspace').hide();
                          setTimeout(function() {
                              $('#workspace').show();
                          }, 0);
	                    }
                	}
				],
	        	open: function(event, ui) {
				}
			});
			$("#conformDlg").dialog({
				dialogClass : 'm-modal', // 此配置项为必需项
				autoOpen : false,
				width : 425,
				height : 260,
				modal : true,
				buttons: [
					{
	                    text: "确定",
	                    click: function() {
	                    	var clusterType = $('input:radio[name=clusterType]:checked').val();
	                    	var spamStr = "";
	                    	switch(clusterType){
		                    	case "100":
		                    		spamStr="<b>[色情]</b>";
		                    		break;
		                    	case "200":
		                    		spamStr="<b>[广告]</b>";
		                    		break;
		                    	case "300":
		                    		spamStr="<b>[暴恐]</b>";
		                    		break;
		                    	case "400":
		                    		spamStr="<b>[违禁]</b>";
		                    		break;
		                    	case "500":
		                    		spamStr="<b>[涉政]</b>";
		                    		break;
		                    	case "600":
		                    		spamStr="<b>[谩骂]</b>";
		                    		break;
		                    	case "700":
		                    		spamStr="<b>[灌水]</b>";
		                    		break;
		                    	default:
		                    		break;
	                    	}

	                    	var item = $('#checklist a.z-select');
	                    	var index = item.attr("index");
	                    	renderList(index, spamStr);
	                    	item.removeClass('z-pass').addClass('z-del').attr("status",statusmap.DELETE);
	                    	//item.attr("spamType", clusterType);
	                    	var operateType = $('input:radio[name=operateType]:checked').val();
	                    	//item.attr("operateType", operateType);
	                    	delItemInArray(DEL_INDEX, index);
	                    	delItemInArray(PASS_INDEX, index);
	                    	DEL_INDEX.push(index);
	        				LIST[index].newSpamType = clusterType;
	        				LIST[index].newStatus = "3000";
	        				LIST[index].operateType = operateType;
	                    	addClassToSelectItem();
	                        $(this).dialog("close");
	                        moveDown();
	                    }
                	},
                	{
                        text: "取消",
                        click: function() {
                            $(this).dialog("close");
                        }
                    }
				],
	        	open: function(event, ui) {
	        		//openConfirmWin("conformDlg");
				}
			});
        }

		var openConfirmWin = function(divId){
    		var item = $('#checklist a.z-select');
    		var index = item.attr("index");
    		var checkLabels = "" ;//LIST[index].checkLabels;//页面不再需要检查checkLabels http://jira.netease.com/browse/YDNR-2061
        	var thiz =$(this);
    		if(checkLabels!=""){
    			var checkLabelArray = checkLabels.split(",");
    			$.each(allLabels, function(i,val){
    				if($.inArray(val, checkLabelArray) == -1){
    					$("#"+divId+" .u-radio input[value='"+ val +"']").prop("checked",false);
    					$("#"+divId+" .u-radio input[value='"+ val +"']").prop("disabled",true);
    					$("#"+divId+" .u-radio span[value='"+ val +"']").addClass("j-labed-disable");
    				}else{
    					$("#"+divId+" .u-radio input[value='"+ val +"']").prop("disabled",false);
    					$("#"+divId+" .u-radio span[value='"+ val +"']").removeClass("j-labed-disable");
    				}
    			});

    			$.each(allLabels, function(i,val){
    				if($.inArray(val, checkLabelArray) != -1 && !$("#"+divId+" .u-radio input[value='"+ val +"']").hasClass('j-labed-disable')){
    					$("#"+divId+" .u-radio input[value='"+ val +"']").prop("checked",true);
    					return false;
    				}
    			});
    		}else{
    			$.each(allLabels, function(i,val){
    				$("#"+divId+" .u-radio input[value='"+ val +"']").prop("checked",false);
					$("#"+divId+" .u-radio input[value='"+ val +"']").prop("disabled",false);
					$("#"+divId+" .u-radio span[value='"+ val +"']").removeClass("j-labed-disable");
    			});
    		}
		}

		var query = function() {
			querycount();
			querydata(curPage);
		}

		var querycount = function() {
			var params = getparams(curPage);
			$.postForm(counturl, params, function(result) {
					$('#total').html(result['data']);
					totalPage =Math.ceil(result['data']/parseInt($("#pageSize").val()));
			})
		};

		var querydata = function(pageNum) {
			var params = getparams(pageNum);
			 $.msg("loading");
			 $.postForm(dataurl, params, function(result) {
				$.msg("hide");
					LIST = result['data'];
					$.ipAccountSort(LIST);
					if(LIST.length == 0)  {
						$.msg("info","无数据");
						$(".checkctn").html("");
						$("#checklist").html("");
						return;
					}
					PASS_INDEX=[];
					DEL_INDEX=[];
					$.each(LIST, function(index, value) {
						value.index = index;
						value.style = statusstylemap[value.status];
						value.insertTime = $.formatTime(value.insertTime,
								"yyyy-MM-dd HH:mm:ss");
						//昵称转义
						value.nickname = $.html2string(value.nickname);
						value.ip = $.html2string(value.ip);
						value.account = $.html2string(value.account);
						value.level = levelmap[value.level];
						value.productName = productMap[value.productId];
						value.displayTitle = value.title;
						if($("input[name='betterViewModel']").is(':checked')){
							value.content=$.mergeHtmBrLabel(value.content);
						}
					});
					$("#checklist").html($.templates("#listtmp").render({
						"list" : result['data']
					}));
					$('.scrollbar-macosx').scrollbar();
					initlist();
			})
		};


		var getparams = function(pageNum) {
			var form = $('form');
			var formParam = form.serialize();
			var pArr = formParam.split('&');
			var params = {};
			var i;
			for (i = 0; i < pArr.length; i++) {
				params[pArr[i].split('=')[0]] = pArr[i].split('=')[1];
			}

			return {
					"groupId": $("#curGroupId").val(),
					"productId": $("#productId").val(),
					"targetId" : $("#targetId").val(),
					"status"    : $("#status").val(),
					"clusterType" : $("#clusterType").val(),
					"startTime" : $.parseTime($("input[name='startTime']").val().trim()),
					"endTime"   : $.parseTime($("input[name='endTime']").val().trim()),
					"level"     : $("#level").val(),
					"keyword"   : $("#keyword").val().trim(),
					"pageSize"  : $("#pageSize").val(),
					"pageNo"   : pageNum > 0 ? pageNum : 1,
					"multiable" : (params.multiable === 'on') ? 1 : 0,
					"orderType" : $("#orderType").val(),
					"operator"  : $("#operator").val().trim(),
					"censorPassport": $("#censorPassport").val()
			};
		};

	$('#keyBoard').on('click', 'a', function() {
		var eleId = $(this).attr("id");
		switch (eleId) {
		case 'keyG':
			submit();
			break;
		case 'keyLT':
		case 'keyGT':
			turnPage($(this).attr("name"));
			break;
		default:
			break;
		}
	});

	var turnPage = function(turn) {
		if (turn == "PREV") {
			if(curPage == 1) {
				$.msg("info","已经是第一页!");
				return;
			}
			curPage = curPage > 1 ? curPage - 1 : 1;
		} else {
			if(curPage == totalPage) {
				$.msg("info","已经是最后一页!");
				return;
			}
			curPage++;
		}
		querydata(curPage);
	}

	var initlist = function() {
		$("#checklist a").focus(function() {
			if ($(this).hasClass("z-select")) {
				return;
			}
			$("#checklist a.z-select").removeClass("z-select");
			$(this).addClass("z-select");
			var index = $(this).attr("index");
			var item = LIST[index];
			var content = item.content;
			var title = item.title;
			item.content = highlight(item.matchedDetail, item.content, index);
			item.title = highlight(item.matchedDetail, item.title, index);
			$(".checkctn").html($.templates("#detailtmp").render(item));
			item.content = content;
			item.title = title;
			//queryrecord(item);
			// generate scrollbar
			$('.scrollbar-inner').scrollbar();
			$("#showClusterDetail").click(showClusterDetail);
			$("#showClusterDetail").click(showClusterDetail);
			$("#content .cluster-hilight").click(showAddClusterSpamDialog);
		}).click(function(e) {
			e.preventDefault();
			$(this).focus();
		});
		$("#checklist a:first").focus();
	};

	var showAddClusterSpamDialog = function(e) {
		e.preventDefault();
		var data = {"addMark": $(this).attr("addMark"), "type":$(this).attr("type"), "index":$(this).attr("index")};
		$("#addClusterSpamDialog").dialog('option', data);
		$("#addClusterSpamDialog").dialog('open');
	};

	$("#addClusterSpamDialog").dialog({
		dialogClass: 'm-modal', // 必选配置
		width: 350,
		autoOpen: false,
		height: 350,
		modal: true,
		buttons: [
			{
				text: "提交",
				"class": "ui-button-c1",
				click: function() {
					var index = $(this).dialog("option", "index");
					var data = LIST[index];
					var params = {
						"status":0,
						"content":$("#eContent").val().trim(),
						"productId":data.productId,
						"targetId":data.targetId,
						"listType":$("#eListType").val(),
						"spamType": 200,//http://jira.netease.com/browse/YDNR-2954默认为广告
						"description":"聚类入口添加," + $("#eDescription").val()
					};
					$.postForm(addUrl, params, function(result) {
						if (result['data']) {
							$.msg("success", "添加成功");
						} else {
							$.msg("error", "添加失败");
						}
					});
					$(this).dialog("close");
				}
			},
			{
				text: "取消",
				click: function() {
					$(this).dialog("close");
				}
			}
		],
		open: function(event, ui) {
			var addMark = $(this).dialog("option", "addMark");
			var type = $(this).dialog("option", "type");
			$("#eContent").val(addMark);
			var listMap = {};
			if (type == 1) {
				listMap = {"5":"联系方式黑名单","6":"联系方式白名单"};
			} else if (type == 2) {
				listMap = {"7":"url黑名单","8":"url白名单"};
			}
			$("#eListType").removeOption(/./).addOption(listMap, false);
		}
	});

	var highlight=function(matchedDetail, text, itemIndex){
		var matchedArray = $.parseJSON(matchedDetail);
		if (matchedArray != null) {
			for (var i = 0; i < matchedArray.length; i++) {
				var matchedItem = matchedArray[i];
				var index = text.indexOf(matchedItem.lightMark);
				if (index >= 0) {
					var beginStr = text.substring(0, index);
					var endStr = text.substring(index + matchedItem.lightMark.length);
					text = beginStr + "<span id='"+matchedItem.lightMark+"' addMark='"+matchedItem.addMark+"' type='"+matchedItem.type+"' class='cluster-hilight' index='"+itemIndex+"'>" + matchedItem.lightMark + "</span>" + endStr;
				}
			}
		}
		return text;
	};

	var showClusterDetail  = function() {
		var clusterId = $(this).attr("clusterId");
		var params = {}
		params.clusterId= clusterId;
		$.postForm(showdetail,params,function(result) {
			var LIST = result['data'];
			var MAXLENGTH = 80;
			$.each(LIST, function(index, value) {
				value.index = index;
				// 内容长度裁剪
				value.shortContent = value.content.length > MAXLENGTH ? value.content.slice(0, MAXLENGTH) : '';
				if($("input[name='betterViewModel']").is(':checked')){
					value.shortContent=$.mergeHtmBrLabel(value.shortContent);
				}
				value.userStatusStr=listTypeMap[value.userStatus];
				if(value.userStatus!=0){
					value.showUserRedWarn=true;
				}else{
					value.showUserRedWarn=false;
				}
				value.ipStatusStr=listTypeMap[value.ipStatus];
				if(value.ipStatus!=0){
					value.showIpRedWarn=true;
				}else{
					value.showIpRedWarn=false;
				}
			});

			$("#clusterDetailDlg").html($.templates("#detaillisttmp").render({
				"list" : LIST
			}));
			bindToggleDetail();
			$("#clusterDetailDlg").dialog("open");
			bindAddListEvent();
		})
	}

		var bindAddListEvent=function(){
		//addListDialog
		$(".j-attachdg").click(function(){
			$this=$(this);
			var productId=$this.attr("data-product-id");
			var targetId=$this.attr("data-target-id");
			var entity=$this.attr("data-value");
			var type=$this.attr("data-type");
			var content=$this.attr("data-content");
			//var checkType=
			var item={
					productId:productId,
					targetId:targetId,
					entity:entity,
					type:type,
					content:content
			}
			addListDialog.open($this,item);
		});
	}

	/**
	 * 渲染化列表
	 */
	var renderList = function(index, extra){
		if(index > -1){
			LIST[index].displayTitle = extra + LIST[index].title;
		}else{
			$.each(LIST,function(index){
				LIST[index].displayTitle = extra + LIST[index].title;
			});
		}
		$("#checklist").html($.templates("#listtmp").render({
			"list" : LIST
		}));
		$('.scrollbar-macosx').scrollbar();
		initlist();
		if(index > -1){
			$("#checklist a[index="+index+"]").focus();
		}
	}

	/**
	 * 删除数组中的指定元素
	 */
	var delItemInArray = function(array, val){
		for(var i=0;i<array.length;i++){
			if(array[i]==val){
				array.splice(i, 1);
				break;
			}
		}
	}

	/**
	 * 对之前已经选中的数据重新添加回去
	 */
	var addClassToSelectItem = function(){
		$('#checklist a').each(function(index,value){
			var indexStr = ''+index;
			if($.inArray(indexStr,PASS_INDEX)!=-1){
				$(this).removeClass('z-del').addClass('z-pass').attr("status",statusmap.PASS);
			}else if($.inArray(indexStr,DEL_INDEX)!=-1){
				$(this).removeClass('z-pass').addClass('z-del').attr("status",statusmap.DELETE);
			}
		});
	}


	var dealItem = function(action) {
		if (!action)
			return;
		var item = $('#checklist a.z-select');
		var index = item.attr("index");
		var obj = LIST[index];
		switch (action) {
		case 'DEL':
			$("#conformDlg").dialog("open");
			break;
		case 'HDEL':
			renderList(index,"<b>[色情]</b>");
			item = $('#checklist a.z-select');
			index = item.attr("index");
			obj = LIST[index];
			obj.newSpamType = "100";
			obj.newStatus = "3000";
        	delItemInArray(DEL_INDEX, index);
        	delItemInArray(PASS_INDEX, index);
        	DEL_INDEX.push(index);
        	addClassToSelectItem();
			moveDown();
			break;
		case 'IDEL':
			renderList(index,"<b>[广告]</b>");
			item = $('#checklist a.z-select');
			index = item.attr("index");
			obj = LIST[index];
			obj.newSpamType = "200";
			obj.newStatus = "3000";
        	delItemInArray(DEL_INDEX, index);
        	delItemInArray(PASS_INDEX, index);
        	DEL_INDEX.push(index);
        	addClassToSelectItem();
			moveDown();
			break;
		case 'JDEL':
			renderList(index,"<b>[违禁]</b>");
			item = $('#checklist a.z-select');
			index = item.attr("index");
			obj = LIST[index];
			obj.newSpamType = "400";
			obj.newStatus = "3000";
        	delItemInArray(DEL_INDEX, index);
        	delItemInArray(PASS_INDEX, index);
        	DEL_INDEX.push(index);
        	addClassToSelectItem();
			moveDown();
			break;
		case 'KDEL':
			renderList(index,"<b>[暴恐]</b>");
			item = $('#checklist a.z-select');
			index = item.attr("index");
			obj = LIST[index];
			obj.newSpamType = "300";
			obj.newStatus = "3000";
        	delItemInArray(DEL_INDEX, index);
        	delItemInArray(PASS_INDEX, index);
        	DEL_INDEX.push(index);
        	addClassToSelectItem();
			moveDown();
			break;
		case 'MDEL':
			renderList(index,"<b>[涉政]</b>");
			item = $('#checklist a.z-select');
			index = item.attr("index");
			obj = LIST[index];
			obj.newSpamType = "500";
			obj.newStatus = "3000";
        	delItemInArray(DEL_INDEX, index);
        	delItemInArray(PASS_INDEX, index);
        	DEL_INDEX.push(index);
        	addClassToSelectItem();
			moveDown();
			break;
		case 'NDEL':
			renderList(index,"<b>[谩骂]</b>");
			item = $('#checklist a.z-select');
			index = item.attr("index");
			obj = LIST[index];
			obj.newSpamType = "600";
			obj.newStatus = "3000";
        	delItemInArray(DEL_INDEX, index);
        	delItemInArray(PASS_INDEX, index);
        	DEL_INDEX.push(index);
        	addClassToSelectItem();
			moveDown();
			break;
		case 'XDEL':
			renderList(index,"<b>[灌水]</b>");
			item = $('#checklist a.z-select');
			index = item.attr("index");
			obj = LIST[index];
			obj.newSpamType = "700";
			obj.newStatus = "3000";
        	delItemInArray(DEL_INDEX, index);
        	delItemInArray(PASS_INDEX, index);
        	DEL_INDEX.push(index);
        	addClassToSelectItem();
			moveDown();
			break;
		case 'PASS':
			renderList(index,"");
			item = $('#checklist a.z-select');
			index = item.attr("index");
			obj = LIST[index];
			obj.newSpamType = "0";
			obj.newStatus = "2000";
			item.removeClass('z-del').addClass('z-pass').attr("status",statusmap.PASS);
        	delItemInArray(PASS_INDEX, index);
        	delItemInArray(DEL_INDEX, index);
        	PASS_INDEX.push(index);
        	addClassToSelectItem();
			moveDown();
			break;
		case 'PASSALL':
			renderList(-1,"");
			$('#checklist a').removeClass('z-del').addClass('z-pass').attr("status", statusmap.PASS);
			$('#checklist a').attr("spamtype", "0");
			DEL_INDEX=[];
			PASS_INDEX=[];
			for(var i=0;i<LIST.length;i++){
				PASS_INDEX.push(i);
				LIST[i].newStatus="2000";
				LIST[i].newSpamType="0";
			}
			$("#checklist a[index="+(LIST.length-1)+"]").focus();
			moveDown();
			break;
		case 'SUBMIT':
			submit();
			break;
		case 'UP':
			moveUp();
			break;
		case 'DOWN':
			moveDown();
			break;
		default:
			break;
		}
	}

	$('#checkMainCtn').keydown(function(e) {
        var list = $('#checklist').children('li');
        if (!list.length) {
            return;
        }
        dealItem(keymap[e.keyCode]);
    });

    // toggle detail
    var bindToggleDetail = function() {
    	var _temp;
    	$('.viewMore').on("click", function(e) {
    		var title, _tag, _prevNode;
    	    title = $(this).data('title');
    	    _tag = $(this).data('_tag');
    	    _prevNode = $(this).prev('.detail_cnt').first();
    	   	if (!_tag) {
    	   		_temp = _prevNode.html();
    	   	}
    	    if (_tag) { //已经展开
    	    	_prevNode.html(_temp);
    	    	$(this).data('_tag', false);
    	    	$(this).html('[展开]');
    	    } else { //还未展开
    	    	_prevNode.html(title);
    	    	$(this).data('_tag', true);
    	    	$(this).html('[收起]');
    	    }
    	    e.preventDefault();
    	});
    }

	var moveDown = function() {
		if($('#checklist a.z-select').attr("index") == LIST.length-1) {
			confirm2("已达到末尾,提交?",function(result){
				if(result) {
					submit();
				}
			});
			$("#okBtn").focus();
		}
		$('#checklist a.z-select').removeClass('z-select').parent().next()
				.children("a").focus();
	}

	var moveUp = function() {
		$('#checklist a.z-select').removeClass('z-select').parent().prev()
				.children("a").focus();
	}

	var submit = function() {
		var unpassIds = [], passIds = [], spamTypes = [], passItems =[], unpassItems=[];
		$('#checklist a').each(function() {
			var index = parseInt($(this).attr("index"));
			var item = LIST[index];
			var status = item.newStatus;
			var spamType = item.newSpamType;
			item.newSpamType = "0";
			if(spamType!=undefined){
				item.newSpamType = spamType;
			}
			var operateType = item.operateType;
			var submitItem = {
					"id":item.id,
					"oldStatus":item.status,
					"newStatus":status,
					"uuid":item.uuid,
					"productId":item.productId,
					"targetId":item.targetId,
					"spamType":spamType,
					"operateType":operateType
			};
			if (status!=undefined && item.status != status) {
				switch (status) {
				case statusmap.PASS:
					passIds.push(item.id);
					passItems.push(submitItem);
					break;
				case statusmap.DELETE:
					spamTypes.push(spamType);
					unpassIds.push(item.id);
					unpassItems.push(submitItem);
					break;
				default:
					break;
				}
			}
		});

		var params = {};
		params.groupId = $("#curGroupId").val();
		params.type = 100;
		params.values = passItems;
		params.extraValues = unpassItems;
		$.postJSON(submiturl, params, function(response) {
			if(response.data){
				$.msg("info","提交成功! 通过" + passIds.length + " 删除" + unpassIds.length );
				addQualityInspection(getQualityInspectionParams());
			}else{
				$.msg("error","提交失败!");
			}
			query();
		});
	}




	/**
	 * 记录质检数据的参数
	 */
	var getQualityInspectionParams = function(){
		var params = new Array();
		$("#checklist a").each(function(){
			var index     = parseInt($(this).attr("index"));
			var item      = LIST[index];
			var newStatus = parseInt(item.newStatus);
			var qiType=qualityInspectionStatus.UNKNOWN;

			var oldOpType = item.textDataOperatorType;
			var oldOperator=item.textDataOperator;
			if(oldOpType != operatorTypeMap.PRODUCT_ADMIN){
				//源操作类型：人工
				if(oldOpType==operatorTypeMap.HUMAN){
					if((item.textDataStatus==textstatusmap.PASS && newStatus==textstatusmap.DELETE)||(item.textDataStatus==textstatusmap.DELETE && newStatus==textstatusmap.PASS)){
						qiType=qualityInspectionStatus.HUMAN_WUPAN;
					}
				}else if(oldOpType==operatorTypeMap.MACHINE){//源操作类型：机器
					if(oldOperator=='na_cluster@163.com' && ((item.textDataStatus==textstatusmap.PASS && newStatus==textstatusmap.DELETE)||(item.textDataStatus==textstatusmap.DELETE && newStatus==textstatusmap.PASS)) ){//JIRA http://jira.netease.com/browse/YDNR-1469?filter=-1
						qiType=qualityInspectionStatus.HUMAN_WUPAN;
					}else if(oldOperator!='na_cluster@163.com' && ((item.textDataStatus==textstatusmap.PASS && newStatus==textstatusmap.DELETE)||(item.textDataStatus==textstatusmap.DELETE && newStatus==textstatusmap.PASS))){
						qiType=qualityInspectionStatus.MACHINE_WUPAN;
					}else if((item.textDataStatus==textstatusmap.NO_RULE_HIT && newStatus==textstatusmap.DELETE) || (item.textDataStatus==textstatusmap.UN_CENSORED && newStatus == textstatusmap.DELETE)){
						qiType=qualityInspectionStatus.MACHINE_LOUPAN;
					}else if( item.textDataStatus==textstatusmap.PRECENSOR && newStatus == textstatusmap.DELETE){
						qiType=qualityInspectionStatus.TO_BE_OPTIMIZED;
					}
				}else if(oldOpType==operatorTypeMap.UNKNOW){
					 if(item.textDataStatus==textstatusmap.NO_RULE_HIT && newStatus==textstatusmap.DELETE){
						 qiType=qualityInspectionStatus.MACHINE_LOUPAN;
					 }
				}

				//只选择指定类型的数据进行提交
				if(qiType!=qualityInspectionStatus.UNKNOWN){
					if(newStatus == statusmap.DELETE && item.checkLabels.indexOf(item.newSpamType)==-1){
						return;
					}

					var newStatusStr = statusDescMap[newStatus];
					var statusStr = statusDescMap[item.textDataStatus];

					var oldStatusCode=item.textDataStatus;
					var newStatusCode=newStatus;
					var checkTime = item.checkTime == 0?item.insertTime:item.checkTime;
					var p={
						"productId":    item.productId,
						"targetId":	    item.targetId,
						"dataType":	    item.dataType,
						"qiType":	    qiType,
						"newStatus":    newStatusStr,
						"newStatusCode":newStatusCode,
						"oldStatus":	statusStr,
						"oldStatusCode":oldStatusCode,
						"oldOperator":  item.textDataOperator,
						"oldOpType":    item.textDataOperatorType,
						"newOpType":    2,
						"publishTime":  checkTime,
						"passport":		item.account,
						"content":		item.content.replace(/<.+?>/g,""), //去除一些标签
						"tableId":		item.textDataId,
						"dataId":       item.textDataDataId,
						"fetchStatus":	1, //未提取
						"hitContent":	item.hitContent, //命中标识
						"targetType":   1,           //文本
						"spamType":     item.newSpamType,
						"title":item.title,
						"nickname":item.nickname
					};
					params.push(p);
				}
			}

		});
		return params;
	};

	/**
	 * 提交质检数据
	 */
	var addQualityInspection = function(param){
		if(!$.isBlank(param)){
			$.postJSON(qualityInspectionUrl, param, function(data) {

			});
		}
	};


	var queryrecord = function(item) {
		var param = {
				"productId" :item.productId,
				"targetId"  :item.targetId,
				"tableId"   :item.id
		}
		$.getForm(queryrecordurl,param,function(result){
			if(result['code'] == 0) {
				$.each(result['data'],function(index,value){
					value.opTime = $.formatTime(value.opTime,"yyyy-MM-dd HH:mm:ss");
					value.opColor = opcolormap[value.opType];
					value.opType = optypemap[value.opType];
				});
				$("#recordlist").html($.templates("#recordtmp").render({"list":result['data']}));
			}
		});
	}

	/**
	 * 添加白名单模块
	 */
	var addListDialog=(function(){
		var dialogId="#addListDialog";
		var $dialog=null;
		var $dialogContext=$(dialogId);

		var querySpamLabels= "/base/query-spam-labels.json";
		var addManagedUserUrl = "/manage/list/user/add.json";
		var addManagedIpUrl = "/manage/list/ip/add.json";
		var listTypeMap = {
		        "0" : "正常",
                "1" : "白名单",
                "2" : "黑名单",
                "4" : "必审名单",
                "8" : "预审名单"
        };
		var listTypeMapWhiteList={
				"1" : "白名单"
		}
		var listTypeMapALL={
				"1" : "白名单",
                "2" : "黑名单",
                "4" : "必审名单",
                "8" : "预审名单"
		}
		//根据用户配置获取可用列表
		var blackReasonMap = {
		        "100": "色情",
		        "200": "广告",
		        "300": "暴恐",
		        "400": "违禁",
		        "500": "涉政",
		        "600": "谩骂",
		        "700": "灌水"
		};
		var whiteReasonMap = {
		        "0" : "产品要求"
		};
		var manangeReasonMap = {
		        "1" : whiteReasonMap,
		        "2" : blackReasonMap,
		        "4" : blackReasonMap,
		        "8" : blackReasonMap
		};


		var renderRadio = function(map,list) {
		    var result = [];
            result.push('<div class="reasonCtn">');
		    for (name in map) {
		    	if(list==undefined||(list!=undefined&&$.inArray(name,list)>=0)){
		    		result.push('<span class="ritem"><label class="u-radio">');
		    		result.push('<input type="radio" name="reasonSel" value="' + name + '"><i></i>' + map[name]);
		    		result.push('</label></span>');
		    	}
            }
            result.push('</div>');
		    return result.join(" ");
		}

		$(dialogId+" input[name='listLevel'").click(function(){
			if($(this).val()=="productLevel"){
				$(dialogId+" #listType").removeOption(/./);
				$(dialogId+" #listType").addOption(listTypeMapWhiteList);
			}else{
				$(dialogId+" #listType").removeOption(/./);
				$(dialogId+" #listType").addOption(listTypeMapALL);
			}
		    $(dialogId+" #listType").change();
		})
		$(dialogId+" #listType").on("change", function() {
			$("#reasonRadioContainer").html("");
			var listType=$(this).val();
			if(listType=="1"){
        		//白名单
        		$("#reasonRadioContainer").html(renderRadio(manangeReasonMap[listType]));
        	}else{
        		var params={
        				productId:$dialogContext.attr("data-product-id"),
        				targetId:$dialogContext.attr("data-target-id")
        		}
        		//如果选择产品级别，业务id为0
        		if ($('input:radio[name=listLevel]:checked').val() == "productLevel") {
                    params.targetId = 0;
        		}
        		 $.postForm(querySpamLabels, params, function(result) {
        			 $("#reasonRadioContainer").html( renderRadio(  manangeReasonMap[listType],result['data']  )   );
        		 });
        	}

		    if ($("#listType").val() == 2) {
		        $("#releaseTime").selectOptions("3");
		    } else {
		        $("#releaseTime").selectOptions("-1");
		    }
            $("#releaseTimeExtCtn").hide();
            $("#validDays").removeClass('u-split');
            $("#releaseTimeExt").val('');
		    // $("#reasonSel").addOption(manangeReasonMap[$(this).val()], false).selectOptions("1", true);
		});
        var defaultOption =function(){
            $(dialogId + " input[name='listLevel']").get(1).checked=true;
            $(dialogId + " :radio:eq(1)").trigger("click");
        };
		///$("#listType").change();
		$("#releaseTime").on("change", function() {
		    if ($("#releaseTime").val() == "0") {
		        $("#releaseTimeExtCtn").show();
		        $("#validDays").addClass('u-split');
		    } else {
		        $("#releaseTimeExtCtn").hide();
                $("#releaseTimeExt").val('');
		        $("#validDays").removeClass('u-split');
		    }
		});
		$("#releaseTime").change();

		var addManagedEntity = function(dialog, entity, submitUrl) {
            var params = {};
            params.productId = $dialogContext.attr("data-product-id");;
            if ($('input:radio[name=listLevel]:checked').val() == "productLevel") {
                params.targetId = 0;
            } else if ($('input:radio[name=listLevel]:checked').val() == "targetLevel"){
                params.targetId = $dialogContext.attr("data-target-id");
            } else {
            	$.msg("warn","请选择名单类型!");
                return;
            }
            params.listType = $("#listType").val();
            params.entity = entity;
            var duration = $("#releaseTime").val();
            if (duration == 0) {
                duration = $("#releaseTimeExt").val();
                if ($.isBlank(duration)) {
                    $.msg("warn", "请输入天数!");
                    return;
                } else if (!$.isPositiveDigit(duration)) {
                    $.msg("warn", "请输入正整数!");
                    return;
                } else if (duration > 365) {
                    $.msg("warn", "输入天数过大，请选择永久有效")
                    return;
                }
            }
            params.duration = duration * 24 * 3600 * 1000;
            var reasonSelStr = manangeReasonMap[params.listType][$("input:radio[name=reasonSel]:checked").val()];
            if ($.isBlank(reasonSelStr)) {
                $.msg("warn", "请选择加黑理由!");
                return;
            }
            params.spamType=$("input:radio[name=reasonSel]:checked").val();
            params.description = reasonSelStr + " " + $("#reasonIpt").val()  + " " + $("#contentSimple").val();
            $.postForm(submitUrl, params, function(result) {
                if (result['data']) {
                    $(dialog).dialog("close");
                    $.msg("info","添加成功!")
                } else {
                	$.msg("error","添加失败!");
                }
            });
        }

		var _init=function(){

			$dialog=$(dialogId).dialog({
				dialogClass : 'm-modal', // 此配置项为必需项
				autoOpen : false,
				width : 450,
				height : 480,
				modal : true,
				buttons: [
	                {
	                    text: "提交",
	                    "class": "ui-button-c1",
	                    click: function() {
	                        var entity = $(this).attr("data-entity");
	                        var submitUrl = null;
	                        var type=$(this).attr("data-type");
	                        if(type=="user"){
	                        	submitUrl=addManagedUserUrl;
	                        }else if(type=="ip"){
	                        	submitUrl=addManagedIpUrl;
	                        }else{
	                        	 $.msg("warn","系统异常");
		                         return;
	                        }
	                        if ($.isBlank(entity)) {
	                            $.msg("warn","加黑对象为空，不能加黑!");
	                            return;
	                        }
	                        addManagedEntity(this, entity, submitUrl);
	                    }
	                },
	                {
	                    text: "取消",
	                    click: function() {
	                        $(this).dialog("close");
	                    }
	                }
	            ],
	        	open: function(event, ui) {
	        		var content=$.zipWithWidth($dialogContext.attr("data-content"), 50000);
	            	$("#contentSimple").val(content);
	            	$("#contentSimple").attr("disabled", "disabled");
                    defaultOption();
				}
			});
			return $dialog;
		}

	    return {
	    	init:_init,
	    	open:function($context,item){
	    		if($dialog==null){
	    			$dialog=_init();
	    		}
	    		$dialogContext.attr("data-product-id",item.productId);
	    		$dialogContext.attr("data-target-id",item.targetId);
	    		$dialogContext.attr("data-content",item.content);
	    		$dialogContext.attr("data-entity",item.entity);
	    		$dialogContext.attr("data-type",item.type);
	    	    $dialog.dialog("open");
	    	}
	    }

	})();

    init();
    });
});
