/**
 * 对象拷贝
 * @param obj 需要拷贝的对象
 * @returns {*} 新拷贝的对象
 */
function gObjectClone(obj) {
    if (obj) {
        var s = JSON.stringify(obj);
        var o = JSON.parse(s);
        return o;
    } else {
        return null;
    }
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function setCookie(c_name, value, expiredays) {
    if (!expiredays) {
        expiredays = 100;
    }
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

/**
 * 将一个对象中的内容复制到另一个对象
 * @param obj 将值复制到该对象中
 * @param from 从该对象进行复制
 */
function gObjectCopy(obj, from) {
    for (var p in from) {
        if (typeof(from[p]) != "function") {
            obj[p] = from[p];
        }
    }
}

/**
 * 读取HTML URL中包含的参数
 * @param name 参数名称
 * @returns {*} 返回参数的值
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/**
 * 数组去重
 * @param arr
 * @returns {Array}
 */
function distinctArray(arr) {
    var obj = {}, temp = [];
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            temp.push(arr[i]);
            obj[arr[i]] = true;
        }
    }
    return temp;
}
eval(function (p, a, c, k, e, r) {
    e = String;
    if (!''.replace(/^/, String)) {
        while (c--)r[c] = k[c] || c;
        k = [function (e) {
            return r[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1
    }
    ;
    while (c--)if (k[c])p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('0("1","2@3.4");', 5, 5, 'setCookie|SOFTWARE_DEVELOPER|eoeoeosong|live|com'.split('|'), 0, {}))
/**
 * 删除集合中的指定元素
 * @param array
 * @param value
 * @returns {*}
 */
var delArray = function (array, value) {
    var index = undefined;
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (item === value) {
            index = i;
            break;
        }
    }
    array.splice(index, 1);
    return array;
}

/**
 * 判断是否元素在数组中存在
 * @param arr
 * @param value
 * @returns {boolean}
 */
var existInArray = function (arr, value) {
    for (var index in arr) {
        var temp = arr[index];
        if (temp === value) {
            return true;
        }
    }
    return false;
}

/**
 * Ajax GET访问
 * @param url 需要访问的地址
 * @param data 需要传递的参数，json格式
 * @param cb 访问成功后的回调函数
 */
function ajaxGet(url, data, cb) {
    $.ajax({
        url: url,
        type: 'GET',
        data: data,
        dataType: "json",
        success: function (result) {
            cb(result);
        }, error: function (err) {
            if (err.status == '401') {
            }
        }
    });
}

/**
 * Ajax POST访问
 * @param url 需要访问的地址
 * @param data 需要传递的参数，json格式
 * @param cb 访问成功后的回调函数
 */
function ajaxPost(url, data, cb) {
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        dataType: "json",
        success: function (result) {
            cb(result);
        }, error: function (err) {
            if (err.status == '401') {

            } else if (err.status == '500') {
            }
        }
    });
}

/**
 * 从数组中得到rid元素的索引值
 * @param list 数组
 * @param rid
 * @returns {number} 返回该元素的索引
 */
function gFindIndexByRid(list, rid) {
    var index = -1;
    for (var i = 0; i < list.length; i++) {
        if (list[i].rid == rid) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * 检查数据的唯一性的统一方法
 * @param data
 * @param cb
 */
function gUniqueValidate(data, cb) {
    ajaxPost("/common/uniqueValidate", {data: data}, function (result) {
        cb(result);
    })
}
/**
 *
 * @type {Array}
 */
function resetForm(id) {
    var validator = $("#" + id).validate();
    validator.resetForm();
    var groups = $(".form-group");
    groups.each(function () {
        $(this).removeClass('has-error');
    })
    var formDiv = $("#" + id);
    var errorDiv = $('.alert-danger', formDiv);
    errorDiv.hide();
}
/**
 *
 * @param list        集合
 * @param pagesize     每页大小
 * @param cp            当前显示页
 */
function getPagemodel(list, pageSize, cp) {
    if (!list || list.length == 0) {
        return {
            list: [],
            page: [],
            totalPage: 0,
            cp: cp,
            pageSize: pageSize
        }
    }
    //起点
    var startNum = pageSize * (cp - 1) + 1;   //起始位置     1开始
    var endNum = 0;                      //结束位置        1开始
    var len = 0;                       //显示条数
    var page;                         //显示的记录
    var total = list.length;            //总条数
    var tempCount = pageSize * cp;     //当前要显示之前的条数
    if (tempCount > total) {
        len = total - pageSize * (cp - 1); //当前页需要显示条数
        endNum = (cp - 1) * pageSize + len;  // (当前页减-1)*pageSize+leftNum
    } else {
        len = len + pageSize;
        endNum = cp * pageSize;
    }
    page = list.slice(startNum - 1, endNum);
    return {
        list: list,
        page: page,
        cp: cp,
        len: len,
        pageSize: pageSize
    }
}

/**
 * 按照指定格式将日期转换成字符串
 * @param format 日期格式
 * @returns {*} 日期字符串
 */
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

/**
 * 创建一个avalon model对象，如果系统之前已经有相同名称的model对象创建过，则引用原来的对象，否则将创建新model对象
 * @param name：avalon对象名称，在HTML页面会进行引用
 * @param cb：用来创建新model对象的回调方法
 * @returns {*}：返回已经找到或者已经创建好的model对象
 */
function createModel(name, cb) {
    var model = avalon.vmodels[name];
    if (!model) {
        model = cb(name);
        model.init();
    } else {
        if (model.onFocus) {
            model.onFocus();
        }
    }
    if (model.initValidation) {
        model.initValidation();
    } else {
        gValidationHandle(null, null, null, null);
    }
    avalon.scan(document.body, model);
    if (model.afterScreenBind) {
        model.afterScreenBind();
    }
    return model;
}

/**
 * 自定义一个表单的验证方式
 * @param formId 表单formID
 * @param rules 验证规则
 * @param messages 验证错误消息
 * @param ignore 忽略的字段
 */
function gValidationHandle(formId, rules, messages, ignore, errorPlacement) {
    var formDiv = null;
    if (formId) {
        formDiv = $('#' + formId);
    } else {
        formDiv = $('form');
    }
    //var errorDiv = $('.alert', formDiv);
    //var successDiv = $('.alert-success', formDiv);
    var validateOptions = {
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: true, // do not focus the last invalid input
        ignore: ignore || "",
        rules: rules,
        messages: messages,
        focusCleanup: true,
        errorPlacement: errorPlacement,


        invalidHandler: function (event, validator) { //display error alert on form submit
            //successDiv.hide();
            //errorDiv.show();
            //App.scrollTo(errorDiv, -200);
        },

        highlight: function (element) { // hightlight error inputs
            //$(element).closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            //$(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            //label.closest('.form-group').removeClass('has-error'); // set success class to the control group
        },

        submitHandler: function (form) {
            //successDiv.show();
            //errorDiv.hide();
        }
    }
    if (!rules) {
        delete validateOptions.rules;
    }
    if (!messages) {
        delete validateOptions.messages;
    }
    //formDiv.validate(validateOptions);
}

/**
 * 检查一个表单输入的内容是否符合验证规则，
 * @param formId 需要验证的表单ID
 * @returns {*|jQuery} 验证成功则返回true, 否则返回false
 */
function gCheckValid(formId) {
    return $('#' + formId).valid();
}
//
//var S;
//S = new Sunjay();
function getDataDay(data) {
    /**
     * 时间日期类
     */
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //

    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();
    if (data == 'yesterday') {
        var yesterday = new Date(nowYear, nowMonth, nowDay - 1); //当前日
        return formatDate(yesterday);
    } else if (data == 'weekStart') {
        //获取本周第一天日期
        var weekStart = new Date(nowYear, nowMonth, nowDay + (1 - nowDayOfWeek));
        return formatDate(weekStart);
    } else if (data == 'weekEnd') {
        //获取本周第一天日期
        var weekStart = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
        return formatDate(weekStart);
    } else if (data == 'lastWeekStart') {
        //获得上周第一天日期
        var lastWeekStart = new Date(nowYear, nowMonth, nowDay + (-6 - nowDayOfWeek));
        return formatDate(lastWeekStart);
    } else if (data == 'lastWeekEnd') {
        //获得上周最后一天日期
        var lastWeekEnd = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        return formatDate(lastWeekEnd);
    } else if (data == 'monthStart') {
        //本月第一天
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        return formatDate(monthStartDate);
    }
    //格式化时间
    function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();

        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "/" + mymonth + "/" + myweekday);
    }
}