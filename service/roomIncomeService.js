/**
 * Created by Linyi on 2015/8/18 0018.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');
var RoomIncomeDao = require('../model/roomIncomeDao');
var roomIncomeDao = new RoomIncomeDao();

router.post('/getSociatyIncome_gift', function (req, res) {
    var rmap = {code: 0};
    var cycleDate = req.param("date");
    newDate = new Date();
    if (cycleDate.startDate == '' || cycleDate.endDate == '') {
        cycleDate.endDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
        newDate.setDate(newDate.getDate() - 7);
        cycleDate.startDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
    }
    roomIncomeDao.getSociatyIncome_gift(cycleDate.sociatyId, cycleDate.startDate, cycleDate.endDate, function (err, row) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            rmap.income = row[0].income || '';
            res.send(rmap);
        }
    });
});


router.post('/getSociatyIncomeList', function (req, res) {
    var rmap = {code: 0};
    var cycleDate = req.param("date");
    var newDate = new Date();
    if (cycleDate.startDate == '' || cycleDate.endDate == '') {
        cycleDate.endDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
        newDate.setDate(newDate.getDate() - 7);
        cycleDate.startDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
    }
    roomIncomeDao.getSociatyIncomeGift(cycleDate.sociatyList, cycleDate.startDate, cycleDate.endDate, function (err, row) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            rmap.income = row[0].income;
            roomIncomeDao.getSociatyIncomeGuard(cycleDate.sociatyList, cycleDate.startDate, cycleDate.endDate, function (errs, rows) {
                if (errs) {
                    log.error(errs);
                    rmap.code = 1;
                    res.send(rmap);
                } else {
                    rmap.income += rows[0].income;
                    res.send(rmap);
                }
            });
        }
    });
});

router.post('/getSociatyIncome_cycle', function (req, res) {
    var rmap = {code: 0};
    var cycleDate = req.param("date");
    var newDate = new Date();
    if (cycleDate.startDate == '' || cycleDate.endDate == '') {
        cycleDate.endDate = (commUtil.fromDateToStr(newDate, "yyyy/MM"));
        cycleDate.startDate = (commUtil.fromDateToStr(newDate, "yyyy/MM"));
    }
    roomIncomeDao.getSociatyIncome_cycle_gift(cycleDate.sociatyList, cycleDate.startDate, cycleDate.endDate, function (err, row) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            rmap.income = row[0].income;
            roomIncomeDao.getSociatyIncome_cycle_guard(cycleDate.sociatyList, cycleDate.startDate, cycleDate.endDate, function (errs, rows) {
                if (errs) {
                    log.error(errs);
                    rmap.code = 1;
                    res.send(rmap);
                } else {
                    rmap.income += rows[0].income;
                    res.send(rmap);
                }
            });
        }
    });
});


router.post('/getSociatyIncome', function (req, res) {
    var sociatyId = req.param("sociatyId");
    var rmap = {code: 0};
    var newDate = new Date();
    var type = {};
    roomIncomeDao.getSociatyIncomeSum(sociatyId, function (err0, rows0) {
        if (err0) {
            log.error(err0);
            rmap.code = 1;
            res.send(rmap);
        } else {
            newDate.setDate(newDate.getDate() - 1);
            type.from = commUtil.fromStrToDate((commUtil.fromDateToStr(newDate, "yyyy-MM-dd")) + " 00:00:00");
            type.to = commUtil.fromStrToDate((commUtil.fromDateToStr(newDate, "yyyy-MM-dd")) + " 23:59:59");
            roomIncomeDao.getSociatyIncomeType(sociatyId, type, function (err1, rows1) {
                if (err1) {
                    log.error(err1);
                    rmap.code = 1;
                    res.send(rmap);
                } else {
                    //起止日期数组
                    var startStop = new Array();
                    //获取当前时间
                    var currentDate = new Date();
                    //返回date是一周中的某一天
                    var week = currentDate.getDay();
                    //返回date是一个月中的某一天
                    var month = currentDate.getDate();
                    //一天的毫秒数
                    var millisecond = 1000 * 60 * 60 * 24;
                    //减去的天数
                    var minusDay = week != 0 ? week - 1 : 6;
                    //获得当前周的第一天
                    var currentWeekDayOne = new Date(currentDate.getTime() - (millisecond * minusDay));
                    //上周最后一天即本周开始的前一天
                    var priorWeekLastDay = new Date(currentWeekDayOne.getTime() - millisecond);
                    //上周的第一天
                    var priorWeekFirstDay = new Date(priorWeekLastDay.getTime() - (millisecond * 6));
                    type.from = commUtil.fromStrToDate((commUtil.fromDateToStr(priorWeekFirstDay, "yyyy-MM-dd")) + " 00:00:00");
                    type.to = commUtil.fromStrToDate((commUtil.fromDateToStr(priorWeekLastDay, "yyyy-MM-dd")) + " 23:59:59");
                    roomIncomeDao.getSociatyIncomeType(sociatyId, type, function (err2, rows2) {
                        if (err1) {
                            log.error(err1);
                            rmap.code = 1;
                            res.send(rmap);
                        } else {
                            rmap.sum = rows0[0].sum || 0;
                            rmap.yesDay = rows1[0].sum || 0;
                            rmap.week = rows2[0].sum || 0;
                            res.send(rmap);
                        }
                    });
                }
            });
        }
    });
});

router.post('/getSociatyAsset', function (req, res) {
    var sociatyId = req.param("sociatyId");
    var rmap = {code: 0};
    roomIncomeDao.getSociatyAsset(sociatyId, function (err0, rows0) {
        if (err0) {
            log.error(err0);
            rmap.code = 1;
            res.send(rmap);
        } else {
            rmap.asset = rows0[0].asset || 0;
            res.send(rmap);
        }
    });
});

router.post('/updataArtistRef', function (req, res) {
    var artistRefObj = req.param("artistRefObj");
    var rmap = {code: 0};
    roomIncomeDao.updataArtistRef(artistRefObj, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.artistList = rows || [];
        }
        res.send(rmap);
    });
});

router.post('/getArtistAssetList', function (req, res) {
    var data = req.param("data");
    var rmap = {code: 0};
    if (data.liveStart == '' || data.liveEnd == '') {
        data.liveStart = '2010/01/01';
        data.liveEnd = '2035/01/01';
    }
    roomIncomeDao.getArtistAssetList(data, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            var obj = {};
            for (var i in rows) {
                for (var j in rows) {
                    if (rows[i].times > rows[j].times) {
                        obj = rows[i];
                        rows[i] = rows[j];
                        rows[j] = obj;
                    }
                }
            }
            rmap.artistAssetList = rows || [];
            res.send(rmap);
        }
    });
});

router.post('/getNewAsset', function (req, res) {
    var data = req.param("data");
    var rmap = {code: 0};
    //data.newDate = commUtil.fromStrToDate(data.newDate);
    var time = new Date();
    if (data.newDate == '') {
        data.newDate = (commUtil.fromDateToStr(time, "yyyy-MM-dd"));
    }
    roomIncomeDao.getNewAsset(data, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            rmap.newAsset = rows[0].income || 0;
            rmap.newDate = data.newDate;
            res.send(rmap);
        }
    });
});

module.exports = router;