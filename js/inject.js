//var dieWord = 肉棒，精液，习近平，江泽民，飞叶子，丁磊，丁三石，你妈;
//hztongyueyao@163.com
var _checkWord_ = {
	"yuedu-article-censor":"WWW.05BET.CC;包夜;多少钱上门;性爱;赌;党;",
	"yueducmt-censor":"政府;国家领导人;政才",
	"yuedu-message-censor":"390350063;",
	"study-censor":"交流;web;大数据开发;php;前端;java;免费;gan;1998;裙;资料;625;私我;群;留q;前面;",
	"yaolushancmt-censor":"扣;流量;V;薇;+;",
	
	
	"web.antispam.netease.com-pornographic":"逼;奶子;插;奸;高潮;舔;口交;呻吟;约;日;曰;射;屌;水多;爽;草;啪;干;自慰;精液;撸;叫 床;做爱;套 紧;上 床;bi;咪;j8;搞;",
	"web.antispam.netease.com-polity":"政府;文革;腐败;萨德;广电;官;抵制;起义;暴动;二 代;长者;蛤;警察;",
	"web.antispam.netease.com-ads":"虾米;快手;yy;酷我;加 我;薇;qq .com;vx;房事;建议;长个;2893;",
	"web.antispam.netease.com-scold":"贱;傻;垃圾;辣鸡;gou;撒泡尿;丑;东西;撒 比;有病;进水;你妈;猪 脑;卧槽;喷子;他妈;犊子;cnm;gun;tm;mdzz;shabby;sb;jb;laji;几把;那鹰;婊;狗;猪;沙;啥;孙;屁;养 教;shi;",
	"web.antispam.netease.com-watering":"儿子 名;有个 爱着她;转发;右上;喂 屎;手指 点;觉得 好 赞;",
	"web.antispam.netease.com-name":"本兮;童可可;邓紫棋;那英;迪丽热;杨幂;赵丽颖;颖宝;卑鄙;鹿晗;",
	
	"web.antispam.netease.com-coffee":"文摘;",
	
	"common":"加V;微信;加头像;",
	"mustDel":"",
}
var pagename = new Array("yueducmt-censor","yuedu-message-censor","yuedu-article-censor",
					"yuedu-open-censor","yuedu-user-censor","yaolushan-censor","yaolushancmt-censor",
					"gacha-post-censor","gacha-user-censor","study-censor","popo-suspect-censor","web.antispam.netease.com");

var updateNum;//器官标注的统计，需要全局在F12更改，所以放在外面可访问。
var _bodyHasFocus_ = 1;
var checkKeyIndex = -1;
var wordList;


matchUrl();



function matchUrl()
{
	if(window.location.href.match("gcweb.nis.netease.com") =="gcweb.nis.netease.com")
	{
		$(document).ready(function(){
			initAll();
		});
	}
	else if(window.location.href.match("220.181.72.109:818") =="220.181.72.109:818")
	{
		initEmail();
	}
	else if(window.location.href.match("mmo.mi.nis.netease.com") =="mmo.mi.nis.netease.com")
	{
		initImgMark();
	}
	else if(window.location.href.match("web.antispam.netease.com") =="web.antispam.netease.com")
	{
		initYidun();
	}
}

function GetMainObject(str,type)
{
	if(type == 0)
	{
		return top.frames[3].document.getElementById(str);
	}
	else if(type == 1)
	{
		return top.frames[3].document.getElementsByClassName(str);
	}
	else if(type == 2)
	{
		return top.frames[3].document.getElementsByTagName(str);
	}
}












function initYidun(){
	
	//changeBodyFocus();
	var wordListInyidun = {
		"pornographic":_checkWord_["web.antispam.netease.com-pornographic"].split(";"),
		"polity":_checkWord_["web.antispam.netease.com-polity"].split(";"),
		"ads":_checkWord_["web.antispam.netease.com-ads"].split(";"),
		"scold":_checkWord_["web.antispam.netease.com-scold"].split(";"),
		"watering":_checkWord_["web.antispam.netease.com-watering"].split(";"),
		"name":_checkWord_["web.antispam.netease.com-name"].split(";"),
		"coffee":_checkWord_["web.antispam.netease.com-coffee"].split(";")
	};
	var checkKeyIndexInyidun = new Array(0,0,0,0,0,0,0);
	$("body").on("keydown",function(e){
		if(90 >= e.which && e.which >= 65 && e.target.tagName != "INPUT")//1 
		{
			var nowKeyIndex = null;
			var nowtype = null;
			switch (e.which)
			{
				case 81:nowtype = "pornographic";nowKeyIndex = 0;break;//Q
				case 87:nowtype = "polity";nowKeyIndex = 1;break;//W
				case 69:nowtype = "ads";nowKeyIndex = 2;break;//E
				case 82:nowtype = "scold";nowKeyIndex = 3;break;//R
				case 84:nowtype = "watering";nowKeyIndex = 4;break;//T
				case 89:nowtype = "name";nowKeyIndex = 5;break;//Y
				case 90:nowtype = "coffee";nowKeyIndex = 6;break;//Z
				default: return;break;
			}
			checkKeyIndexInyidun[nowKeyIndex]++;
			if(checkKeyIndexInyidun[nowKeyIndex] > wordListInyidun[nowtype].length - 1)
			{
				checkKeyIndexInyidun[nowKeyIndex] = -1;
			}
			$("#keyword").val(wordListInyidun[nowtype][checkKeyIndexInyidun[nowKeyIndex]]);
			$("#queryBtn").trigger("click");
		}
		if(e.which == 110 && e.target.tagName != "INPUT")
		{
			$("#keyG").trigger("click");
		}
		
	});
}















///////////123///////


function initEmail(){
	
	function foucsItemInit(itemIndex)//清除其他项目的focus样式，设置目标focus样式
	{
		if(activeTab == "质检平台")
		{
			var item = trsCheckList.eq(itemIndex*3 + 1);
			trsCheckList.attr("hasFocus","NO");
			trsCheckList.attr("style","background-color: while;");
			item.attr("hasFocus","YES");
			item.css("background-color","#F9CD81");
			return;
		}
		var item = tableObjS.eq(itemIndex);
		var flagText;
		for(var j=0;j<tableObjS.length;j++)
		{
			if(tableObjS.eq(j).attr("needReset")=="true")
			{
				radios = tableObjS.eq(j).find("input:radio");
				tableObjS.eq(j).attr("needReset","false");
				for(var i=0;i<radios.length;i++)
				{
					switch(radios.eq(i).next().text())
					{
						case "标题聚类(1)": radios.eq(i).next().text("标题聚类");break;//1   标题聚类/URL/概要标题/趋势分析/（文本）
						case "URL": radios.eq(i).next().text("URL");break;
						case "概要标题(1)": radios.eq(i).next().text("概要标题");break;
						case "趋势分析(1)": radios.eq(i).next().text("趋势分析");break;
						case "文本(1)": radios.eq(i).next().text("文本");break;
						case "图片(1)": radios.eq(i).next().text("图片");break;
						case "附件(1)": radios.eq(i).next().text("附件");break;
						case "文本(3)": radios.eq(i).next().text("文本");break;
						case "不入库(2)": radios.eq(i).next().text("不入库");break;
						case "忽略(空格)": radios.eq(i).next().text("忽略");break;
						case "正常(R)": radios.eq(i).next().text("正常");break;
						case "良好(R)": radios.eq(i).next().text("良好");break;
						case "广告邮件(W)": radios.eq(i).next().text("广告邮件");break;
						case "订阅邮件(E)": radios.eq(i).next().text("订阅邮件");break;
						case "垃圾邮件(Q)": radios.eq(i).next().text("垃圾邮件");break;
						case "垃圾(Q)": radios.eq(i).next().text("垃圾");break;
						case "封禁(D)": radios.eq(i).next().text("封禁");break;
						case "拒收(D)": radios.eq(i).next().text("拒收");break;
						default:console.log("Cannot find radio to reset");break;
					}
				}			
			}
		}
		tableObjS.attr("hasFocus","NO");
		tableObjS.attr("style","background-color: while;");
		item.attr("hasFocus","YES");
		item.attr("needReset","true");
		item.css("background-color","#F9CD81");
		radios = item.find("input:radio");
		for(var i=0;i<radios.length;i++)
		{
			switch(radios.eq(i).next().text())
			{
				case "标题聚类": radios.eq(i).next().text("标题聚类"+"(1)");break;//1   标题聚类/URL/概要标题/趋势分析/（文本）
				case "URL": radios.eq(i).next().text("URL"+"");break;
				case "概要标题": radios.eq(i).next().text("概要标题"+"(1)");break;
				case "趋势分析": radios.eq(i).next().text("趋势分析"+"(1)");break;
				case "图片": radios.eq(i).next().text("图片"+"(1)");break;
				case "附件": radios.eq(i).next().text("附件"+"(1)");break;
				case "文本": if(i==0)
							 {radios.eq(i).next().text("文本"+"(1)");}
							 else
							 {radios.eq(i).next().text("文本"+"(3)")}
							 break;
				case "不入库": radios.eq(i).next().text("不入库"+"(2)");break;
				case "忽略": radios.eq(i).next().text("忽略"+"(空格)");break;
				case "正常": radios.eq(i).next().text("正常"+"(R)");break;
				case "良好": radios.eq(i).next().text("良好"+"(R)");break;
				case "广告邮件": radios.eq(i).next().text("广告邮件"+"(W)");break;
				case "订阅邮件": radios.eq(i).next().text("订阅邮件"+"(E)");break;
				case "垃圾邮件": radios.eq(i).next().text("垃圾邮件"+"(Q)");break;
				case "拒收": radios.eq(i).next().text("拒收"+"(D)");break;
				case "封禁": radios.eq(i).next().text("封禁"+"(D)");break;
				case "垃圾": radios.eq(i).next().text("垃圾"+"(Q)");break;
				default:console.log("Cannot find radios for init");break;
			}
		}
	}
	
	function initItem()//为邮件条目添加index等初始化事件
	{
		if(activeTab == "聚类审核")
			tableObjS = jQuery('#clusterVerify').find("table[class='simple_table']");
		else if(activeTab == "非重要聚类")
			tableObjS = jQuery('#unimportanceClusterVerify').find("table[class='simple_table']");
		else return;
		if(tableObjS.length!=0)
		{
			var focusFirstFlag = 0;
			for(var i=0;i<tableObjS.length;i++)
			{
				if(tableObjS.eq(i).attr("index")==null)
				{
					tableObjS.eq(i).attr("index",i);//
					//tableObjS.eq(i).height(500);//item高度。
					tableObjS.attr("hasFocus","NO");
					tableObjS[i].on("mousedown",function(){
						nowIndex = parseInt(jQuery(this).attr("index"));
						console.log("nowIndex = "+nowIndex);
						foucsItemInit(nowIndex);
						//tableObjS.eq(nowIndex).find("input:radio").eq(R).attr("checked",true);对radio的访问。
						//console.log(this);
					});
					nowIndex = 0;
				}
				if(tableObjS.eq(i).attr("hasFocus")=="YES")
				{
					focusFirstFlag+=1;
				}
			}
			i = 0;
			if(focusFirstFlag==0)
			{
				if(nowIndex == null || nowIndex < 0)
				{
					nowIndex = 0;
				}
				focusItem(nowIndex,-1);
			}
		}
		else
		{
			console.log("The email table not find");
			//searchInitItem("stop");
		}
		
	}
	function initCheck()
	{
		trsCheckList = jQuery("#clusterInfoQAPlatform").find(".simple_table").eq(0).find("tr");
		var j = 0;
		var focusFirstFlag = 0;
		if(trsCheckList.length <= 1)
			return;
		for(var i=0;i<trsCheckList.length;i++)
		{
			if(i%3 == 1 && trsCheckList.eq(i).attr("titleIndex") == null)
			{
				var trBody = trsCheckList.eq(i);
				trsCheckList.eq(i).attr("titleIndex",(i-i%3)/3);
				trBody.attr("bodyIndex",(i-i%3)/3);
				trBody.attr("hasFocus","NO");
				trBody.bind("mousedown",function(){
						nowIndex = parseInt(jQuery(this).attr("bodyIndex"));
						console.log("nowIndex = "+nowIndex);
						foucsItemInit(nowIndex);
					});
				nowIndex = 0;
			}
			if(trsCheckList.eq(i).attr("hasFocus")=="YES")
				{
					focusFirstFlag+=1;
				}
		}
		i = 0;
		if(focusFirstFlag==0)
			{
				if(nowIndex == null || nowIndex < 0)
				{
					nowIndex = 0;
				}
				focusItem(nowIndex,-1);
			}
	}
	function readyToInit()//文档加载完成时候初始化邮件条目
	{
		/* GetMainObject("body",2)[0].on("onload",function(e){
			initItem();
			
		}); */
		jQuery(top.frames[3].document).ready(function(){
			initItem();
			//jQuery(GetMainObject("body",2)[0]).focus();
		});
	}
	function getActiveTab()
	{
		//activeTab = null;
		if(jQuery("#panel_unimportanceClusterVerify").attr("class")=="tap5c_tab-set-panel activated")
		{
			activeTab = "非重要聚类";
			return true;
		}
		if(jQuery("#panel_clusterVerify").attr("class")=="tap5c_tab-set-panel activated")
		{
			activeTab = "聚类审核";
			return true;
		}
		if(jQuery("#panel_clusterInfoLowScoreVerify").attr("class")=="tap5c_tab-set-panel activated")
		{
			activeTab = "低分聚类审核";
			return true;
		}
		if(jQuery("#panel_clusterInfoQAPlatform").attr("class")=="tap5c_tab-set-panel activated")
		{
			activeTab = "质检平台";
			return activeTab;
		}
		return false;
	}
	
	function searchInitItem(cmd)//每隔x秒扫描item条目并绑定事件，不是太懂如何去监视邮件的条目更改，暂时写死.
	{
			//var interTime = 1;
			if(cmd == "stop")
			{
				searchValId = window.clearInterval(searchValId);
			}
			else //if(searchValId == null)
			{
				searchValId = window.clearInterval(searchValId);
				searchValId = window.setInterval(function(){
					getActiveTab();
					if(activeTab == true && loseFocusFlag!=1)
					{
						initItem();
					}
					else if(activeTab == "质检平台")
					{
						initCheck();
					}
				},3*1000);
			}
	}
	
	function setRadioVal(itemIndex,str)//设置radio的val为true，记得考虑组冲突的情况，可能需要修改。
	{
		if(nowIndex == null)
		{
			return console.log("No focus item");
		}
		var radios = tableObjS.eq(itemIndex).find("input:radio");
		if(radios.length==0)
		{
			return console.log("Cannot find radio object");
		}
		for(var i=0;i<radios.length;i++)
		{
			if(radios.eq(i).next().text()==str)
			{
				//radios.eq(i).attr("checked",true);
				radios.eq(i).trigger("click");
				return true;
			}
		}
		return false;
	}
	function ItemToView(itemIndex)//跳转至item位置。
	{
		if(activeTab == "质检平台")
		{
			var scrollOffset = top.frames[3].document.documentElement.scrollTop;//滚动条上面隐藏区域的高度
			var topOffsetDoc = trsCheckList.eq(itemIndex * 3 + 1).offset().top;//离文档可是区域顶端的距离,在区域上面时为负数。
			var positionY = topOffsetDoc + scrollOffset;//元素的Y轴位置。
			top.frames[3].scrollTo(0,positionY);	
			return;
		}
		var scrollOffset = top.frames[3].document.documentElement.scrollTop;//滚动条上面隐藏区域的高度
		var topOffsetDoc = tableObjS.eq(itemIndex).offset().top;//离文档可是区域顶端的距离,在区域上面时为负数。
		var positionY = topOffsetDoc + scrollOffset;//元素的Y轴位置。
		top.frames[3].scrollTo(0,positionY);			
	}
	function bindKeyEvent()//绑定键盘事件在body上
	{
		GetMainObject("body",2)[0].on("keydown",function(e){
			
			if(e.which == 32 ||e.which == 38 ||e.which == 40)//space UP DOWN 忽略 上 下
			{
				if(loseFocusFlag != 1)
				{
					e.preventDefault();	
					return	false;				
				}
			}
		});
/* 		if(activeTab == "质检平台")
		{
			GetMainObject("body",2)[0].off("keyup");
			GetMainObject("body",2)[0].on("keyup",function(e){
				if(nowIndex != null && loseFocusFlag != 1 && e.target.tagName != "INPUT") 
				{
					if(e.which == 32 || e.which == 40) //下 空格
 					{
						e.preventDefault();
						if(nowIndex>=(trsCheckList.length-1)/3 - 1)
						{
							nowIndex = -1;
							focusNextItem(0);
						}
						else
						{
							focusNextItem(nowIndex);
						}
					}
					else if(e.which == 38)//UP  向上一条
					{
						e.preventDefault();
						if(nowIndex==0)
						{
							nowIndex = (trsCheckList.length-1)/3 -1+1;
							focusPrveItem(nowIndex-1);
						}
						else
						{
							focusPrveItem(nowIndex-1);
						}
					}
					
				}
			});
			return;
		} */
		GetMainObject("body",2)[0].on("keyup",function(e){//可能找不到body无法绑定
			if(nowIndex != null && loseFocusFlag != 1 && e.target.tagName != "INPUT") 
			{
				if(e.which == 32)//space 忽略
				{
					e.preventDefault();
					if(activeTab == "质检平台")
					{
						focusNextItem(nowIndex);
						return;
					}
					setRadioVal(nowIndex,"忽略(空格)");
					focusNextItem(nowIndex);
					
				}
				else if(e.which == 82)//R 正常 加一个良好
				{
					if(activeTab == "质检平台") return;
					if(setRadioVal(nowIndex,"正常(R)") == false)
					{
						setRadioVal(nowIndex,"良好(R)");
					}
					focusNextItem(nowIndex);
				}
				else if(e.which == 87)//W  广告邮件
				{
					if(activeTab == "质检平台") return;
					setRadioVal(nowIndex,"广告邮件(W)");
					focusNextItem(nowIndex);
				}
				else if(e.which == 69)//E  订阅邮件
				{
					if(activeTab == "质检平台") return;
					setRadioVal(nowIndex,"订阅邮件(E)");
					focusNextItem(nowIndex);
				}
				else if(e.which == 81)//Q  垃圾邮件 垃圾
				{
					if(activeTab == "质检平台") return;
					if(setRadioVal(nowIndex,"垃圾邮件(Q)") == false)
					{
						setRadioVal(nowIndex,"垃圾(Q)");
					}
					var radios = tableObjS.eq(nowIndex).find("input:radio");
					var firstText = radios.eq(0).next().text().replace("(1)","");
					if(firstText == "URL" && radios.eq(0).attr("checked") == true &&window.location.href.match("220.181.72.109:8181") == "220.181.72.109:8181")
					{
						return;
					}
					focusNextItem(nowIndex);
				}
				else if(e.which == 49)//1   标题聚类/URL/概要标题/趋势分析/（文本）/图片/附件
				{
					var radios = tableObjS.eq(nowIndex).find("input:radio");
					var firstText = radios.eq(0).next().text().replace("(1)","");
					if(firstText == "URL")
					{
						setRadioVal(nowIndex,firstText);
					}
					setRadioVal(nowIndex,firstText+"(1)");
				}
				else if(e.which == 51)//3  位处第二的文本
				{
					setRadioVal(nowIndex,"文本(3)");
				}
				else if(e.which == 50)//2   不入库
				{
					setRadioVal(nowIndex,"不入库(2)");
				}
				else if(e.which == 68)//D   封禁 拒收 
				{
					if(activeTab == "质检平台") return;	
					if(setRadioVal(nowIndex,"封禁(D)") == false)
					{
						setRadioVal(nowIndex,"拒收(D)");
					}
					var radios = tableObjS.eq(nowIndex).find("input:radio");
					var firstText = radios.eq(0).next().text().replace("(1)","");
					var isUrl = radios.eq(0).attr("checked");
					var href = window.location.href.match("220.181.72.109:8181");
					if(firstText == "URL" && radios.eq(0).attr("checked") == true &&window.location.href.match("220.181.72.109:8181") == "220.181.72.109:8181")
					{
						return ;
					}
					//setRadioVal(nowIndex,"封禁(D)");
					focusNextItem(nowIndex);
				}
				else if(e.which == 38)//UP  向上一条
				{
					e.preventDefault();
					if(activeTab == "质检平台")
					{
						if(nowIndex==0)
						{
							nowIndex = (trsCheckList.length-1)/3 -1+1;
							focusPrveItem(nowIndex-1);
						}
						else
						{
							focusPrveItem(nowIndex-1);
						}
						return;
					}
					if(nowIndex==0)
					{
						nowIndex = tableObjS.length -1+1;
						focusPrveItem(nowIndex-1);
					}
					else
					{
						focusPrveItem(nowIndex-1);
					}
				}
				else if(e.which == 40)//DOWN  向下一条
				{
					e.preventDefault();
					if(activeTab == "质检平台")
					{
						if(nowIndex>=(trsCheckList.length-1)/3 - 1)
						{
							/* nowIndex = -1;
							focusNextItem(0); */
						}
						else
						{
							focusNextItem(nowIndex);
						}
						return;
					}
					if(nowIndex>=tableObjS.length - 1)
					{
						/* nowIndex = -1;
						focusNextItem(0); */
					}
					else
					{
						focusNextItem(nowIndex);
					}
				}
				else if(e.which == 70)//F focus
				{
					focusItem(nowIndex);
				}
			}
			else
			{
				nowIndex = 0;
			}
			
		});
		GetMainObject("body",2)[0].tabIndex = "-1";
		jQuery(GetMainObject("body",2)[0]).focus(function(){
			console.log("focus");
			loseFocusFlag = null;
			if(getActiveTab() == true)
			{
				initItem();
			}
			else if(activeTab == "质检平台")
			{
				initCheck();
			}
		});
		jQuery(GetMainObject("body",2)[0]).blur(function(e){
			for(var j=0;j<tableObjS.length;j++)
			{
				if(tableObjS.eq(j).attr("needReset")=="true")
				{
					radios = tableObjS.eq(j).find("input:radio");
					tableObjS.eq(j).attr("needReset","false");
					for(var i=0;i<radios.length;i++)
					{
						switch(radios.eq(i).next().text())
						{
							case "标题聚类(1)": radios.eq(i).next().text("标题聚类");break;//1   标题聚类/URL/概要标题/趋势分析/（文本）
							case "URL": radios.eq(i).next().text("URL");break;
							case "概要标题(1)": radios.eq(i).next().text("概要标题");break;
							case "趋势分析(1)": radios.eq(i).next().text("趋势分析");break;
							case "文本(3)": radios.eq(i).next().text("文本");break;
							case "文本(1)": radios.eq(i).next().text("文本");break;
							case "图片(1)": radios.eq(i).next().text("图片");break;
							case "附件(1)": radios.eq(i).next().text("附件");break;
							case "不入库(2)": radios.eq(i).next().text("不入库");break;
							case "忽略(空格)": radios.eq(i).next().text("忽略");break;
							case "正常(R)": radios.eq(i).next().text("正常");break;
							case "良好(R)": radios.eq(i).next().text("良好");break;
							case "广告邮件(W)": radios.eq(i).next().text("广告邮件");break;
							case "订阅邮件(E)": radios.eq(i).next().text("订阅邮件");break;
							case "垃圾邮件(Q)": radios.eq(i).next().text("垃圾邮件");break;
							case "垃圾(Q)": radios.eq(i).next().text("垃圾");break;
							case "封禁(D)": radios.eq(i).next().text("封禁");break;
							case "拒收(D)": radios.eq(i).next().text("拒收");break;
							default:console.log("Cannot find radio to reset");break;
						}
					}			
				}
			}
			tableObjS.attr("hasFocus","NO");
			tableObjS.attr("style","background-color: while;");
			//nowIndex = null;
			loseFocusFlag = 1;
			console.log("page has no focus");
		});
	}
	function focusItem(itemIndex,jumpFlag)//切换不跳，
	{
		jumpFlag = arguments[1] ? arguments[1]:1;
		if(activeTab == "质检平台" && itemIndex < (trsCheckList.length-1)/3)
		{
			foucsItemInit(itemIndex);
			console.log("nowIndex = "+nowIndex);
			if(jumpFlag == 1)
			{
			ItemToView(itemIndex);
			}
			return;
		}
		if(itemIndex<tableObjS.length)
		{
			foucsItemInit(itemIndex);
			console.log("nowIndex = "+nowIndex);
			if(jumpFlag == 1)
			{
			ItemToView(itemIndex);
			}
		}
	}
	
	function focusNextItem(itemIndex,jumpFlag)//
	{
		nowIndex += 1;
		focusItem(nowIndex,jumpFlag);
	}
	function focusPrveItem(itemIndex,jumpFlag)
	{
		nowIndex -= 1;
		focusItem(nowIndex,jumpFlag);
	}	
	
	
	
	var searchValId = null;
	var index = 0;
	var nowIndex = null;
	var nowRadios=null;
	var loseFocusFlag = null;
	var radios = null;
	var trsCheckList = null;
	var activeTab = null;
	var tableObjS = null;
	var activeTab =null;
	readyToInit();
	searchInitItem("start");
	bindKeyEvent();

	
	
	

}
/* 修改通用标签的宽度显示
 var currentUrl = window.location.href;
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
function delayAndExecute(delayNum,func)
{
	var a = window.setInterval(function(){
			func();
			a = window.clearInterval(a);
		},delayNum);
}
function initAll()
{
	//获取通知权限
	Notification.requestPermission( function(status) {
    console.log(status); // 仅当值为 "granted" 时显示通知
    //var n = new Notification("title", {body: "插件开始工作"}); // 显示通知
  });
 
	//changeBodyFocus();
	liveAutoKeydown();
	liveDelImageKeyDown();
	getSearchKey();
	
	$("#messageBoxId").text(window.location.href);
	$("#messageBoxId").click();
	$("#messageBoxId").hide();
	
	
	switch(window.location.href){
		case "http://gcweb.nis.netease.com/modules/censor/study/study-censor.html?dataType=14":initKeyMOOC(); break;
		case "http://gcweb.nis.netease.com/modules/censor/study/study-censor.html?dataType=14#":initKeyMOOC(); break;
		
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
function changeBodyFocus()
{
	var body = document.getElementsByTagName("body")[0];
	body.tabIndex = "-1";
	$("body").focus(function(){
		_bodyHasFocus_ = 1;
	});
	$("body").blur(function(e){
		_bodyHasFocus_ = null;
	});
	
}


function liveAutoKeydown()
{
	var passItem = function(currentItem){
		$(currentItem).removeClass("s-fc7 unpass uncensor").addClass("s-fc8 pass").attr("newStatus", "2000");
		moveNext(currentItem);
		$(currentItem).attr("style","none");
	}
	
	/** 删除当前选中的项 */
	var delItem = function(currentItem){
		$(currentItem).removeClass("s-fc8 pass uncensor").addClass("s-fc7 unpass").attr("newStatus", "3000");
		moveNext(currentItem);
		$(currentItem).attr("style","none");
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
	
	var startAutoNext = function()
	{
		interTime = parseInt($("#interTimeText").text().split("：")[1]);
		getIndexNum();
		$("#cs-list a").eq(firstUncensorIndex).click();//从第一个未审核的开始。
		nowIndex = firstUncensorIndex;
		intervalID = window.setInterval(function(){
		//if(pauseFlag == 0){
			if($("#querycount").text() != "0"){
				if(delMessage == 1){
					delItem($("#cs-list a").eq(nowIndex));
					delMessage = 0;
				}
				else{
					passItem($("#cs-list a").eq(nowIndex));				
				}
			}
			else{
					intervalID = window.clearInterval(intervalID);
					autoStatus = 0;
			}
					
		},interTime);
		autoStatus = 1;
	}
	
	var stopAutoNext = function()
	{
		intervalID = window.clearInterval(intervalID);
		autoStatus = 0;
	}
	var liveMouseEvent = function()
	{
		var detail =$("#detail");
		detail.on("mouseup",function(e){
			var targetType = e.target.tagName
			if(targetType == "A" || targetType == "INPUT") return;
			if(autoStatus == 1){
				if(e.which == 1)
				{
				}
				if(e.which == 3)
				{	
					delMessage = 1;				
				}
				if(e.which == 2){
					e.preventDefault();
					stopAutoNext();
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
				else if(e.which == 2&&$("#cs-list a").length > 0)
				{
					e.preventDefault();
					startAutoNext();
				}
				screenTopNum = 0;
				$("#detail").animate({scrollTop:0},100);
				//alert(nowIndex);				
			}
		});
		mouseEvent = 1;
	}
	var dieMouseEvent = function()
	{
		$("#detail").off("mouseup");
		mouseEvent = 0;
	}
	
	
	var firstUncensorIndex = null;
	var interTime;
	var nowIndex = null;
	var list = $("#cs-list a");
	var item;
	var autoStatus = 0;
	var intervalID;
	var delMessage = 0;
	//var pauseFlag = 0;
	interTime = parseInt($("#interTimeText").text().split("：")[1]);
	var mouseEvent;
	
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
		liveMouseEvent();
		$("body").on("keydown", function(e){
			if(e.target.tagName != "INPUT"){
				if(e.which == 96)
				{
					window.open("http://gcweb.nis.netease.com/modules/censor/yuedu/yaolushan-censor.html","漫画");
					window.open("http://gcweb.nis.netease.com/modules/censor/yuedu/yuedu-open-censor.html","阅读");
					window.open("http://gcweb.nis.netease.com/modules/censor/gacha/gacha-user-censor.html","GACHA");
					window.open("http://gcweb.nis.netease.com/modules/censor/yooc/yooc-censor.html","云课堂");
					window.open("http://gcweb.nis.netease.com/modules/censor/popo/popo-suspect-censor.html","POPO");
				}
				if(e.which == 105)//9
				{
					if(autoStatus == 0){
					startAutoNext();
					}
					else if(autoStatus == 1)
					{
						stopAutoNext();
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
					$("#cs-list a.focus").focus();
					//PASS,下一个
				}
				if(e.which == 83)//D
				{
					$("#cs-list a.focus").focus();
					//DEL,下一个
				}
				if(e.which == 97)//1
				{
					if(mouseEvent == 1)
						dieMouseEvent();
					else
						liveMouseEvent();
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
				if(e.which == 9)//Tab 
				{
					e.preventDefault();
					checkKeyIndex++;
					if(checkKeyIndex > wordList.length - 1)
					{
						checkKeyIndex = -1;
					}
					$("#keyword").val(wordList[checkKeyIndex]);
					$("#querybtn").trigger("click");
				}
			}
			else if(e.target.tagName == "INPUT" && e.which == 9)
			{
				e.preventDefault();
				return;
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
			if(e.which == 81 && e.target.tagName != "INPUT")//Q
			{
				imgDel.click();
			}
		});
	}
}

function initManhuaCMT()
{
	$("body").on("keydown", function(e){
				if(e.target.tagName != "INPUT")
				{
					var list = $("#dataType");
					if(e.which == 49)
					{
						//list.val("8");
						$("#status").val("1000");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 50)
					{
						//list.val("7");
						$("#status").val("0");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
				}
			});
}

function initReadMessage()
{
	
	$("#multiCensor").attr("checked",false);
	$("#querybtn").click();
	//$("body").off("keydown");

}


function getSearchKey()
{
	//var wordList;
	for(var i in pagename) 
	{
		if(window.location.href.match(pagename[i]) == pagename[i] && _checkWord_[pagename[i]] != null)
		{
			wordList = _checkWord_[pagename[i]].split(";");
			break;
		}
		if(i == pagename.length - 1 && wordList == null)
		{
			return;
		}
	}
	//var index = -1;
}

function initArticle()
{
	$("#dataType").val("-1");
	$("#multiCensor").attr("checked",false);
	$("#querybtn").trigger("click");
}


function initMUSIC()
{
	var endflag = 0;
	var delI = 0;
	var delWord = new Array();
	delWord[0] = "做不一样的音乐";
	delWord[1] = "精液";
	delWord[2] = "这是本人真的私信！";
	delWord[3] = "kg2";
	delWord[4] = "kugou";
	delWord[5] = "丁磊";
	delWord[6] = "丁三石";
	delWord[7] = "你妈";
	function delMessage(delkey)
	{
		$("#dataType").val("5");
		$("#suspectType").val("1");
		$("#thumbnail").val("1");
		$("#ext").attr("checked",false);
		$("#keyword").val(delkey);
		//list.find("option[text='图片']").attr("selected".true);
		$("#querybtn").click();
		var delInterval = window.setInterval(function(){
			if($(".loading").css("display")=="none"&&$("#querycount").text() != "0"){
				$("#cs-list a").removeClass("uncensor").addClass("s-fc7 unpass").attr("newStatus", "3000");
				$("#submit").click();
			}
			if($("#querycount").text() == "0")
				{
					delInterval = window.clearInterval(delInterval);
					endflag = 1;
				}
		},1*1000);
	}
	//$("body").off("keydown");
	$("body").on("keydown", function(e){
					if(e.target.tagName != "INPUT"){
						var list = $("#dataType");
						var type = $("#suspectType");
						if(e.which == 98)
						{
							delMessage(delWord[delI]);
							var interval = window.setInterval(function(){
								if(endflag == 1)
								{	
									if(delI+1 < delWord.length)
									{
										delI += 1;
										delMessage(delWord[delI]);
										endflag = 0;
									}
									else
									{
										interval = window.clearInterval(interval);
										delI = 0;
									}
								}
								if(delI == delWord.length)
								{
									interval = window.clearInterval(interval);
									endflag = 0;
									delI = 0;
								}
							},5*1000);

						}
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
					}
				});
}

function initImgMark(){
	
}
function initMANHUA()
{
	//$("body").off("keydown");
	$("body").on("keydown", function(e){
				if(e.target.tagName != "INPUT")
				{
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
				}
			});
}
function initKeyGACHA()
{	
	//$("body").off("keydown");
	$("body").on("keydown", function(e){
			if(e.target.tagName != "INPUT")
				{
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
				}
			});
}
function initKeyMOOC()
{	
	$("#dataType").val("5");
	$("#querybtn").click();
	//$("body").off("keydown");
	$("body").on("keydown", function(e){
			if(e.target.tagName != "INPUT")
				{
					var list = $("#dataType");
					if(e.which == 49)//1
					{
						list.val("5");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 50)//2
					{
						list.val("14");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 51)//3
					{
						list.val("-1");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
					if(e.which == 52)//4
					{
						list.val("-1");
						$("#status").val("0");
						//list.find("option[text='图片']").attr("selected".true);
						$("#querybtn").click();
					}
				}
			});
}


function initKeyREAD()
{		
	var i = 0;
	$("#multiCensor").attr("checked",false);
	$("#querybtn").click();
	$("body").on("keydown", function(e){
				if(e.target.tagName != "INPUT")
				{
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
				} else if (e.which == "50"&&$("#j-dialog").css('display') == 'none') {
					$(".prev").trigger("click");
				} else if (e.which == "51"&&$("#j-dialog").css('display') == 'none') {
					$(".next").trigger("click");
				} else if (e.which == "52"&&$("#j-dialog").css('display') == 'none') {
					$(".ignoreBtn").trigger("click");
				}
				else if(e.which == 27)//Esc
				{
					if($('#j-pt-cancel') != null){
						$('#j-pt-cancel').trigger("click");
					}
				}
				else if(e.which == 13)//回车
				{
					if($('#j-pt-ok') != null){
						e.preventDefault();
						$('#j-pt-ok').trigger("click");
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
				
				if(keynum == 49&&$("#j-dialog").css('display') == 'none'){	
					if($("#j-dialog").css('display') == 'block')
					{
						
					}
					else
					{
						x[0].click();
						//setUpdataNum();
					}
				}
				else if(keynum == 50&&$("#j-dialog").css('display') == 'none'){
					$(".next").trigger("click");
				}
/* 				else if(keynum == 51){
					//$(".organNormalBtn").trigger("click"); */
 				else if(keynum == 52&&$("#j-dialog").css('display') == 'none'){
					$(".organNormalBtn").trigger("click");

				} 
				else if(keynum == 27)//Esc
				{
					if($('#j-pt-cancel') != null){
						$('#j-pt-cancel').trigger("click");
					}
				}
				else if(e.which == 32)//回车
				{
					if($('#j-pt-ok') != null){
						e.preventDefault();
						$('#j-pt-ok').trigger("click");
					}
				}
			}
		}
		function blockBlackLayer()
		{
			
			$("#j-dialog").css("backgroundColor","transparent")
		}
		//右键上传
		$('body').mousedown(function(e){
			if(e.which == 3)
			{
				if($("#j-dialog").css('display') == 'block')
				{
					if($("j-label-input")!=null)
					{		
						$("#j-dialog").mouseup(function(e){e.preventDefault();})
						$("#j-label-input").val("*");
						$('#j-pt-ok').trigger("click");
					}
				}
				else
				{
					//x[0].click();
					//setUpdataNum();
				}
			}
			
			var a = $("#markType").val();
			if(GREENMODE == 1&&a=="2"){
				$('#j-dialog').css("opacity","0.0");//透明设置
				
			}
			else if(GREENMODE == 1&&a=="1")
			{
				$('#j-dialog').css("opacity","1.0");
				blockBlackLayer();
			}
			else
			{
				$('#j-dialog').css("opacity","1.0");
			}
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
var autoId;
function autoUpdataBooks()
{
	if(window.location.href.match("gcweb.nis.netease.com") == "gcweb.nis.netease.com")
	{
		autoId = window.setInterval(function(){
			if($("#querycount").text() != "0")
			{
				$("#cs-list a").removeClass("uncensor").addClass("s-fc8 pass").attr("newStatus", "2000");
				$("#submit").click();
			}
			else{
				autoId = window.clearInterval(autoId);
				}
		},1000*60*2);
	}
	else 
	{
		alert("THE PAGA NOT AT ADDRESS IN RIGHT!");
	}
}

var delType = 0;
var autoMain = 0;
var delListWord = new Array();
delListWord[0] = "ts_181cf725b99e4f98b50f4ef0b0964548_4";//前面是要搜索的关键词，后面是类别，看上面，中间用英文符号:隔开
delListWord[1] = "ts_2d61e85b8d2145eeb7fd36757c42745d_4";
delListWord[2] = "ts_b83b6cb9570d4ef7816a3d1a109d3aa3_4";
delListWord[3] = "ts_7402ffa250164668acf239d0ccf6d4e2_4";
delListWord[4] = "ts_fb0b49a1da2441979a3be4ebdf64eeec_4";
delListWord[5] = "ts_494aa8cb1a174b38a61f3549b4f96f0d_4";
delListWord[6] = "ts_dc3585ad479848029e78934c7c3b2101_4";
delListWord[7] = "ts_74210b207c4b4f19a9b5a3d250ad22a4_4";
delListWord[8] = "ts_ac1cb8a8d0f545d58dc148ea74a4290b_4";
delListWord[9] = "ts_545340023b824e7a9a953129be8d8671_4";
delListWord[10] = "ts_9c90ce22368d4f04b56d227bfcab3715_4";
delListWord[11] = "ts_d81385119ea145688126b9f5f721fe0b_4";
delListWord[12] = "ts_23818952f0b44a4e9a18e0759b65d163_4";
delListWord[13] = "ts_3e7f62a8f0a64bdc93cfb46bce502323_4";
delListWord[14] = "ts_8a37a330dc89485c847327183faf9953_4";
delListWord[15] = "ts_3f5719e0002d4f67b63030046ee088b4_4";
delListWord[16] = "ts_84c368ab76d743cf9456f70ef7b74b12_4";
delListWord[17] = "ts_78ad7f14c63443a48f370c75328818ac_4";
delListWord[18] = "ts_6467c924b0b142a8a00d9bf9c57f8419_4";
delListWord[19] = "ts_4f69a89acc7e474fb0149ef5b3f30cb5_4";
delListWord[20] = "ts_d57d610443a8452f89c4fe84df27ff89_4";
delListWord[21] = "ts_b937edcc2aa6451886244f882973981b_4";
delListWord[22] = "ts_a808cabd0ab84f53bce8d3d49cc3390d_4";
delListWord[23] = "ts_0b6674de24174707b3b01fa1978a976a_4";
delListWord[24] = "ts_37c27871e9a3478ab5be07aa32c0c3e1_4";


function whileDelay()
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
		/* if(delType == 0)
		{
			$("#status").val("0");
			delType = 1;
		}
		else if(delType == 1)
		{
			$("#status").val("1000");
			delType = 0;
		} */
		//str = "《 》 " + str;
		$("#originalId").val(str);
		//$(".u-check input").find("name:multiable").attr("checked",false);
		console.log("search " + str);
		$("#querybtn").trigger("click");
	}
	function checkContinueSubmit()
	{
		if($('#cs-list a').length > 0)
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
		if($('#cs-list a').length == 0)
		{
			//console.log("无数据");
			return;
		}
		if($('#checklist a.focus')!= null)
		{
			//$("#cs-list a").removeClass("uncensor").addClass("s-fc7 unpass").attr("newStatus", "3000");
			$("#cs-list a").removeClass("uncensor").addClass("s-fc8 pass").attr("newStatus", "2000");
			console.log("删除了一些");
			$("#submit").click();
		}
		
		//$("#cancelBtn").trigger("click");
		//submit();
		/* curPage++;//后面改成submit;
		$("#querybtn").trigger("click"); */
	}
	
	var executingFlag = 0;
	var ajaxStop = 0;
	var step = 0;
	var nowDelWordIndex = 0;
	var Main = window.setInterval(function(){
		var ajaxFlag = $(".loading").attr("style");
		if(ajaxFlag == "display: block;")
		{
			ajaxStop = 1;
			console.log("ajax stop");
		}
		else
		{
			ajaxStop = 0;
			//console.log("executing");
		}
		if(ajaxStop == 0&&executingFlag == 0){
			switch(step)
			{
				case 0: 
					//console.log(step+"start");
					executingFlag = 1;
					delayExecut(1000,function(){
						searchStr(delListWord[nowDelWordIndex]);
						step = 1;
					});
				break;
				case 1: 
					//console.log(step+"start");
					executingFlag = 1;
					delayExecut(1000,function(){
						delList(delListWord[nowDelWordIndex]);
						step = 2;
					});
				break;
				case 2: 
					//console.log(step+"start");
					executingFlag = 1;
					delayExecut(2000,function(){
						checkContinueSubmit();
					});
				break;
				case 3: 
					//console.log(step+"start");
					executingFlag = 1;
					delayExecut(3000,function(){
						console.log("3s end"+step);
						step = 4;
					});
				break;
				case 4: 
				//	console.log(step+"start");
					executingFlag = 1;
					delayExecut(3000,function(){
						console.log("3s end"+step);
						step = 5;
					});
				break;
				case 5: 
					//console.log(step+"start");
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
		
	},30*1000);
	return console.log("开始删除.关键词列表：" + delListWord);
}
