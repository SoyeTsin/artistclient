/**
 * Created by Linyi on 2015/8/24 0024.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');
var ArtistIncomeDao = require('../model/artistIncomeDao');
var artistIncomeDao = new ArtistIncomeDao();


router.post('/getSociatyIncomeList_a', function (req, res) {
    var rmap = {code: 0};
    var cycleDate = req.param("date");
    var newDate = new Date();
    if (cycleDate.startDate == '' || cycleDate.endDate == '') {
        cycleDate.endDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
        newDate.setDate(newDate.getDate() - 7);
        cycleDate.startDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
    }
    artistIncomeDao.getSociatyIncomeGift(cycleDate.sociatyList, cycleDate.startDate, cycleDate.endDate, function (err, row) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            rmap.income = row[0].income;
            artistIncomeDao.getSociatyIncomeGuard(cycleDate.sociatyList, cycleDate.startDate, cycleDate.endDate, function (errs, rows) {
                if (errs) {
                    log.error(errs);
                    rmap.code = 1;
                    res.send(rmap);
                } else {
                    for (var i in rows) {
                        rmap.income += rows[i].income;
                    }
                    res.send(rmap);
                }
            });
        }
    });
});


router.post('/getRoomIncome_gift', function (req, res) {
    var rmap = {code: 0};
    var cycleDate = req.param("date");
    newDate = new Date();
    if (cycleDate.startDate == '' || cycleDate.endDate == '') {
        cycleDate.endDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
        newDate.setDate(newDate.getDate() - 7);
        cycleDate.startDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
    }
    artistIncomeDao.getRoomIncome_gift(cycleDate.sociatyId, cycleDate.startDate, cycleDate.endDate, function (err, row) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            var rowList = row || [];
            for (var i in rowList) {
                for (var j in rowList) {
                    if (rowList[i].roomId == rowList[j].roomId && i != j) {
                        rowList[i].income = rowList[i].income + rowList[j].income;
                        rowList[j].income = 0;
                    }
                }
            }
            var list = [];
            for (var i in rowList) {
                if (rowList[i].income != 0) {
                    list.push(rowList[i]);
                }
            }
            var obj = {};
            var rowLists = list;
            for (var i = 0; i < rowLists.length; i++) {
                obj = {};
                for (var j = 0; j < list.length; j++) {
                    if (rowLists[i].income * 1 > list[j].income * 1) {
                        obj = rowLists[i];
                        rowLists[i] = list[j];
                        list[j] = obj;
                    }
                }
            }
            rmap.incomeList = list[0] || {};
            res.send(rmap);

        }
    });
});


router.post('/getSociatyIncome_gift', function (req, res) {
    var rmap = {code: 0};
    var cycleDate = req.param("date");
    newDate = new Date();
    if (cycleDate.startDate == '' || cycleDate.endDate == '') {
        cycleDate.endDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
        newDate.setDate(newDate.getDate() - 7);
        cycleDate.startDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
    }
    artistIncomeDao.getSociatyIncome_gift(cycleDate.sociatyId, cycleDate.startDate, cycleDate.endDate, function (err, row) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            artistIncomeDao.getSociatyIncome_guard(cycleDate.sociatyId, cycleDate.startDate, cycleDate.endDate, function (err1, row1) {
                if (err1) {
                    log.error(err1);
                    rmap.code = 1;
                    res.send(rmap);
                } else {
                    rmap.income = 0;
                    for (var i in row) {
                        rmap.income += row[i].income
                    }
                    for (var i in row1) {
                        rmap.income += row1[i].income
                    }
                    res.send(rmap);
                }
            });
        }
    });
});


router.post('/getArtistIncome_a', function (req, res) {
    var rmap = {code: 0};
    var cycleDate = req.param("date");
    var newDate = new Date();
    if (cycleDate.startDate == '' || cycleDate.endDate == '') {
        cycleDate.endDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
        newDate.setDate(newDate.getDate() - 30);
        cycleDate.startDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
    }
    artistIncomeDao.getIncomeList_gift(cycleDate.sociatyId, cycleDate.startDate, cycleDate.endDate, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            var list = rows || [];
            for (var i in list) {
                for (var j in rows) {
                    if (list[i].uuid == rows[j].uuid && i != j) {
                        list[i].income += rows[j].income;
                        rows[j].income = 0;
                    }
                }
            }
            var vlist = [];
            for (var i in list) {
                if (list[i].income != '0' && list[i].income != 0) {
                    vlist.push(list[i]);
                }
            }
            var obj = {};
            for (var i in vlist) {
                for (var j in vlist) {
                    if (vlist[i].income > vlist[j].income) {
                        obj = vlist[i];
                        vlist[i] = vlist[j];
                        vlist[j] = obj;
                    }
                }
            }
            rmap.artistIncome = vlist || [];
            rmap.startDate = cycleDate.startDate;
            rmap.endDate = cycleDate.endDate;
            artistIncomeDao.getIncomeList_guard(cycleDate.sociatyId, cycleDate.startDate, cycleDate.endDate, function (err1, rows1) {
                if (err) {
                    log.error(err1);
                    rmap.code = 1;
                    res.send(rmap);
                } else {
                    for (var i in rmap.artistIncome) {
                        for (var j in rows1) {
                            if (rmap.artistIncome[i].uuid == rows1[j].uuid) {
                                rmap.artistIncome[i].income += rows1[j].income;
                                rows1[j].income = 0;
                            }
                        }
                    }
                    res.send(rmap);
                }
            });
        }
    });
});

router.post('/getMun', function (req, res) {
    var rmap = {code: 0};
    var cycleDate = req.param("date");
    newDate = new Date();
    if (cycleDate.startDate == '' || cycleDate.endDate == '') {
        cycleDate.endDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
        newDate.setDate(newDate.getDate() - 30);
        cycleDate.startDate = (commUtil.fromDateToStr(newDate, "yyyy/MM/dd"));
    }
    artistIncomeDao.getMun(function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            rmap.mun = rows[0].mun || 0;
            artistIncomeDao.getAll(function (err0, rows0) {
                if (err0) {
                    log.error(err0);
                    rmap.code = 1;
                    res.send(rmap);
                } else {
                    rmap.all = rows0[0].all || 0;
                    artistIncomeDao.getYuE(function (err1, rows1) {
                        if (err1) {
                            log.error(err1);
                            rmap.code = 1;
                            res.send(rmap);
                        } else {
                            var yue = 0;
                            for (var i in rows1) {
                                yue += rows1[i].yue;
                            }
                            rmap.yue = yue;
                            rmap.startDate = cycleDate.startDate;
                            rmap.endDate = cycleDate.endDate;
                            res.send(rmap);
                        }
                    });
                }
            });
        }
    });
});

router.post('/getRecList', function (req, res) {
    var rmap = {code: 0};
    artistIncomeDao.getRecList(function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            rmap.recList = rows || [];
            res.send(rmap);
        }
    });
});

router.post('/getGiveGiftList_bb', function (req, res) {
    var data = req.param("data");
    var rmap = {code: 0};
    artistIncomeDao.getGiveGiftList(data, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            var obj = {};
            for (var i in rows) {
                for (var j in rows) {
                    if (commUtil.fromStrToDate(rows[i].cre_time) > commUtil.fromStrToDate(rows[j].cre_time)) {
                        obj = rows[i];
                        rows[i] = rows[j];
                        rows[j] = obj;
                    }
                }
            }
            rmap.giveGiftList = rows || [];
            res.send(rmap);
        }
    });
});

router.post('/getUuid', function (req, res) {
    var uuid = req.param("uuid");
    var rmap = {code: 0};
    artistIncomeDao.getUuid(uuid, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.user = rows[0] || {};
        }
        res.send(rmap);
    });
});

router.post('/getUserNike', function (req, res) {
    var nick_name = req.param("userNike");
    var rmap = {code: 0};
    artistIncomeDao.getUserNike(nick_name, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.user = rows[0] || {};
        }
        res.send(rmap);
    });
});


router.post('/getBalance', function (req, res) {
    var uuid = req.param("uuid");
    var rmap = {code: 0};
    artistIncomeDao.getBalance(uuid, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = -1;
        } else {
            if (rows.length == 0) {
                rmap.code = 1;
                rmap.total = {
                    uuid: uuid,
                    money_value: 0,
                    money_type: 0
                };
            } else {
                rmap.money_value = rows[0].money_value;
            }
        }
        res.send(rmap);
    });
});

/**
 * 业务逻辑
 */
router.post('/getTotalList', function (req, res) {
    var data = req.param("data");
    var uuid = data.uuid;
    var rmap = {code: 0};
    var newDate = new Date();
    var endDate = (commUtil.fromDateToStr(newDate, "yyyy-MM-dd"));
    newDate.setDate(newDate.getDate() - 30);
    var startDate = (commUtil.fromDateToStr(newDate, "yyyy-MM-dd"));
    if (data.endDate != '' && data.startDate != '') {
        endDate = data.endDate;
        startDate = data.startDate;
    }
    artistIncomeDao.getTotal_gift(uuid, startDate, endDate, function (err0, rows0) {
        if (err0) {
            log.error(err0);
            rmap.code = -1;
            res.send(rmap);
        } else {
            artistIncomeDao.getTotal_guard(uuid, startDate, endDate, function (err1, rows1) {
                if (err1) {
                    log.error(err1);
                    rmap.code = -1;
                    res.send(rmap);
                } else {
                    artistIncomeDao.getTotal_car(uuid, startDate, endDate, function (err2, rows2) {
                        if (err2) {
                            log.error(err2);
                            rmap.code = -1;
                            res.send(rmap);
                        } else {
                            var list = [];
                            for (var i in rows0) {
                                list.push({
                                    orderId: 'L-' + (('' + rows0[i].time.getTime()).substring(0, 10) + i),
                                    uuid: rows0[i].uuid,
                                    time: rows0[i].time,
                                    recharge: 0,
                                    pay: '-' + rows0[i].pay,
                                    remarks: '给主播[' + rows0[i].to_nick + ']送了' + rows0[i].gift_num + '个[' + rows0[i].giftName + ']',
                                    type: ''
                                })
                            }
                            for (var i in rows1) {
                                var ttt = {
                                    orderId: 'G-' + (('' + rows1[i].time.getTime()).substring(0, 10) + i),
                                    uuid: rows1[i].uuid,
                                    time: rows1[i].time,
                                    recharge: 0,
                                    pay: '-' + rows1[i].pay,
                                    remarks: '给主播[' + rows1[i].artistNick + ']开通了' + rows1[i].month + '个月的[守护]',
                                    type: ''
                                }
                                list.push(ttt)
                            }
                            for (var i in rows2) {
                                var str = '续费了';
                                if (rows2[i].buy_renew == 1) {
                                    var str = '购买了';
                                }
                                var tttt = {
                                    orderId: 'C-' + (('' + rows2[i].time.getTime()).substring(0, 10) + i),
                                    uuid: rows2[i].uuid,
                                    time: rows2[i].time,
                                    recharge: 0,
                                    pay: '-' + rows2[i].pay,
                                    remarks: str + rows2[i].month + '个月的[' + rows2[i].carName + ']',
                                    type: ''

                                }
                                list.push(tttt)
                            }
                            artistIncomeDao.getRechargeList(uuid, startDate, endDate, function (err3, rows3) {
                                if (err3) {
                                    log.error(err3);
                                    rmap.code = -1;
                                } else {
                                    for (var i in rows3) {
                                        var str = '';
                                        var type = rows3[i].status;
                                        var time = commUtil.fromStrToDate(rows3[i].order_timestamp);
                                        if (rows3[i].status == 1) {
                                            str = '充值[￥' + rows3[i].money + '元]购买了[' + rows3[i].goods_num + '个]秀豆';
                                        } else {
                                            str = '充值[￥' + rows3[i].money + '元]未支付';
                                            var newTime = new Date();
                                            newTime.setDate(newTime.getDate() - 1);
                                            if (time < newTime) {
                                                type = 2;
                                            }
                                        }
                                        var tyty = {
                                            orderId: 'R-' + rows3[i].order_id,
                                            uuid: rows3[i].from_uuid,
                                            time: time,
                                            recharge: '+' + rows3[i].goods_num,
                                            pay: 0,
                                            remarks: str,
                                            type: type
                                        };
                                        list.push(tyty);
                                    }
                                }
                                artistIncomeDao.getMoneyList(uuid, startDate, endDate, function (err4, rows4) {
                                    if (err4) {
                                        log.error(err4);
                                        rmap.code = -1;
                                    } else {
                                        for (var i in rows4) {
                                            var str = '';
                                            str = '跪了土豪[' + rows4[i].nick_name + ']获得[' + rows4[i].money_dif + ']秀豆';
                                            var tyty = {
                                                orderId: 'Orz-' + (rows4[i].cte_time.getTime() + '').substr(0, 10),
                                                uuid: rows4[i].to_uuid,
                                                time: rows4[i].cte_time,
                                                recharge: '+' + rows4[i].money_dif,
                                                pay: 0,
                                                remarks: str,
                                                type: '1'
                                            };
                                            list.push(tyty);
                                        }
                                    }
                                    for (var i in list) {
                                        var hhh = {};
                                        for (var j in list) {
                                            if (list[i].time > list[j].time) {
                                                hhh = list[i];
                                                list[i] = list[j];
                                                list[j] = hhh;
                                            }
                                        }
                                    }
                                    rmap.list = list;
                                    rmap.startDate = startDate;
                                    rmap.endDate = endDate;
                                    res.send(rmap);
                                });
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;