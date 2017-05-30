function my_clock(el){
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
	var interTime = 30;
    m=m>=10?m:('0'+m);
    s=s>=10?s:('0'+s);
    el.innerHTML = h+":"+m+":"+s;
	if(m == 0 || m == 30)
    setTimeout(function(){my_clock(el)}, 1000);
}

var clock_div = document.getElementById('clock_div');
my_clock(clock_div);


function closeNotifiction()
{
	chrome.runtime.sendMessage('CloseNotif;popup;null;', function(response){
		document.getElementById('closeNotifiction').innerHTML = response;		
	});
}

document.getElementById('closeNotifiction').addEventListener("click",function(){
	closeNotifiction(); 
	chrome.runtime.sendMessage('autoInterTime', function(response){
		//alert(response);		
	});
	});

function getNotifStatus()
{
	chrome.runtime.sendMessage('getNotifStatus;popup;null;', function(response){
		document.getElementById('closeNotifiction').innerHTML = response;		
	});
}

getNotifStatus();