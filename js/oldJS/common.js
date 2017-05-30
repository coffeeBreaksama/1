/**
 *违禁图片的命名空间，占位
 */
var illegalImage = {};
illegalImage.imageLimits = {"20": "20", "50": "50", "100": "100", "200": "200"};
// 判别类型
illegalImage.imageCheckTypes = {"0": "其他", "1": "正常", "2": "色情", "3": "暴恐", "4": "背景文本", "5": "性感", "6": "政治", "7": "广告"};
// 增加所有
illegalImage.imageCheckTypeMap = {"-1": "所有", "0": "其他", "1": "正常", "2": "色情", "3": "暴恐", "4": "背景文本", "5": "暴露"};
// 判别子类型
//illegalImage.imageCheckSubTypes = {"0":{"0":"其他"},
//                            "1":{"0":"其他"},
//                            "2":{"0":"其他", "1":"暴露"},
//                            "3":{"0":"其他"},
//                            "4":{"0":"其他"}}
// 增加所有
//illegalImage.imageCheckSubTypeMap = {"-1":{"-1":"所有"},
//                            "0":{"-1":"所有", "0":"其他"},
//                            "1":{"-1":"所有", "0":"其他"},
//                            "2":{"-1":"所有", "0":"其他", "1":"暴露"},
//                            "3":{"-1":"所有", "0":"其他"},
//                            "4":{"-1":"所有", "0":"其他"}}

// 标注图像标签
illegalImage.tags = {"porn":"色情明显", "vagina":"女下体", "nips":"女乳房", "penis":"男下体", "porn_ind":"色情掩盖", "vulgar":"低俗", "unclothed":"性感", "shirtless":"赤膊"
    , "char":"文字", "char_clip":"简单背景", "char_photo":"复杂背景", "char_ads":"广告", "illegal":"违法犯罪", "political":"政治", "war":"战争", "cartoon":"卡通",
    "manga":"漫画", "qr_code":"二维码", "wildcard":"特殊合理", "char_view":"照片文字", "normal":"正常", "porn_slight":"轻微色情", "bloody":"血腥暴力"};

illegalImage.tagsBitMap = {1:"女下体", 2:"女乳房", 3:"男下体", 4:"色情掩盖", 5:"低俗", 6:"性感", 7:"赤膊", 9:"简单背景", 10:"复杂背景", 11:"广告", 12:"违法犯罪", 13:"政治", 14:"战争", 15:"卡通",
    16:"漫画", 17:"二维码", 18:"特殊合理", 19:"照片文字", 20:"正常", 22:"轻微色情", 23:"血腥暴力"};

// 图片编辑模板
illegalImage.imageTemp = [
    '<ul id="images">',
    '${list}.each(',
    '    <li style="position: relative;border:1px solid #CCC;text-align:center;width:200px;height:200px;">',
    '    <div class="picDiv" style="position: relative; width: 200px; height: 200px; opacity: 1; z-index: auto;">',
    '    <img imageid="${i.id}" src="${i.showImgUrl}" class="editImage"/>',
    '</div>',
    '</li>)',
    '</ul><div style="clear:both;"></div'].join("");

// 图片状态
illegalImage.imageStatus = {"1": "有效", "2": "无效"};
illegalImage.imageStatusMap = {"-1": "所有", "1": "有效", "2": "无效"};


/**
 违禁文本的命名空间，占位
 **/
var illegalText = {};
illegalText.textLimits = {"20": "20", "50": "50", "100": "100", "200": "200"};
illegalText.keywordHint = "支持1-3个关键词搜索, 关键词间使用空格分隔!";
illegalText.textCheckTypes = {"0": "正常" , "1" : "其他" , "2" : "色情" , "3" : "广告" , "4" : "政治敏感" , "5" : "欺诈" , "6" : "正常政治" , "7" : "违法犯罪" , "8" : "联系方式" , "9" : "暴恐" , "10" : "违禁" , "11" : "涉政" , "12" : "谩骂"};
illegalText.tags = {"normal" : "正常" , "other" : "其他" , "porno" : "色情" , "ad" : "广告" , "politics" : "政治敏感" , "cheat" : "欺诈" , "nomalPolitics" : "正常政治" , "criminal" : "违法犯罪" , "contactInfo" : "联系方式" , "violence" : "暴恐" , "prohibited" : "违禁" , "involvePolitics" : "涉政" , "rail" : "谩骂"};
// 文本标记状态
illegalText.markStatus = {"1": "未标记", "2": "已标记"};
illegalText.markStatusMap = {"-1": "所有", "1": "未标记", "2": "已标记"};
// 文本标记级别
illegalText.markLevel = {"1": "正常", "2": "嫌疑", "3": "严重", "4": "致命"};


$(document).ready(function () {
    var location = window.location;
    var uri = new RegExp("/modules/[a-z]+?/[a-zA-Z0-9_\/\-]+?\.html").exec(location);
    if (uri != null) {
        $(".mymenu a").removeClass("selected");
        $(".mymenu a[href=\"" + uri + "\"]").addClass("selected"); // 只给选中的加样式，其他的去除样式
    }

    $.reloadCurrPage = function (container) {
        var currPage = container.data("current_page");
        container.trigger("setPage", currPage);
    };

    // 必须是非常通用的函数才直接搞到$里面去
    $.showLoading = function () {
        $("div.loading").show();
    }

    $.hideLoading = function () {
        $("div.loading").hide();
    }

    // 根据用户权限获取对应的图片产品列表
    $.getImageProducts = function () {
        var products = {};
        jQuery.ajax({
            'type': 'GET',
            'url': "/modules/common/misc/image/get-image-products.json",
            'contentType': 'application/json',
            'dataType': 'json',
            async: false, // 同步等待
            'success': function (data) {
                products = data;
            }
        });
        return products;
    }

    // 获取图片所有产品列表
    $.getAllImageProducts = function () {
        var products = {};
        jQuery.ajax({
            'type': 'GET',
            'url': "/modules/common/misc/image/get-all-image-products.json",
            'contentType': 'application/json',
            'dataType': 'json',
            async: false, // 同步等待
            'success': function (data) {
                products = data;
            }
        });
        return products;
    }

    // 获取图片所有类别
    $.getImgClassType = function () {
        var classType = {};
        jQuery.ajax({
            'type': 'GET',
            'url': "/modules/common/misc/image/get-class-type.json",
            'contentType': 'application/json',
            'dataType': 'json',
            async: false, // 同步等待
            'success': function (data) {
                classType = data;
            }
        });
        return classType;
    }

    // 根据用户权限获取对应的文本产品列表
    $.getTextProducts = function () {
        var products = {};
        jQuery.ajax({
            'type': 'GET',
            'url': "/modules/common/misc/text/get-text-products.json",
            'contentType': 'application/json',
            'dataType': 'json',
            async: false, // 同步等待
            'success': function (data) {
                products = data;
            }
        });
        return products;
    }

    // 获取文本所有产品列表
    $.getAllTextProducts = function () {
        var products = {};
        jQuery.ajax({
            'type': 'GET',
            'url': "/modules/common/misc/text/get-all-text-products.json",
            'contentType': 'application/json',
            'dataType': 'json',
            async: false, // 同步等待
            'success': function (data) {
                products = data;
            }
        });
        return products;
    }

    // 获取所有媒体类型
    $.getMediaType = function () {
        var mediaType = {};
        jQuery.ajax({
            'type': 'GET',
            'url': "/modules/common/misc/get-media-type.json",
            'contentType': 'application/json',
            'dataType': 'json',
            async: false, // 同步等待
            'success': function (data) {
                mediaType = data;
            }
        });
        return mediaType;
    }

    // 获取所有数据来源类型
    $.getDataSourceType = function () {
        var dataSourceType = {};
        jQuery.ajax({
            'type': 'GET',
            'url': "/modules/common/misc/get-data-source-type.json",
            'contentType': 'application/json',
            'dataType': 'json',
            async: false, // 同步等待
            'success': function (data) {
                dataSourceType = data;
            }
        });
        return dataSourceType;
    }

    // 获取文本所有类别
    $.getTextClassType = function () {
        var classType = {};
        jQuery.ajax({
            'type': 'GET',
            'url': "/modules/common/misc/text/get-class-type.json",
            'contentType': 'application/json',
            'dataType': 'json',
            async: false, // 同步等待
            'success': function (data) {
                classType = data;
            }
        });
        return classType;
    }

    // 同步postJSON
    $.postJSONAsync = function (url, data, callback) {
        return jQuery.ajax({
            'type': 'POST',
            'url': url,
            'contentType': 'application/json',
            'data': JSON.stringify(data),
            async: false, // 同步等待
            'success': callback
        });
    }

    // 同步getJSON
    $.getJSONAsync = function (url, data) {
        var result = {};
        jQuery.ajax({
            'type': 'GET',
            'url': url,
            'contentType': 'application/json',
            'data': data,
            async: false, // 同步等待
            'success': function (ret) {
                result = ret;
            }
        });
        return result;
    }

});