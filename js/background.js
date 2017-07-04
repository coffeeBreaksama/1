var blockArry = new Array(5);
blockArry[0] = "http://gcweb.nis.netease.com/js/modules/censor/yuedu/yuedu-open-censor.js*";
blockArry[1] = "*://mmo.mi.nis.netease.com/js/modules/image/mark/image-mark-content.js*";
blockArry[2] = "http://gcweb.nis.netease.com/js/modules/censor/music/music-censor*";
blockArry[3] = "http://gcweb.nis.netease.com/js/modules/censor/music/music-image*";
blockArry[4] = "http://mmo.mi.nis.netease.com/js";

sendNotif("插件开始工作");
var timeSend = 1;
var intervalID;
var interTime = 500;
var NotifSwitch = parseInt(localStorage.getItem("globalVariables"+"-NotifSwitch"));//默认打开
if(NotifSwitch != 1 || NotifSwitch != 0)
{
	NotifSwitch = 0;
}
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    var cmd = analysisInstruction(message);
	sendResponse(executeCmd(cmd));
	updataStorage(cmd);
});
chrome.webRequest.onBeforeRequest.addListener(
	  function(details) {
		console.log(details);
		if(details.url == "http://gcweb.nis.netease.com/js/modules/censor/yuedu/yuedu-open-censor.js?v=201202141407")
		{
			return {redirectUrl: chrome.extension.getURL("js/yuedu.js")};
		}
		else if(details.url == "http://mmo.mi.nis.netease.com/js/modules/image/mark/image-mark-content.js?v=20151029")
		{
			return {redirectUrl: chrome.extension.getURL("js/oldJS/image-mark-content.js")};
		}
		else if(details.url == "http://gcweb.nis.netease.com/js/modules/censor/music/music-censor.js?v=201202141407")
		{
			return {redirectUrl: chrome.extension.getURL("js/musicCensor.js")};
		}
		else if(details.url == "http://gcweb.nis.netease.com/js/modules/censor/music/music-image-censor.js?v=201202141407")
		{
			return {redirectUrl: chrome.extension.getURL("js/musicImage.js")};
		}
		else if(details.url == "http://mmo.mi.nis.netease.com/js/modules/image/mark/image-mark-content.js?v=20151029")
		{
			return {redirectUrl: chrome.extension.getURL("js/mark.js")};
		}
	  },
	  {
		urls: blockArry,
		types: ["script"]
	  },
	  ["blocking"]
	);	

////////////////////////////////////////////////////
/*  	var xhr = new XMLHttpRequest();
xhr.open("GET", "https://github.com/coffeeBreaksama/censor-chrome-version/blob/master/README.md", true);

xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // innerText不会给攻击者注入HTML元素的机会.
    console.log(xhr.responseText);
  }

}
xhr.send();  */
/////////////////////////////////////////////////	
	
function sendNotif(type)
{
	var n;
	if(type == 1)
	{
		n = new Notification("起床了！", {body: "漫画原创了",icon: "images/漫画原创.png"}); // 显示通知
		n.addEventListener("click",function(e){
		chrome.tabs.query({active:true},function(){
			
			n.close();
		});
		});
	}
	else
	{
		n = new Notification("起床了！", {body: type,icon: "images/漫画原创.png"}); // 显示通知
		n.addEventListener("click",function(e){
		chrome.tabs.query({active:true},function(){
			n.close();
		});
		});
	}
	
}

/* var paremArr = new Array();
initParemStorage();
localStorage.setItem("pageParam",paremArr) 


if(!localStorage.getItem("pageParam")){
	initParemStorage();
}
else{
	paremArr = getParemFormStorge();
}
console.log(paremArr);
 */


function switchNoti()
{
	if(NotifSwitch == 0)
	{
			intervalID = window.setInterval(function(){
			alert("清原创漫画");
			timeSend += 1;
			sendNotif(1);
			if(timeSend == 4)
			{
				alert("其他模块也要清了");
				timeSend = 0;
			}
			},30*1000*60);
			NotifSwitch = 1;
			sendNotif("开始计算时间，注意清当前一轮漫画原创");
	}else if(NotifSwitch == 1)
	{
		intervalID = window.clearInterval(intervalID);
		sendNotif("停止计算时间");
		NotifSwitch = 0;
	}
	
	if(NotifSwitch==1)
    {return('关闭小模块计时器');}
	else if(NotifSwitch==0)
	{return('开启小模块计时器');}
}
function instruction(type,source,num)
{
	this.type = type;
	this.source = source;
	this.num = num;
	
}
/* function pageParam(url,type,interTime,notiTime,notiSwitch)
{
	var ob = new Object();
	ob.url = url;
	ob.type = type;
	ob.interTime = interTime;
	ob.notiTime = notiTime;
	ob.notiSwitch = notiSwitch;
	return ob;
} */


/* 
function initParemStorage(){
	for(var i=0;i<30;i++)
	{
		paremArr[i] = pageParam(1,1,1,1,1);
	}
} */
  
/* 
function getParemFormStorge(){
	var param = pageParam();
	
	
} */


function updataStorage(cmd)
{
	if(cmd.type == "setInterTime"){
		localStorage.setItem(cmd.source+"-interTime",cmd.num);

	}
	if(cmd.type == "CloseNotif"){
		localStorage.setItem("globalVariables"+"-NotifSwitch",NotifSwitch);
	}
}


function analysisInstruction(message)
{
	var instArry = message.split(";");
	
	var instType = instArry[0];
	var instSourse = instArry[1];
	var instNum = parseInt(instArry[2]);
	console.log("指令类型：" + instType +"来源：" + instSourse + "数字：" + instNum);
	return new instruction(instType,instSourse,instNum);
}
function executeCmd(cmd)
{
	var responseText;
	if(cmd.type == 'CloseNotif'){
		responseText = switchNoti();
    }
	else if(cmd.type == "getNotifStatus")
	{ 
		if(NotifSwitch==1)
        {responseText = '关闭小模块计时器';}
		else if(NotifSwitch==0)
		{responseText = '开启小模块计时器';}
    }
	else if(cmd.type == "getInterTime")
	{
		interTime = parseInt(localStorage.getItem(cmd.source+"-interTime"));
		responseText = interTime;
		console.log("getInterTime:"+interTime);
	}
	else if(cmd.type == "setInterTime")
	{
		interTime = cmd.num;
		responseText = cmd.num;
		console.log("setInterTime:"+interTime);
	}
	else if(cmd.type == "getUpdataText")
	{
		
	}
	return responseText;
}


