/**
 * Created by gxk on 2014/9/23
 * 通用工具类.
 */
/**
 * 获取N天的日期
 */
exports.GetDateStr = function (AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    return y + "-" + m + "-" + d + " 00:00:00";
}
/**
 * 获取上周的周一和周末
 */
exports.getLastWeekDate = function () {
    var now = new Date();
    var week = new Array();
    var currentWeek = now.getDay();

    if (currentWeek == 0) {
        currentWeek = 7;
    }
    var monday = now.getTime() - (currentWeek + 6) * 24 * 60 * 60 * 1000; //星期一
    var tuesday = now.getTime() - (currentWeek + 5) * 24 * 60 * 60 * 1000; //星期二
    var wednesday = now.getTime() - (currentWeek + 4) * 24 * 60 * 60 * 1000; //星期三
    var thursday = now.getTime() - (currentWeek + 3) * 24 * 60 * 60 * 1000; //星期四
    var friday = now.getTime() - (currentWeek + 2) * 24 * 60 * 60 * 1000; //星期五
    var saturday = now.getTime() - (currentWeek + 1) * 24 * 60 * 60 * 1000; //星期六
    var sunday = now.getTime() - (currentWeek) * 24 * 60 * 60 * 1000;   //星期日
    var lastMonday = now.getTime() - (currentWeek - 1) * 24 * 60 * 60 * 1000;   //星期日
    week = weektoday(monday, tuesday, wednesday, thursday, friday, saturday, sunday, lastMonday);

    return week;

}
function weektoday(monday, tuesday, wednesday, thursday, friday, saturday, sunday, lastMonday) {
    var days = new Array();
    var monday1 = new Date(monday).toLocaleDateString();//星期一
    var tuesday1 = new Date(tuesday).toLocaleDateString(); //星期二
    var wednesday1 = new Date(wednesday).toLocaleDateString(); //星期三
    var thursday1 = new Date(thursday).toLocaleDateString(); //星期四
    var friday1 = new Date(friday).toLocaleDateString(); //星期五
    var saturday1 = new Date(saturday).toLocaleDateString();//星期六
    var sunday1 = new Date(sunday).toLocaleDateString();//星期日
    var lastMonday1 = new Date(lastMonday).toLocaleDateString();//下周一

    var new_monday = monday1 + " 00:00:00";
    var new_tuesday = tuesday1 + " 00:00:00";
    var new_wednesday = wednesday1 + " 00:00:00";
    var new_thursday = thursday1 + " 00:00:00";
    var new_friday = friday1 + " 00:00:00";
    var new_saturday = saturday1 + " 00:00:00";
    var new_sunday = sunday1 + " 00:00:00";
    var new_lastMonday = lastMonday1 + " 00:00:00";

    days[0] = new_monday;
    days[1] = new_tuesday;
    days[2] = new_wednesday;
    days[3] = new_thursday;
    days[4] = new_friday;
    days[5] = new_saturday;
    days[6] = new_sunday;
    days[7] = new_lastMonday;

    return days;
}

/**
 * 字符串转换为日期
 * @param str
 * @returns {Date}
 */
exports.fromStrToDate = function (str) {  //如:fromStrToDate("2014-12-12 18:00:00")
    var tempStrs = str.split(" ");
    var dateStrs = tempStrs[0].split("-");
    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10);   //

    if (tempStrs.length > 1) {
        var timeStrs = tempStrs[1].split(":");
        var hour = parseInt(timeStrs [0], 10);
        var minute = parseInt(timeStrs[1], 10) - 1;
        var second = parseInt(timeStrs[2], 10);
        var date = new Date(year, month, day, hour, minute, second);
        return date;
    } else {
        var date = new Date(year, month, day);
        return date;
    }
}

/**
 * 日期转换为字符串
 * @param date
 * @param fmt
 * @returns {*}
 */
exports.fromDateToStr = function (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


exports.createUUID = function () {
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = getIntegerBits(t, 0, 31);
    var tm = getIntegerBits(t, 32, 47);
    var thv = getIntegerBits(t, 48, 59) + '1';
    var csar = getIntegerBits(rand(4095), 0, 7);
    var csl = getIntegerBits(rand(4095), 0, 7);

    var n = getIntegerBits(rand(8191), 0, 7) +
        getIntegerBits(rand(8191), 8, 15) +
        getIntegerBits(rand(8191), 0, 7) +
        getIntegerBits(rand(8191), 8, 15) +
        getIntegerBits(rand(8191), 0, 15);
    return tl + tm + thv + csar + csl + n;
};

function getIntegerBits(val, start, end) {
    var base16 = returnBase(val, 16);
    var quadArray = new Array();
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1));
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] == '') quadString += '0';
        else quadString += quadArray[i];
    }
    return quadString;
};

function returnBase(number, base) {
    return (number).toString(base).toUpperCase();
};

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
};

/**
 * 查找数组或{}中是否存在val
 * @param arr
 * @param val
 * @returns {*}
 */
exports.indexOf = function (arr, val) {
    for (var i in arr) {
        var value = arr[i];
        if (value == val) {
            return i;
        }
    }
    return -1;
}

exports.encodeUtf8 = function (s1) {
    var s = escape(s1);
    var sa = s.split("%");
    var retV = "";
    if (sa[0] != "") {
        retV = sa[0];
    }
    for (var i = 1; i < sa.length; i++) {
        if (sa[i].substring(0, 1) == "u") {
            retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)));

        }
        else retV += "%" + sa[i];
    }
    return retV;
}
function Str2Hex(s) {
    var c = "";
    var n;
    var ss = "0123456789ABCDEF";
    var digS = "";
    for (var i = 0; i < s.length; i++) {
        c = s.charAt(i);
        n = ss.indexOf(c);
        digS += Dec2Dig(eval(n));

    }
    return digS;
}
function Dec2Dig(n1) {
    var s = "";
    var n2 = 0;
    for (var i = 0; i < 4; i++) {
        n2 = Math.pow(2, 3 - i);
        if (n1 >= n2) {
            s += '1';
            n1 = n1 - n2;
        }
        else
            s += '0';
    }
    return s;

}
function Dig2Dec(s) {
    var retV = 0;
    if (s.length == 4) {
        for (var i = 0; i < 4; i++) {
            retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
        }
        return retV;
    }
    return -1;
}
function Hex2Utf8(s) {
    var retS = "";
    var tempS = "";
    var ss = "";
    if (s.length == 16) {
        tempS = "1110" + s.substring(0, 4);
        tempS += "10" + s.substring(4, 10);
        tempS += "10" + s.substring(10, 16);
        var sss = "0123456789ABCDEF";
        for (var i = 0; i < 3; i++) {
            retS += "%";
            ss = tempS.substring(i * 8, (eval(i) + 1) * 8);
            retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
            retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
        }
        return retS;
    }
    return "";
}

exports.retrieveFromSerialNo = function (serialNo) {
    var index = serialNo.indexOf("0");
    index++;
    return parseInt(serialNo.substring(index));
}

exports.generateSerialNo = function (rid) {
    var currentStr = 0 + "" + rid + "";
    var len = 12;
    var currentLen = currentStr.length;
    var addStr = "";
    if (currentLen <= 12) {
        var leftLen = 12 - currentLen;
        //产生随机1到9的随机数
        for (var i = 0; i < leftLen; i++) {
            addStr = addStr + getRandomNum(1, 9);
        }
        return addStr + currentStr;
    }
}

function getRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

exports.getDataDay = function (data) {
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
        return (myyear + "-" + mymonth + "-" + myweekday);
    }
}