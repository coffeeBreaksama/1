var blockArry = new Array();
blockArry[0] = "http://gcweb.nis.netease.com/js/modules/censor/yuedu/yuedu-open-censor.js*";
blockArry[1] = "*://mmo.mi.nis.netease.com/js/modules/image/mark/image-mark-content.js*";
//blockArry[0] = "*://web.antispam.netease.com/javascript/page/censor/cluster.js*";
var timeSend = 1;
var intervalID;
var interTime = 500;
var NotifSwitch;
var ReflashSwitch;
var soundPermisson;
var reflashArr = new Array();//切换刷新url匹配名单
reflashArr[0] = "web.antispam.netease.com";
reflashArr[1] = "gcweb.nis.netease.com";


initBackgrand();



function initBackgrand()
{
	//从localStorge获取全局设置参数，若没有则初始化值
	NotifSwitch = parseInt(localStorage.getItem("globalVariables"+"-NotifSwitch"));//默认打开
	if(NotifSwitch != 1 && NotifSwitch != 0)
	{
		NotifSwitch = 0;//默认关
	}
	if(NotifSwitch == 1)
	{
		switchNoti("start");
	}
	ReflashSwitch = parseInt(localStorage.getItem("globalVariables"+"-ReflashSwitch"));//默认打开
	if(ReflashSwitch != 1 && ReflashSwitch != 0)
	{
		ReflashSwitch = 0;
	}
	if(ReflashSwitch == 1)
	{
		startAutoRefreshPage();
	}
	soundPermisson = parseInt(localStorage.getItem("globalVariables"+"-SoundPermission"));//默认打开
	if(soundPermisson != 1 && soundPermisson != 0)
	{
		soundPermisson = 0;
	}
	
	
	
	//添加message监视用以通讯
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
		var cmd = analysisInstruction(message);
		sendResponse(executeCmd(cmd));
		updataStorage(cmd);
	});
	//添加webRequest监视以屏蔽特定文件
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
		  },
		  {
			urls: blockArry,
			types: ["script"]
		  },
		  ["blocking"]
	);	
		
	
	initSoundPlay();//载入音频元素作提示音用
	
	sendNotif("程序开始工作！");
}	

function reflashPage(activeInfo){
		var nowUrl = null;
		//console.log(activeInfo.tabId); 
		iTime = 0;
		chrome.tabs.get(activeInfo.tabId, function(tab){
			nowUrl = tab.url;
			for(var i=0;i<reflashArr.length;i++)
			{
				if(nowUrl.match(reflashArr[i])==reflashArr[i])
				{
					chrome.tabs.reload(activeInfo.tabId);
					return 1;
				}
			}
		});
}		
function startAutoRefreshPage()//若有则跳转，若无则创建
{
	chrome.tabs.onActivated.addListener(reflashPage);
	ReflashSwitch = 1;
	//sendNotif("已开启切换刷新");
}
function stopAutoRefreshPage()
{
	chrome.tabs.onActivated.removeListener(reflashPage);
	ReflashSwitch = 0;
	//sendNotif("已关闭切换刷新");
}

function jumpToWindow(aimUrl,jumpFlag)//若有则跳转，若无则创建
{
	jumpFlag = arguments[1]?true:arguments[1];
	chrome.tabs.query({},function(tabs){
		for(var tab of tabs)
		{
			if(tab.url.match(aimUrl))//全匹配
			{
				chrome.tabs.update(tab.id, {selected:true});
				return 1;
			}
			else if(tab.url.match("gcweb.nis.netease.com/modules/censor/yuedu/yuedu"))//半匹配
			{
				chrome.tabs.update(tab.id, {selected:true});
				//tab.url = aimUrl;
				//chrome.tabs.reload(tab.id);
				return 1;
			}
		}
		chrome.tabs.create({"url":"http://"+ aimUrl,"active":jumpFlag});
		return 2;
	});
}

function initSoundPlay()
{
	var elem = document.createElement('audio');
    elem.src = "images/down.mp3";
	elem.id = "bgm";
    document.getElementsByTagName('head')[0].appendChild(elem);
	//document.getElementById('bgm').load();
}


function sendNotif(type)
{

	var n;
	if(type == 1)
	{
		n = new Notification("起床了！", {body: "漫画原创了\n此通知点击跳转至/打开原创。",icon: "images/吃瓜.png"}); // 显示通知
		n.addEventListener("click",function(e){
		chrome.tabs.query({active:true},function(){
			jumpToWindow("gcweb.nis.netease.com/modules/censor/yuedu/yuedu-open-censor.html");
			if(soundPermisson == 1)	
			{
				document.getElementById('bgm').pause();
				document.getElementById('bgm').load();
			}
			n.close();
		});
		});
		if(soundPermisson == 1)
		{
			document.getElementById('bgm').play();
		}
	}
	else
	{
		n = new Notification("通知：", {body: type+"\n点击关闭此通知",icon: "images/吃瓜.png"}); // 显示通知
		n.addEventListener("click",function(e){
		chrome.tabs.query({active:true},function(){
			n.close();
		});
		});
	}
	
}


function switchNoti2H(cmd)
{
	if(cmd == "start")
	{
		switchNoti("stop");	
		intervalID = window.setInterval(function(){
				sendNotif(1);
				//alert("清原创漫画"); //回头取消
				alert("其他模块也要清了");
				sendNotif("其他模块也要清了");
				timeSend = 0;
			},60*2*1000*60);
			sendNotif("开始计算2H时间，注意清当前一轮"); //回头取消
	}
	else if(cmd == "stop")
	{
		intervalID = window.clearInterval(intervalID);
		sendNotif("停止计算2H时间");
		NotifSwitch = 0;
	}
}
function switchReflash()
{
	if(ReflashSwitch == 0)
	{
		startAutoRefreshPage();
	}
	else if(ReflashSwitch == 1)
	{
		stopAutoRefreshPage();
	}
	
	if(NotifSwitch==1)
    {return('关闭小模块计时器');}
	else if(NotifSwitch==0)
	{return('开启小模块计时器');}
}
function switchNoti(cmd)
{
	if(cmd == "start" && intervalID == null)
	{
			intervalID = window.setInterval(function(){
				timeSend += 1;
				sendNotif(1);
				//alert("清原创漫画"); //回头取消
				if(timeSend == 4)
				{
					//alert("其他模块也要清了");
					sendNotif("其他模块也要清了");
					timeSend = 0;
				}
			},30*1000*60);
			NotifSwitch = 1;
			timeSend = 0;
			sendNotif("开始计算时间，注意清当前一轮漫画原创"); //回头取消
	}else if(cmd == "stop")
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


function updataStorage(cmd)
{
	if(cmd.type == "setInterTime"){
		localStorage.setItem(cmd.source+"-interTime",cmd.num);

	}
	if(cmd.type == "CloseNotif"){
		localStorage.setItem("globalVariables"+"-NotifSwitch",NotifSwitch);
	}
	if(cmd.type == "changeReflashStatus"){
		localStorage.setItem("globalVariables"+"-ReflashSwitch",ReflashSwitch);
	}
	if(cmd.type == "changeSoundPermission")
	{
		localStorage.setItem("globalVariables"+"-SoundPermission",soundPermisson);
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
		if(NotifSwitch==1)
        {responseText = switchNoti("stop");}
		else if(NotifSwitch==0)
		{responseText = switchNoti("start");}
    }
	else if(cmd.type == 'changeReflashStatus'){
		if(ReflashSwitch==1)
        {
			stopAutoRefreshPage();
			responseText = '开启切换刷新';
		}
		else if(ReflashSwitch==0)
		{
			startAutoRefreshPage();
			responseText = '关闭切换刷新';
		}
    }
	else if(cmd.type == "getNotifStatus")
	{ 
		if(NotifSwitch==1)
        {responseText = '关闭小模块计时器';}
		else if(NotifSwitch==0)
		{responseText = '开启小模块计时器';}
    }
	else if(cmd.type == "getReflashStatus")
	{ 
		if(ReflashSwitch==1)
        {responseText = '关闭切换刷新';}
		else if(ReflashSwitch==0)
		{responseText = '开启切换刷新';}
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
	else if(cmd.type == "openPagas")
	{
		jumpToWindow("gcweb.nis.netease.com/modules/censor/yuedu/yuedu-open-censor.html",false);
		jumpToWindow("gcweb.nis.netease.com/modules/censor/yuedu/yaolushan-censor.html",false);
		jumpToWindow("gcweb.nis.netease.com/modules/censor/gacha/gacha-user-censor.html",false);
		jumpToWindow("gcweb.nis.netease.com/modules/censor/yooc/yooc-censor.html",false);
		jumpToWindow("gcweb.nis.netease.com/modules/censor/popo/popo-suspect-censor.html",false);
		responseText = "open pages";
	}
	else if(cmd.type == "getUpdataText")
	{
		
	}
	else if(cmd.type == "changeSoundPermission")
	{
		if(soundPermisson==1)
        {
			soundPermisson = 0;
			responseText = '开启通知声音提醒';
		}
		else if(soundPermisson==0)
		{
			soundPermisson = 1;
			responseText = '关闭通知声音提醒';
		}
	}
	else if(cmd.type == "getSoundPermission")
	{
		if(soundPermisson==1)
        {responseText = '关闭通知声音提醒';}
		else if(soundPermisson==0)
		{responseText = '开启通知声音提醒';}
	}
	return responseText;
}


