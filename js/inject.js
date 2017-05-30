var updateNum;
var nowIndex = null;
var firstUncensorIndex = null;
initAll();

/* var currentUrl = window.location.href;
if(window.location.href == "*://gcweb.nis.netease.com/*"){
$(".m-banner pos-rel").append("<a id=\"ManhuaTag\" href=\"/modules/censor/yuedu/yaolushan-censor.html\">网易漫画</a>" 
+ "<a id=\"KaiFangTag\" href=\"/modules/censor/yuedu/yuedu-open-censor.html\">阅读开放平台</a>"
+ "<a id=\"KaiFangTag\" href=\"/modules/censor/yuedu/yuedu-open-censor.html\">阅读开放平台</a>"

); */

//$(".m-nav li").width("40");
/* $(".m-nav li").mouseover(function(){
	$(this).width("88");
});
$(".m-nav li").mouseleave(function(){
	$(this).width("40");
}); 
}*/

function initAll()
{
	
	//获取通知权限
	Notification.requestPermission( function(status) {
    console.log(status); // 仅当值为 "granted" 时显示通知
    //var n = new Notification("title", {body: "插件开始工作"}); // 显示通知
  });
  
	liveAutoKeydown();
	liveDelImageKeyDown();
	
	$("#messageBoxId").text(window.location.href);
	$("#messageBoxId").click();
	$("#messageBoxId").hide();
	
	
	switch(window.location.href){
		case "http://gcweb.nis.netease.com/modules/censor/study/study-censor.html?dataType=14":initKeyMOOC(); break;
		case "http://gcweb.nis.netease.com/modules/censor/study/study-censor.html?dataType=14#":initKeyMOOC(); break;
		
		case "http://mmo.mi.nis.netease.com/modules/image/mark/image-mark-ad.html":imgMarkInit();break;
		case "http://mmo.mi.nis.netease.com/modules/image/mark/image-mark-ad.html#":imgMarkInit();break;
		
		case "http://gcweb.nis.netease.com/modules/censor/gacha/gacha-post-censor.html":initKeyGACHA();break;
		case "http://gcweb.nis.netease.com/modules/censor/gacha/gacha-post-censor.html#":initKeyGACHA();break;
		
		case "http://gcweb.nis.netease.com/modules/censor/yuedu/yuedu-open-censor.html":initKeyREAD();break;
		case "http://gcweb.nis.netease.com/modules/censor/yuedu/yuedu-open-censor.html#":initKeyREAD();break;
		
		case "http://gcweb.nis.netease.com/modules/censor/yuedu/yuedu-article-censor.html":initArticle();break;
		case "http://gcweb.nis.netease.com/modules/censor/yuedu/yuedu-article-censor.html#":initArticle();break;
		
		case "http://gcweb.nis.netease.com/modules/censor/yuedu/yuedu-message-censor.html": initReadMessage(); break;
		case "http://gcweb.nis.netease.com/modules/censor/yuedu/yuedu-message-censor.html#": initReadMessage(); break;
		
		case "http://gcweb.nis.netease.com/modules/censor/yuedu/yaolushan-censor.html":initMANHUA();break;
		case "http://gcweb.nis.netease.com/modules/censor/yuedu/yaolushan-censor.html#":initMANHUA();break;
		
		case "http://gcweb.nis.netease.com/modules/censor/yuedu/yaolushancmt-censor.html":initManhuaCMT();break;
		case "http://gcweb.nis.netease.com/modules/censor/yuedu/yaolushancmt-censor.html#":initManhuaCMT();break;	
		
		case "http://gcweb.nis.netease.com/modules/censor/music/music-censor.html":initMUSIC(); break;
		case "http://gcweb.nis.netease.com/modules/censor/music/music-censor.html#":initMUSIC(); break;
		
		case "http://mmo.mi.nis.netease.com/modules/image/mark/image-mark-content.html":driverInit();break;
		case "http://mmo.mi.nis.netease.com/modules/image/mark/image-mark-content.html#":driverInit();break;
		
		case "http://blog.nis.netease.com/search/shortTextSearch.html": blogInit(); break;
		default: break;
	}

	
}



function blogInit()
{

/* 
				alert("1");

				$("#dataType").val("114");
				$("#queryContent0").val("援交");
				$("postion0").val("Title");
				$(".allSelectCheckbox").trigger("click");
				$(".batchDeleteUserBtn button80").trigger("click");
				$("#tagItem_3_21").trigger("click");
				$("#opReasonTag_Submit").trigger("click"); */


}

function liveAutoKeydown()
{
	
	var passItem = function(currentItem){
		$(currentItem).removeClass("s-fc7 unpass uncensor").addClass("s-fc8 pass").attr("newStatus", "2000");
		moveNext(currentItem);
	}
	
	/** 删除当前选中的项 */
	var delItem = function(currentItem){
		$(currentItem).removeClass("s-fc8 pass uncensor").addClass("s-fc7 unpass").attr("newStatus", "3000");
		moveNext(currentItem);
	}
	var moveNext = function(currentItem){
		var index = parseInt($(currentItem).attr("index"));
		if(index+1 < $("#cs-list a").length){
			$(currentItem).removeClass("focus").parent().next().children("a").focus();
			nowIndex += 1;
		}else{
			if(confirm("已到达末尾，提交?")){
				$("#submit").click();
				nowIndex = 0;
				pauseFlag = 0;
			}
			else{
				intervalID = window.clearInterval(intervalID);
				autoStatus = 0;
			}
			
		}
	}
	
	var getIndexNum =function()
	{
		for(var i=0;i<$("#cs-list a").length;i++){
			item = $("#cs-list a").eq(i);
			if(item.hasClass("uncensor focus")||item.hasClass("s-fc8 pass focus")||item.hasClass("s-fc7 unpass focus")){	
				nowIndex = parseInt(item.attr("index"));
				break;
			}
		}
		for(var i=0;i<$("#cs-list a").length;i++){
			item = $("#cs-list a").eq(i);
			if(item.hasClass("uncensor")){	
				firstUncensorIndex = parseInt(item.attr("index"));
				break;
			}
		}
	}
	
	var list = $("#cs-list a");
	var item;
	var autoStatus = 0;
	var intervalID;
	var delMessage = 0;
	var pauseFlag = 0;
	var interTime = 500;

	
	$("#selecterId").on("change",function(){
		var x = $("#selecterId");
		interTime = parseInt(x.val());
	});
	$("#detail").bind("contextmenu",function(e){return false;});

	var screenTopNum = 0;
	
	$("body").off("keydown");
	$(".m-news").on("change",function(){getIndexNum();});
	if(list != null)
	{	
		//var a = $(".s-fc0.content");
		$("#detail").mousedown(function(e){
			
			if(autoStatus == 1){
				if(e.which == 1)
				{
					if(pauseFlag == 0){	
						//passItem($("#cs-list a").eq(nowIndex));
					}
					else if(pauseFlag == 1){
						getIndexNum();
						passItem($("#cs-list a").eq(nowIndex));
					}
				}
				if(e.which == 3)
				{
					if(pauseFlag == 0){	
						//passItem($("#cs-list a").eq(nowIndex));
						delMessage = 1;
					}
					else if(pauseFlag == 1){
						getIndexNum();
						delItem($("#cs-list a").eq(nowIndex));
						
					}
				}
				if(e.which == 2){
					if(pauseFlag == 0)
					{
						pauseFlag = 1;
					}else 
					{
						pauseFlag = 0;
					}
				}
			}
			else if(autoStatus == 0 && $("#querycount").text() != "0")
			{
				
				getIndexNum();
				if(e.which == 3)
				{
					delItem($("#cs-list a").eq(nowIndex));
					nowIndex += 1;
				}
				else if(e.which == 1)
				{
					passItem($("#cs-list a").eq(nowIndex));
					nowIndex += 1;
				}
				screenTopNum = 0;
				$("#detail").animate({scrollTop:0},100);
				//alert(nowIndex);
				
			}
		})
	
		$("body").on("keydown", function(e){
			if(e.which == 89)//V
			{
				if(autoStatus == 0){
				//passItem($(".uncensor focus")[0]);
					getIndexNum();
					$("#cs-list a").eq(firstUncensorIndex).click();//从第一个未审核的开始。
					nowIndex = firstUncensorIndex;
					intervalID = window.setInterval(function(){
						if(pauseFlag == 0){
							if($("#querycount").text() != "0"){
								if(delMessage == 1){
									delItem($("#cs-list a").eq(nowIndex));
									delMessage = 0;
								}
								else {
									passItem($("#cs-list a").eq(nowIndex));				
								}
							}
							else
							{
								intervalID = window.clearInterval(intervalID);
								autoStatus = 0;
							}
						}
					},interTime);
					autoStatus = 1;
				}
				else if(autoStatus == 1)
				{
					intervalID = window.clearInterval(intervalID);
					autoStatus = 0;
				}
			}
			if(e.which == 82)//R
			{
				$("#cs-list a").removeClass("uncensor").addClass("s-fc8 pass").attr("newStatus", "2000");
			}
			if(e.which == 83)//S
			{
				screenTopNum = 0;
				$("#detail").animate({scrollTop:0},100);
				$("body").keydown(function(e){$("#cs-list a.focus").focus();});
				//PASS,下一个
			}
			if(e.which == 83)//D
			{
				$("body").keydown(function(e){$("#cs-list a.focus").focus();});
				//DEL,下一个
			}
			if(e.which == 71)//D
			{
				$("#submit").click();
			}
			if(e.which == 81)//Q
			{
				screenTopNum += 300;
				if(screenTopNum > 1800){screenTopNum = 0;}
				$("#detail").animate({scrollTop:screenTopNum},100);
			}	
			if(e.which == 69)//E
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
			}
		});
	}
}
function liveDelImageKeyDown()
{
	var imgDel = $(".img-delbtn")[0];
	if(imgDel != null)
	{
		$("body").on("keydown", function(e){
			if(e.which == 81)//Q
			{
				imgDel.click();
			}
		});
	}
}

function initManhuaCMT()
{

}

function initReadMessage()
{
	
	$("#multiCensor").attr("checked",false);
	$("#querybtn").click();
	//$("body").off("keydown");

}

function initArticle()
{
	$("#dataType").val("-1");
	$("#multiCensor").attr("checked",false);
	$("#querybtn").click();
	//$("body").off("keydown");
}
function initMUSIC()
{
	//$("body").off("keydown");
	$("body").on("keydown", function(e){
					var list = $("#dataType");
					var type = $("#suspectType");
					if(e.which == 49)
					{
						list.val("1");
						type.val("1");
						$("#pageSize").val("200");
						$("#ext").attr("checked",false);
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 50)
					{
						list.val("1");
						type.val("2");
						$("#pageSize").val("200");
						$("#ext").attr("checked",false);
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 51)
					{
						//window.location.reload();
						//delay(800);
						list.val("5");
						type.val("1");
						$("#pageSize").val("50");
						$("#ext").attr("checked",true);
						$("#thumbnail").val("1");
						//$("#keyword").val("http");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 52)
					{
						list.val("5");
						type.val("1");
						$("#thumbnail").val("1");
						$("#ext").attr("checked",false);
						$("#keyword").val("http");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 53)
					{
						list.val("5");
						type.val("1");
						$("#thumbnail").val("1");
						$("#ext").attr("checked",false);
						$("#keyword").val("");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 54)
					{
						list.val("5");
						type.val("2");
						$("#thumbnail").val("1");
						$("#ext").attr("checked",false);
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
				});
}

function imgMarkInit(){
	
}
function initMANHUA()
{
	//$("body").off("keydown");
	$("body").on("keydown", function(e){
					var list = $("#dataType");
					if(e.which == 49)
					{
						list.val("8");
						$("#status").val("1000");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 50)
					{
						list.val("7");
						$("#status").val("1000");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 51)
					{
						list.val("1");
						$("#status").val("1000");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 53)
					{
						list.val("2");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 52)
					{
						list.val("3");
						$("#status").val("1000");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
				});
}
function initKeyGACHA()
{	
	//$("body").off("keydown");
	$("body").on("keydown", function(e){
					var list = $("#dataType");
					if(e.which == 49)
					{
						list.val("1");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 50)
					{
						list.val("2");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 51)
					{
						list.val("3");
						$("#status").val("0");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 53)
					{
						list.val("5");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 52)
					{
						list.val("3");
						$("#status").val("1000");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
				});
}
function initKeyMOOC()
{	
	//$("body").off("keydown");
	$("body").on("keydown", function(e){
					var list = $("#dataType");
					if(e.which == 49)
					{
						list.val("5");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 50)
					{
						list.val("14");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 51)
					{
						list.val("-1");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
				});
}


function initKeyREAD()
{	
	//$("body").off("keydown");
	$("body").on("keydown", function(e){
					var sourceType = $("#sourceType");
					var checkStatus = $("#status");
					if(e.which == 49)
					{
						$("#multiCensor").attr("checked",false);
						sourceType.val("0");
						checkStatus.val("1000");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 50)
					{
						$("#multiCensor").attr("checked",false);
						sourceType.val("0");
						checkStatus.val("0");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 51)
					{
						$("#multiCensor").attr("checked",false);
						sourceType.val("3");
						checkStatus.val("1000");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 52)
					{
						$("#multiCensor").attr("checked",false);
						sourceType.val("3");
						checkStatus.val("0");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 53)
					{
						$("#multiCensor").attr("checked",false);
						sourceType.val("2");
						checkStatus.val("1000");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 54)
					{
						$("#multiCensor").attr("checked",false);
						sourceType.val("1");
						checkStatus.val("1000");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
				});
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function driverInit(){
	//重载.read（）方法。
	var x =document.getElementsByClassName('updateBtn');
	var GREENMODE = 1;//0：显示标签 1：不显示
	var keyboardMode = 0;//0:原模式 1：我定义的
    var showTipsA = "<p>使用透明模式时，若上一个标注框没成功标注，</p><p>将无法提交并且屏蔽鼠标操作。按ESC取消或继续标注即可。</p>"
                   + "<p>Q:女下体 W:女乳房 E:男下体 R:手 T:脚</p>" + "<p/>S:轻微色情 D:色情掩盖 </p>" + "<p>Z:性感 X:赤膊 C:卡通</p>"
                   + "<p>ESC:取消选框 1:提交 2:上一页 3:下一页 4:忽略</p>"
				   + "<p>鼠标右键：提交。(谁能告诉我页面注入JS后怎么绕过权限屏蔽chrome右键菜单)</p>"
				   + "<p>若出现BUG请popo联系我，至于改不改我看心情</p>";
				   
    var showTipsB = "<p>使用透明模式时，若上一个标注框没成功标注，</p><p>将无法提交并且屏蔽鼠标操作。按ESC取消或继续标注即可。</p>"
                   + "<p>Q:女下体 W:女乳房 E:男下体 R:手 S:脚<p>" + "<p/>D:轻微色情 F:色情掩盖</p> " + "<p>Z:性感 S:赤膊 C:卡通</p>"
                   + "<p>ESC:取消当前选框 1:提交 2:下一页 3:忽略 4:卡通</p>"
				   + "<p>鼠标右键：提交。(谁能告诉我页面注入JS后怎么绕过权限屏蔽chrome右键菜单)</p>"
				   + "<p>若出现BUG请popo联系我，至于改不改我看心情</p>";
	initCoffee();
	function initCoffee()
	{
		getUpNumFromCookie();
		//x[0].innerHTML = "当前标注" + updateNum;
		$(".col-6").last().after("<div style = \"float:center\" id = \"coffeeDiv\"><button id = \"changeGREENMODE\"> 护眼模式：开启 </button>&nbsp;<button id = \"changeKeyMode\"> 按键模式：咖啡版 </button>&nbsp;<button id = \"helpbtn\"> 帮助 </button>&nbsp;<p id = \"upNumP\" style = \"float:center\"> 今天标注:</p></div>");
		$("#changeGREENMODE").click(function(){
			if(GREENMODE == 0){
				GREENMODE = 1; 
				$("#changeGREENMODE").text ("护眼模式：打开");
				changeTips();
			}
			else{
				GREENMODE = 0;
				$("#changeGREENMODE").text ("护眼模式：关闭");
				changeTips();
			}
		});
		$("#changeKeyMode").click(function(){
				changeKeyModeF();
		});	
		$("#helpbtn").click(function(){
				changeTips();
		});
		//var key = document.getElementById('page-163-com');
		//key.setAttribute("onkeydown","return noNumbers(event)");
		
		$(".updateBtn").click(function(){
			setUpdataNum();
			//alert("success");
		});
		$("#upNumP").text("今天标注" + updateNum);
		$("#upNumP").css({"color":"red","font-size":"200%"});
		//$(".picDiv").find("p").text = "233";
		
		$("#page-163-com").live("change",function()
		{
			changeTips();
			
		});
		changeKeyModeF();//初始化成我的按键模式。
		//$("#coffeeDiv").align("center");
		//changeTips();
		
		//取消事件绑定，重新绑定即可实现重写。

		/**
		 * 新增色情快捷键的支持, 直接绑定在body上
		 * Q 女下体
		 * W 女乳房
		 * E 男下体
		 * R 手
		 * A 脚
		 * S 轻微色情
		 * D 色情掩盖
		 * Z 性感
		 * X 赤膊
		 * F 卡通
		 */
		 
		 function changeKeyModeF(){
			 if(keyboardMode == 0)
			 {
				keyboardMode = 1;
				changeTips();
				$("body").off("keydown");
				$("#changeKeyMode").text ("按键模式：咖啡版");
				$("body").on("keydown", function(e){
					qwekeyB(e);
					numkeyB(e);
				});
			 }
			 else if(keyboardMode == 1)
			 {
				keyboardMode = 0;
				changeTips();
				$("body").off("keydown");
				$("#changeKeyMode").text ("按键模式：原版");
				$("body").on("keydown", function(e){
					qwekeyA(e);
					numkeyA(e);
				});
			 }

			function numkeyA(e) {
				if (e.which == "49") {
					if($("#j-dialog").css('display') == 'block')
					{
						
					}
					else
					{
						x[0].click();
						//setUpdataNum();
					}
				} else if (e.which == "50") {
					$(".prev").trigger("click");
				} else if (e.which == "51") {
					$(".next").trigger("click");
				} else if (e.which == "52") {
					$(".ignoreBtn").trigger("click");
				}
				else if(e.which == 27)//Esc
				{
					if($('#j-pt-cancel') != null){
						$('#j-pt-cancel').trigger("click");
					}
				}
			} 
			 
			function qwekeyA(e) {
				if($("#j-dialog").css('display') == 'none'){
					// console.log("dialog not visible");
					return;
				}
				var codes = {"81":"女下体", "87":"女乳房", "69":"男下体", "82":"手", "84":"脚", "83":"轻微色情", "68":"色情掩盖", "90":"性感", "88":"赤膊", "67":"卡通" };
				var txt = codes[e.which];
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
					if(txt == "卡通"){$("#updateBtn").trigger("click");}
				}
			}			 
			 
			 
			 
			function qwekeyB(e)
			{
				if($("#j-dialog").css('display') == 'none'){
					// console.log("dialog not visible");
					return;
					}
				var codes = {"81":"女下体", "87":"女乳房", "69":"男下体", "82":"手", "65":"脚", "83":"赤膊", "68":"轻微色情", "90":"性感", "70":"色情掩盖", "51":"卡通" };
				var txt = codes[e.which];
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
					if(txt == "卡通"){$("#updateBtn").trigger("click");}
				}
			}		
			function numkeyB(e){
				var keynum;
				var keychar;	
					
				keynum = window.event ? e.keyCode : e.which;
				keychar = String.fromCharCode(keynum);
			   // alert(keynum+':'+keychar);
				
				if(keynum == 49){	
					if($("#j-dialog").css('display') == 'block')
					{
						
					}
					else
					{
						x[0].click();
						//setUpdataNum();
					}
				}
				else if(keynum == 50){
					$(".next").trigger("click");
				}
/* 				else if(keynum == 51){
					//$(".organNormalBtn").trigger("click"); */
 				else if(keynum == 52){
					$(".organNormalBtn").trigger("click");

				} 
				else if(keynum == 27)//Esc
				{
					if($('#j-pt-cancel') != null){
						$('#j-pt-cancel').trigger("click");
					}
				}
			}
			 
		}
		//右键上传
		$('body').mousedown(function(e){
			if(e.which == 3)
			{
				var a = $("#j-dialog").css('display');
				if($("#j-dialog").css('display') == 'block')
				{
					
				}
				else
				{
					x[0].click();
					//setUpdataNum();
				}
			}
			if(GREENMODE == 1){
				$('#j-dialog').css("opacity","0.0");//透明设置
			}
			else {$('#j-dialog').css("opacity","1.0");}
		});

	}


		function getUpNumFromCookie()
		{
			var cookieArray = document.cookie.split(";");
			console.log(document.cookie);
			for(var i=0;i<cookieArray.length;i++)
			{
				var arr = cookieArray[i].split("=");
				if(arr[0] == "upNum"){
					Number(arr[1]) >= 0 ? updateNum = Number(arr[1]) : updateNum = 0;
					break;
				}
			}
			if(updateNum == null)//cookie不存在upNum；
			{
				updateNum = 0;
			}
		}


		function setUpdataNum()
		{
			updateNum = updateNum + 1;
			setCookie(updateNum);
			//console.log("set cookie success!" + updateNum);
			$("#upNumP").text("当前标注" + updateNum);
		}
		
		function changeTips()
		{
			var tip = $("font").first();
			if(keyboardMode == 0)
			{
				tip.text("");
				tip.append(showTipsA);
			}
			else 
			{
				tip.text("");
				tip.append(showTipsB);
			}
			//tip.text("1111");
		}
}
//1234键盘绑定函数

function noNumbers(e)
{
	
}

function setCookie(value)
{
	//expiredays = arguments[1]? expiredays : 1;
	var data=new Date();
	data.setHours(23);
	console.log(data.toGMTString());
	document.cookie="upNum"+ "=" +escape(value)+ ";expires="+data.toGMTString();
	//console.log(document.cookie);
}

function changeCookie(value)
{
	updateNum = value;
	setCookie(value);
}
