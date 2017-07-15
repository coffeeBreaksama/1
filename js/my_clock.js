function my_clock(el){
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
	var interTime = 30;
    m=m>=10?m:('0'+m);
    s=s>=10?s:('0'+s);
    el.innerHTML = h+":"+m+":"+s;
	//if(m == 0 || m == 30)
    //setTimeout(function(){my_clock(el)}, 1000);
}



var clock_div = document.getElementById('clock_div');
my_clock(clock_div);
var interval = window.setInterval(function(){my_clock(clock_div);},1000);


getNotifStatus();
getReflashStatus();
getSoundNotiStatus();

document.getElementById('NotifictionButton').addEventListener("click",function(){
	closeNotifiction(); 
});

document.getElementById('ReflashButton').addEventListener("click",function(){
	changeReflash(); 
});

document.getElementById('openPagas').addEventListener("click",function(){
	chrome.runtime.sendMessage('openPagas;popup;null', function(response){
		//alert(response);		
	});
});
document.getElementById('NotiSoundButton').addEventListener("click",function(){
	changeSoundNoti();
});

function changeSoundNoti()
{
	chrome.runtime.sendMessage('changeSoundPermission;popup;null;', function(response){
		document.getElementById('NotiSoundButton').innerHTML = response;		
	});
}

function getSoundNotiStatus()
{
	chrome.runtime.sendMessage('getSoundPermission;popup;null;', function(response){
		document.getElementById('NotiSoundButton').innerHTML = response;		
	});
}


function closeNotifiction()
{
	chrome.runtime.sendMessage('CloseNotif;popup;null;', function(response){
		document.getElementById('NotifictionButton').innerHTML = response;		
	});
}

function getNotifStatus()
{
	chrome.runtime.sendMessage('getNotifStatus;popup;null;', function(response){
		document.getElementById('NotifictionButton').innerHTML = response;		
	});
}


function changeReflash()
{
	chrome.runtime.sendMessage('changeReflashStatus;popup;null;', function(response){
		document.getElementById('ReflashButton').innerHTML = response;		
	});
}
function getReflashStatus()
{
	chrome.runtime.sendMessage('getReflashStatus;popup;null;', function(response){
		document.getElementById('ReflashButton').innerHTML = response;		
	});
}

