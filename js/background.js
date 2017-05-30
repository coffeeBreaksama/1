var blockArry = new Array();
blockArry[0] = "http://gcweb.nis.netease.com/js/modules/censor/yuedu/yuedu-open-censor.js*";
blockArry[1] = "*://mmo.mi.nis.netease.com/js/modules/image/mark/image-mark-content.js*";
blockArry[2] = "http://gcweb.nis.netease.com/js/modules/censor/music/music-censor*";
blockArry[3] = "http://gcweb.nis.netease.com/js/modules/censor/music/music-image*";


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
	  },
	  {
		urls: blockArry,
		types: ["script"]
	  },
	  ["blocking"]
	);	
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
sendNotif("fuck");
var timeSend = 1;
var intervalID;
var interTime = 500;
var NotifSwitch = 0;//默认打开



var paremArr = new Array();
if(!localStorage.getItem("pageParam")){
	initParemStorage();
}
else{
	getParemFormStorge();
}


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
}
function instruction(type,source,num)
{
	this.type = type;
	this.source = source;
	this.num = num;
	
}
function pageParam(url,type,interTime,notiTime)
{
	this.url = url;
	this.type = type;
	this.interTime = interTime;
	this.notiTime = notiTime;
}



function initParemStorage(){
	for(var i=0;i<30;i++)
	{
		paremArr[i] = pageParam();
	}
}


function getParemFormStorge(){
	paremArr = localStorage.setItem('pageParam');
	
}


function updataStorage()
{
	
	localStorage.setItem('pageParam',)
	
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



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    var cmd = analysisInstruction(message);
	if(cmd.type == 'CloseNotif'){
		switchNoti();
		if(NotifSwitch==1)
        {sendResponse('关闭小模块计时器');}
		else if(NotifSwitch==0)
		{sendResponse('开启小模块计时器');}
    }
	else if(cmd.type == "getNotifStatus")
	{ 
		if(NotifSwitch==1)
        {sendResponse('关闭小模块计时器');}
		else if(NotifSwitch==0)
		{sendResponse('开启小模块计时器');}
    }
	else if(cmd.type == "getInterTime")
	{
		sendResponse(interTime);
	}
	else if(cmd.type == "setInterTime")
	{
		interTime = cmd.num;
		sendResponse(cmd.num);
	}
    //console.log(analysisInstruction(message));
});