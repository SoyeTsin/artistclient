/**
 * Created by Linyi on 2015/8/17 0017.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var http = require('http');
var url = require('url');
var util = require('util');
var commUtil = require('../util/commUtil');
var session = require('express-session');
var KeyerDao = require('../model/keyerDao');
var keyerDao = new KeyerDao();
var fs = require("fs");
var DTSHOURU = [];
var ZTSHOURU = [];
var ZUIDUO = [];
var GONGXIAN = [];
var SHOURU = [];
var ZHOUGONGXIAN = [];
(function () {
    var setInter = setInterval(function () {
        DTSHOURU = [];
        ZTSHOURU = [];
        ZUIDUO = [];
        GONGXIAN = [];
        SHOURU = [];
        ZHOUGONGXIAN = [];
    }, 4 * 60 * 1000)
})()

http.createServer(function (req, res) {
//推荐主播
    var coreRecommend = [];
    keyerDao.getCoreRecommend(function (err, rows) {
        if (err) {
            log.error(err);
        } else {
            coreRecommend = rows || [{msg: '没有数据！'}];
            if (rows.length == 0) {
                coreRecommend[0] = {err: '没有数据！'};
            }
            for (var i in coreRecommend) {
                coreRecommend[i].charm = 0;
            }
        }
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        res.end(JSON.stringify(coreRecommend));
    });
}).listen(3030);

http.createServer(function (req, res) {
//艺人今天，或者某一天的总收入；
//src 1是朋友圈的，2是手机房间，3是手机聊天

//http://localhost:3031/?type=0&uuid=147000011&startDate=2015-08-6&endDate=2015-09-11
//type=0 ----------今天，或者某一天的总收入
//type=1 ----------来源是手机的，艺人今天，或者某一天的总收入
//type=2 ----------某个用户对某个主播，这一周消费最大的
//uuid
//startDate 开始查询的时间 格式： 年-月-日
//endDate 结束查询的时间 格式： 年-月-日
//日期不要带有时分秒等其他信息


    var arg = url.parse(req.url, true).query;  //方法二arg => { aa: '001', bb: '002' }
//然后就可以根据所得到的数据处理了
    if (arg.type == 0 || arg.type == '0') {
        var data = {
            uuid: arg.uuid,
            startDate: arg.startDate,
            endDate: arg.endDate,
            income: 0,
            err: null,
            length: DTSHOURU.length
        }
        var data_state = 0;
        for (var i in DTSHOURU) {
            if (DTSHOURU[i].uuid == data.uuid) {
                data = DTSHOURU[i];
                data_state = 1;
            }
        }
        if (data_state == 0) {
            keyerDao.dangTianShouRu(data, function (err, rows) {
                if (err) {
                    log.error(err);
                    data.err = err;
                } else {
                    for (var i = 0; i < rows.length; i++) {
                        data.income = data.income + rows[i].income;
                    }
                    if (rows.length == 0) {
                        data.err = '没有数据！';
                    }
                }
                DTSHOURU.push(data);
                if (DTSHOURU.length > 1000) {
                    DTSHOURU.shift();
                }
                data.length = DTSHOURU.length;
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end(JSON.stringify(data));
            });
        } else {
            data.length = DTSHOURU.length;
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        }

    } else if (arg.type == 1 || arg.type == '1') {
        var data = {
            uuid: arg.uuid,
            startDate: arg.startDate,
            endDate: arg.endDate,
            income: 0,
            err: null,
            length: 0
        }
        var data_state = 0;
        for (var i in ZTSHOURU) {
            if (ZTSHOURU[i].uuid == data.uuid) {
                data = ZTSHOURU[i];
                data_state = 1;
            }
        }
        if (data_state == 0) {
            keyerDao.shouJiDangTianShouRu(data, function (err, rows) {
                if (err) {
                    log.error(err);
                    data.err = err;
                } else {
                    for (var i = 0; i < rows.length; i++) {
                        data.income = data.income + rows[i].income;
                    }
                    if (rows.length == 0) {
                        data.err = '没有数据！';
                    }
                }
                ZTSHOURU.push(data);
                if (ZTSHOURU.length > 1000) {
                    ZTSHOURU.shift();
                }
                data.length = ZTSHOURU.length;
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end(JSON.stringify(data));
            });
        } else {
            data.length = ZTSHOURU.length;
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        }
    } else if (arg.type == 2 || arg.type == '2') {
//http://localhost:3031/?type=2&uuid=197000012&startDate=2015-08-6&endDate=2015-09-11
//某个用户对某个主播，这一周消费最大的
        var data = {
            uuid: arg.uuid,
            to_uuid: 0,
            startDate: arg.startDate,
            endDate: arg.endDate,
            income: 0,
            err: null,
            length: 0
        }
        var data_state = 0;
        for (var i in ZUIDUO) {
            if (ZUIDUO[i].uuid == data.uuid && ZUIDUO[i].to_uuid == data.to_uuid) {
                data = ZUIDUO[i];
                data_state = 1;
            }
        }
        if (data_state == 0) {
            keyerDao.ZuiDuo(data, function (err, rows) {
                if (err) {
                    log.error(err);
                    data.err = err;
                } else {
                    var sum = [];
                    for (var i = 0; i < rows.length; i++) {
                        for (var j = 0; j < rows.length; j++) {
                            if (rows[i].income < rows[j].income) {
                                sum = rows[j]
                            }
                        }
                    }
                    if (rows.length == 0) {
                        data.err = '没有数据！';
                    } else {
                        data.to_uuid = sum.to_uuid;
                        data.income = sum.income;
                        data.nick = sum.nick;
                    }
                }
                ZUIDUO.push(data);
                if (ZUIDUO.length > 1000) {
                    ZUIDUO.shift();
                }
                data.length = ZUIDUO.length;
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end(JSON.stringify(data));
            });
        } else {
            data.length = ZUIDUO.length;
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        }
    } else if (arg.type == 3 || arg.type == '3') {
//http://112.74.196.243:3031/?type=3&uuid=147000011&startDate=2015-08-6&endDate=2015-09-11
//某个用户对某个主播，这一周消费最大的
        var data = {
            res: 0,
            uuid: arg.uuid,
            to_uuid: 0,
            startDate: arg.startDate,
            endDate: arg.endDate,
            incomeList: [],
            err: null,
            length: 0
        }
        var data_state = 0;
        for (var i in GONGXIAN) {
            if (GONGXIAN[i].uuid == data.uuid) {
                data = GONGXIAN[i];
                data_state = 1;
            }
        }
        if (data_state == 0) {
            keyerDao.gongXianGift(data, function (err, rows) {
                if (err) {
                    log.error(err);
                    data.err = err;
                    data.res = 1;
                    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                    res.end(JSON.stringify(data));
                } else {
                    if (rows.length == 0) {
                        data.err = '没有数据！';
                        data.res = 1;
                        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                        res.end(JSON.stringify(data));
                    } else {
                        keyerDao.gongXianGuard(data, function (err0, rows0) {
                            if (err0) {
                                log.error(err0);
                                data.err = err0;
                                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                                res.end(JSON.stringify(data));
                            } else {
                                if (rows0.length == 0 && rows.length == 0) {
                                    data.err = '没有数据！';
                                } else {
                                    for (var i = 0; i < rows.length; i++) {
                                        for (var j = 0; j < rows0.length; j++) {
                                            if (rows[i].uuid == rows0[j].uuid) {
                                                rows[i].income = rows[i].income + rows0[j].income;
                                                rows0[j].uuid = 0;
                                            }
                                        }
                                        data.incomeList.push(rows[i]);
                                    }
                                    for (var i = 0; i < rows0.length; i++) {
                                        if (rows0[i].uuid != 0) {
                                            data.incomeList.push(rows0[i]);
                                        }
                                    }
                                    var uuList = rows;
                                    for (var i = 0; i < rows.length; i++) {
                                        var uu = [];
                                        for (var j = 0; j < rows.length; j++) {
                                            if (rows[i].income > rows[j].income) {
                                                uu = uuList[i];
                                                uuList[i] = uuList[j];
                                                rows[j] = uu;
                                            }
                                        }
                                    }
                                    var uuuList = [];
                                    if (uuList.length > 10) {
                                        for (var i = 0; i < uuList.length; i++) {
                                            uuuList.push(uuList[i]);
                                        }
                                    } else {
                                        uuuList = uuList;
                                    }
                                    data.incomeList = uuuList;
                                }
                                GONGXIAN.push(data);
                                if (GONGXIAN.length > 1000) {
                                    GONGXIAN.shift();
                                }
                                data.length = GONGXIAN.length;
                                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                                res.end(JSON.stringify(data));
                            }
                        });

                    }
                }
            });
        } else {
            data.length = GONGXIAN.length;
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        }
    } else if (arg.type == 4 || arg.type == '4') {
//http://localhost:3031/?type=4&channelId=101
        var data = {
            channelId: arg.channelId,
            channelAuthority: {},
            err: null
        }
        keyerDao.getChannelauthority(data.channelId, function (err, rows) {
            if (err) {
                log.error(err);
                data.err = err;
            } else {
                data.channelAuthority = rows[0] || {};
            }
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        });
    } else if (arg.type == 5 || arg.type == '5') {
        /**
         * 今天往前7天一个主播的每天的收入
         * @type {{uuid: *, weekIncome: Array, err: null}}
         */
//http://192.168.1.53:3031/?type=5&uuid=199000004
        var data = {
            uuid: arg.uuid,
            weekIncome: [],
            err: null,
            length: 0
        }
        var data_state = 0;
        for (var i in SHOURU) {
            if (SHOURU[i].uuid == data.uuid) {
                data = SHOURU[i];
                data_state = 1;
            }
        }
        if (data_state == 0) {
//console.log(weekTime)
            var newDate = new Date();
            var endDate = (commUtil.fromDateToStr(newDate, "yyyy-MM-dd"));
            newDate.setDate(newDate.getDate() - 7);
            var startDate = (commUtil.fromDateToStr(newDate, "yyyy-MM-dd"));
            keyerDao.getWeekIncome(data.uuid, startDate, endDate, function (err, rows) {
                if (err) {
                    log.error(err);
                    data.err = err;
                    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                    res.end(JSON.stringify(data));
                } else {
                    if (rows.length == 0) {
                        data.err = '没有数据！';
                        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                        res.end(JSON.stringify(data));
                    } else {
                        var dataList = [];
                        for (var i = 0; i < 7; i++) {
                            dataList.push({time: commUtil.fromDateToStr(newDate, "yyyy-MM-dd"), income: 0});
                            newDate.setDate(newDate.getDate() + 1);
                        }
                        for (var i in dataList) {
                            for (var j = 0; j < rows.length; j++) {
                                if (dataList[i].time == rows[j].time) {
                                    dataList[i].income = dataList[i].income + rows[j].income;
                                }
                            }
                        }
                        data.weekIncome = dataList;
                        keyerDao.getPhoneWeekIncome(data.uuid, startDate, endDate, function (err, rows1) {
                            if (err) {
                                log.error(err);
                                data.err = err;
                                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                                res.end(JSON.stringify(data));
                            } else {
                                if (rows1.length == 0) {
                                    data.err = '没有数据！';
                                    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                                    res.end(JSON.stringify(data));
                                } else {
                                    var dataList = [];
                                    newDate.setDate(newDate.getDate() - 7);
                                    for (var i = 0; i < 7; i++) {
                                        dataList.push({time: commUtil.fromDateToStr(newDate, "yyyy-MM-dd"), income: 0});
                                        newDate.setDate(newDate.getDate() + 1);
                                    }
                                    for (var i in dataList) {
                                        for (var j = 0; j < rows1.length; j++) {
                                            if (dataList[i].time == rows1[j].time) {
                                                dataList[i].income = dataList[i].income + rows1[j].income;
                                            }
                                        }
                                    }
                                    data.phoneIncome = dataList;
                                    SHOURU.push(data);
                                    if (SHOURU.length > 1000) {
                                        SHOURU.shift();
                                    }
                                    data.length = SHOURU.length;
                                    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                                    res.end(JSON.stringify(data));
                                }
                            }
                        });
                    }

                }
            });
        } else {
            data.length = SHOURU.length;
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        }
    } else if (arg.type == 6 || arg.type == '6') {
        /**
         * 一个主播往前7天对他贡献最大的用户
         * @type {{uuid: *, weekIncome: Array, err: null}}
         */
//http://192.168.1.53:3031/?type=6&uuid=199000004
        var data = {
            uuid: arg.uuid,
            err: null
        }
        var data_state = 0;
        for (var i in ZHOUGONGXIAN) {
            if (ZHOUGONGXIAN[i].uuid == data.uuid) {
                data = ZHOUGONGXIAN[i];
                data_state = 1;
            }
        }
        if (data_state == 0) {
//console.log(weekTime)
            var newDate = new Date();
            var endDate = (commUtil.fromDateToStr(newDate, "yyyy-MM-dd"));
            newDate.setDate(newDate.getDate() - 70);
            var startDate = (commUtil.fromDateToStr(newDate, "yyyy-MM-dd"));
            keyerDao.getPhoneWeekIncomes(data.uuid, startDate, endDate, function (err, rows) {
                if (err) {
                    log.error(err);
                    data.err = err;
                } else {
                    if (rows.length == 0) {
                        data.err = '没有数据！';
                    } else {
                        var list = rows || [];
                        for (var i in list) {
                            for (var j = 0; j < list.length; j++) {
                                if (list[i].uuid == list[j].uuid && i != j) {
                                    list[i].income = list[i].income + list[j].income;
                                    list[j].income = 0;
                                }
                            }
                        }
                        var list_0 = [];
                        for (var j = 0; j < list.length; j++) {
                            if (0 != list[j].income) {
                                list_0.push(list[j]);
                            }
                        }
                        var list_1 = list_0;
                        var list_2 = list_0;
                        for (var i in list_1) {
                            var ooo = {};
                            for (var j in list_2) {
                                if (list_0[i].income > list_0[j].income) {
                                    ooo = list_1[i];
                                    list_1[i] = list_2[j];
                                    list_2[j] = ooo;
                                }
                            }
                        }
                        data.data = list_0[0];
                    }
                }
                ZHOUGONGXIAN.push(data);
                if (ZHOUGONGXIAN.length > 1000) {
                    ZHOUGONGXIAN.shift();
                }
                data.length = ZHOUGONGXIAN.length;
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end(JSON.stringify(data));
            });
        } else {
            data.length = ZHOUGONGXIAN.length;
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        }
    } else if (arg.type == 7 || arg.type == '7') {
//安装统计接口
        var data = {
            res: 0
        }
        var time = new Date()
        var insdata = {
            time: time,
            uid: arg.uid,
            silent: arg.silent,
            cid: arg.cid,
            ver: arg.ver
        }
        if (arg.silent) {
            keyerDao.setInstall(insdata, function (err, rows) {
                if (err) {
                    log.error(err);
                    data.res = '1';
                } else {
                    if (rows.affectedRows == 1) {
                        data.res = '0';
                    } else {
                        data.res = '1';
                    }
                }
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end(JSON.stringify(data));
            });
        } else {
            data.res = 1;
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        }
    } else if (arg.type == 8 || arg.type == '8') {
//卸载统计接口
        var data = {
            res: 0
        }
        var time = new Date()
        var undata = {
            time: time,
            uid: arg.uid,
            silent: arg.silent,
            cid: arg.cid,
            ver: arg.ver
        }
        if (arg.silent) {
            keyerDao.setUninstall(undata, function (err, rows) {
                if (err) {
                    log.error(err);
                    data.res = '1';
                } else {
                    if (rows.affectedRows == 1) {
                        data.res = '0';
                    } else {
                        data.res = '1';
                    }
                }
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end(JSON.stringify(data));
            });
        } else {
            data.res = 1;
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        }
    } else if (arg.type == 9 || arg.type == '9') {
//广告位接口
        var data = {
            res: 0,
            data: []
        }
        keyerDao.getAdList(function (err, rows) {
            if (err) {
                log.error(err);
                data.res = '1';
            } else {
                data.data = rows || [];
            }
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        });
    } else if (arg.type == 10 || arg.type == '10') {
//手机端web埋点统计
        var data = {
            res: 0,
        }
        var time = new Date()
        var insWebData = {
            time: time,
            from: arg.from
        }
        if (arg.from) {
            keyerDao.insWebData(insWebData, function (err, rows) {
                if (err) {
                    log.error(err);
                    data.res = '1';
                } else {
                    data.data = rows || [];
                }
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end(JSON.stringify(data));
            });
        } else {
            data.res = 1;
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        }

    } else if (arg.type == 11 || arg.type == '11') {
//ios广告位接口
//remarks?web:live
        var data = {
            res: 0,
            data: []
        }
        keyerDao.getAdList(function (err, rows) {
            if (err) {
                log.error(err);
                data.res = '1';
            } else {
                var list = [];
                for (var i in rows) {
                    if (rows[i].type == 'ios' && ( rows[i].remarks == 'web' || rows[i].remarks == 'live')) {
                        list.push(rows[i])
                    }
                }
                data.data = list || [];
            }
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        });
    } else if (arg.type == 12 || arg.type == '12') {
//ios广告位接口
//remarks?web:live
        var data = {
            res: 0,
            data: []
        }
        keyerDao.getAdList(function (err, rows) {
            if (err) {
                log.error(err);
                data.res = '1';
            } else {
                var list = [];
                for (var i in rows) {
                    if (rows[i].type == 'android') {
                        list.push(rows[i])
                    }
                }
                data.data = list || [];
                var lists = [];
                for (var i in rows) {
                    if (rows[i].type == 'androids') {
                        lists.push(rows[i])
                    }
                }
                data.datas = lists || [];
            }
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        });
    } else if (arg.type == 13 || arg.type == '13') {
//ios举报接口
//type=13&uuid=&to_uuid=&content=;
        if (arg.to_uuid && arg.uuid) {
            var newTime = new Date();
            var data = {
                title: '举报',
                content: arg.to_uuid + '[' + arg.content + ']',
                uuid: arg.uuid,
                reply: 0,
                cre_time: newTime
            }
            keyerDao.insFeedBack(data, function (err, rows) {
                if (err) {
                    log.error(err);
                    data.res = '1';
                } else {
                    data.res = 0;
                }
                res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                res.end(JSON.stringify(data));
            });
        } else {
            var data = {
                res: 500
            }
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        }

    } else if (arg.type == 14 || arg.type == '14') {
//飞吻和爱心榜
//keyerDao.feiwenheaixin(data, function (err, rows) {
//    if (err) {
//        log.error(err);
//        data.res = '1';
//    } else {
//        data.res = 0;
//    }
//    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
//    res.end(JSON.stringify(data));
//});
        var time = new Date();
        var data = {time: commUtil.fromDateToStr(time, "yyyy-MM-dd")}
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        res.end('call_date("' + data.time + '");');
    } else if (arg.type == 15 || arg.type == '15') {
//新版广告
        var data = {};
        keyerDao.get_new_ad(function (err, rows) {
            if (err) {
                log.error(err);
                data.res = '1';
            } else {
                data.res = 0;
                var ad_list = [];
                var newTime = new Date();
                for (var h in rows) {
                    if (commUtil.fromStrToDate(rows[h].start_time) < newTime && commUtil.fromStrToDate(rows[h].end_time) > newTime) {
                        ad_list.push(rows[h]);
                    }
                }
                data.ad_num = ad_list.length;
                data.data = ad_list;
            }
            res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
            res.end(JSON.stringify(data));
        });
    }

}).listen(3031);//建立服务器并监听端口

http.createServer(function (req, res) {
    var coreRecommend = [];
    keyerDao.getAd(function (err, rows) {
        if (err) {
            log.error(err);
        } else {
            coreRecommend.push({msg: 0});
            for (var i in rows) {
                coreRecommend.push(rows[i]);
            }
            if (rows.length == 0) {
                coreRecommend[0].msg = 1;
            }
        }
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        res.end(JSON.stringify(coreRecommend));
    });
}).listen(3032);
/**
 *
 *  Javascript crc32
 *  http://www.webtoolkit.info/
 *
 **/
function crc32(str) {
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    str = Utf8Encode(str);
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
    if (typeof(crc) == "undefined") {
        crc = 0;
    }
    var x = 0;
    var y = 0;
    crc = crc ^ (-1);
    for (var i = 0, iTop = str.length; i < iTop; i++) {
        y = ( crc ^ str.charCodeAt(i) ) & 0xFF;
        x = "0x" + table.substr(y * 9, 8);
        crc = ( crc >>> 8 ) ^ x;
    }
    return crc ^ (-1);
};
console.log('CRC32:123456>>' + crc32('123456'));
//console.log('CRC32:Hello world!>>' + crc32('Hello world!'));

/**
 * 图片保存到本地
 */
var imgbase64 = 'R0lGODlhDwAPAKECAAAAzMzM/////wAAACwAAAAADwAPAAACIISPeQHsrZ5ModrLlN48CXF8m2iQ3YmmKqVlRtW4MLwWACH+H09wdGltaXplZCBieSBVbGVhZCBTbWFydFNhdmVyIQAAOw==';
var imgbuff = new Buffer(imgbase64, "base64");
//var imageBuf = fs.readFileSync("C:\\Users\\Linyi\\Pictures\\下载.png");
//console.log(imageBuf.toString("base64"));
//console.log(imgbuff.toString("base64"));

var imgData = fs.writeFileSync('000.png', imgbuff);
fs.writeFile('./www/up/', imgData, 'binary', function (err) {

});


/***
 * 周期执行获取数据
 */

function nextIntegralPointAfterLogin() {
    IntegralPointExecute();//
    setInterval(function () {
        IntegralPointExecute();
    }, 60 * 60 * 1000);//
}
function IntegralPointExecute() {
    var newDate = new Date();
//console.log('Keyer execution!');
//var newDay = commUtil.fromStrToDate(commUtil.fromDateToStr(newDate, "yyyy-MM-dd  hh:mm:ss"));
    var newDay = commUtil.fromDateToStr(newDate, "yyyy-MM-dd");
    keyerDao.sel_t_yl_artist_play_time(newDay, function (err, rows) {
        if (err) {
            log.error(err);
        } else {
            console.log("------------------------------------------------------------------------");
            console.log('艺人直播情况记录读取成功,共' + rows.length + "条记录（" + new Date().toLocaleString() + "）");
            keyerDao.sel_st_artisttrack(newDay, function (err, rows0) {
                if (err) {
                    log.error(err);
                } else {
                    console.log('备份读取成功,共' + rows0.length + "条记录（" + new Date().toLocaleString() + "）");
                    var rowsData = rows;
                    for (var i = 0; i < rows.length; i++) {
                        for (var j = 0; j < rows0.length; j++) {
                            if (rows[i].uuid == rows0[j].uuid) {
                                if (rows[i].channelId == rows0[j].channelId) {
                                    if (rows[i].startDate.toLocaleString() == rows0[j].startDate.toLocaleString()) {
                                        rowsData[i].uuid = 0;
                                    }
                                }
                            }
                        }
                    }
                    var data = [];
                    for (var i = 0; i < rowsData.length; i++) {
                        if (rowsData[i].uuid != 0) {
                            data.push(rows[i]);
                        }
                    }
                    console.log('数据对比完成,共' + data.length + "条有效记录（" + new Date().toLocaleString() + "）");
                    keyerDao.upData_st_artisttrack(data, function (errs, rows) {
                        if (errs.length > 0) {
                            for (var i = 0; i < errs.length; i++) {
                                log.error(errs[i]);
                            }
                        } else {
                            console.log('拷贝有效数据完成,共' + rows.length + "条记录（" + new Date().toLocaleString() + "）");
                        }
                    });
                }
            });
        }
    });

}

function nextIntegralUpData_st_active() {
    upData_st_active();//
    setInterval(function () {
        var newDate = new Date();
//var sdate = commUtil.fromStrToDate('');
        upData_st_active();
    }, 3 * 60 * 1000);//
}
function upData_st_active() {
    keyerDao.sel_cr_max_online_hour(function (err, rows) {
        if (err) {
            log.error(errs);
        } else {
            var obj = {};
            if (rows.length > 0) {
                var newData = new Date();
                var time = commUtil.fromDateToStr(newData, "yyyy-MM-dd");
                obj = {
                    type: 0,
                    creDate: time,
                    hour_0: rows[0].num,
                    hour_1: rows[1].num,
                    hour_2: rows[2].num,
                    hour_3: rows[3].num,
                    hour_4: rows[4].num,
                    hour_5: rows[5].num,
                    hour_6: rows[6].num,
                    hour_7: rows[7].num,
                    hour_8: rows[8].num,
                    hour_9: rows[9].num,
                    hour_10: rows[10].num,
                    hour_11: rows[11].num,
                    hour_12: rows[12].num,
                    hour_13: rows[13].num,
                    hour_14: rows[14].num,
                    hour_15: rows[15].num,
                    hour_16: rows[16].num,
                    hour_17: rows[17].num,
                    hour_18: rows[18].num,
                    hour_19: rows[19].num,
                    hour_20: rows[20].num,
                    hour_21: rows[21].num,
                    hour_22: rows[22].num,
                    hour_23: rows[23].num,
                };
            }
            keyerDao.ins_st_active(obj, function (err, rows) {
                if (err) {
                    log.error(errs);
                } else {
                    if (rows.affectedRows == 0) {
                        keyerDao.upData_st_active(obj, function (err, rows) {
                            if (err) {
                                log.error(errs);
                            } else {
                            }
                        });
                    }
                }
            });
        }
    });
}

function nextIntegralUpData_st_roomActive() {
//upData_st_roomActive();
    var oo = 0;
    setInterval(function () {
        var newDate = new Date();
        var time = commUtil.fromDateToStr(newDate, "yyyy-MM-dd hh");
        var t = commUtil.fromStrToDate(time + ":59:00");
        if (newDate > t) {
            if (oo == 0) {
                upData_st_roomActive();
                setBalance_snap();
                oo = 1;
            }
        } else {
            oo = 0;
        }
    }, 5 * 1000);//
}
function upData_st_roomActive() {
    keyerDao.sel_cr_sociaty_room_maxnum(function (err, rows) {
        if (err) {
            log.error(errs);
        } else {
            var obj = [];
            var newDate = new Date();
            var time = commUtil.fromDateToStr(newDate, "yyyy-MM-dd hh") + ':00:00';
            obj = rows;
            keyerDao.ins_st_roomactive(obj, time, function (errs, rows) {
                if (err) {
                    log.error(errs);
                } else {
                }
            });
        }
    });
}
function setBalance_snap() {
    keyerDao.getYuE(function (err, rows) {
        if (err) {
            log.error(errs);
        } else {
            var yue = 0;
            for (var i in rows) {
                yue += rows[i].yue;
            }
            var newDate = new Date();
            var time = commUtil.fromDateToStr(newDate, "yyyy-MM-dd hh") + ':00:00';
            keyerDao.ins_yuE(yue, time, function (errs, rows) {
                if (err) {
                    log.error(errs);
                } else {
                }
            });
        }
    });
}
//nextIntegralUpData_st_active();
//nextIntegralPointAfterLogin();
nextIntegralUpData_st_roomActive();
setBalance_snap();
module.exports = router;

