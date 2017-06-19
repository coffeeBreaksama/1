//var s = document.createElement('script');
//s.src = chrome.extension.getURL('js/inject.js');
//s.onload = function() {
  //  this.parentNode.removeChild(this);
//};
//(document.head || document.documentElement).appendChild(s);
if(window.location.href.match("220.181.72.109:8181") =="220.181.72.109:8181")
	{
		//var a = window.frames["main-frame"];
		
		//alert(document.getElementsByTagName('frameset').contentWindow);
		//loadScriptLater(url('js/jquery-3.2.1.js'));
		injectJsOnMail();

	}
else
{
	loadScript(url('js/inject.js'));
	if(document.getElementsByClassName("m-news") != null)
	{
		initIntertimeText(interTime);
	}
}





var interTime = 0;
var nowUrl;

function injectJsOnMail()
{
	var a = window.setInterval(function(){
		if(top.frames[3].document.getElementById("injectId")==null)
		{
			loadScriptLater(url('js/inject.js'),"main-frame");
		}
		//a = window.clearInterval(a);
	},1*1000);
}

function loadScriptLater(url, framename) {
    var elem = document.createElement('script');
    elem.type = 'text/javascript';
    elem.charset = 'utf-8';
    //elem.addEventListener('load', alert("inject success"), false);
    elem.src = url;
	elem.id = "injectId";
	console.log(window.frames[framename]);
    var a = top.frames[3].document;
	a.getElementsByTagName("head")[0].appendChild(elem);
	console.log(a.getElementsByTagName("head")[0]);
	console.log(a);
	//a = a + "<script src= \"" + url + "\"type=\"text/javascript\">";
	//a[0].appendChild(elem);
}



function loadScript(url) {
    var elem = document.createElement('script');
    elem.type = 'text/javascript';
    elem.charset = 'utf-8';
    //elem.addEventListener('load', alert("inject success"), false);
    elem.src = url;
    document.getElementsByTagName('head')[0].appendChild(elem);
}

function url(file) {
    return chrome.extension.getURL(file);
}


function initIntertimeText(interTimeText){
	var selecter = document.createElement("select");
	for(var i=1; i<10; i++)
	{
		var options = document.createElement("option");
		options.text = 500 * i;
		selecter.add(options,null);	
	}	
	selecter.id = "selecterId";
	selecter.onchange = (function()
	{
		var x = document.getElementById("selecterId");
		interTime = parseInt(x.options[x.selectedIndex].text);
		chrome.extension.sendMessage("setInterTime;"+nowUrl+";"+interTime+";",function(response){
		document.getElementById("interTimeText").innerHTML = "自动间隔：" + response;
		});
	});
	var messageBox = document.createElement("button");
	messageBox.id = "messageBoxId";
	messageBox.innerHTML = "messageBoxId in here";
	messageBox.onclick = (function()
	{
		nowUrl = messageBox.innerHTML;
		//alert("messageBox 改动了");
		chrome.extension.sendMessage("getInterTime;"+nowUrl+";null;",function(response){
		//alert(response);
		//alert("1");
		interTime = parseInt(response);
		if(interTime == null){interTime = 1000};
		document.getElementById("interTimeText").innerHTML = "自动间隔：" + response;
		});
	});	
	
	var para = document.createElement("p");
	para.id = "interTimeText"
	var node=document.createTextNode("自动间隔：" + interTimeText);
	para.appendChild(node);

	var element=document.getElementById("funcarea");
	element.appendChild(para);
	element.appendChild(selecter);
	element.appendChild(messageBox);
}
