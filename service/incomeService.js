/**
 * Created by Linyi on 2015/6/3 0003.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');
var IncomeDao = require('../model/incomeDao');
var incomeDao = new IncomeDao();

router.post('/getGiveGiftList', function (req, res) {
    var uuid = req.session.user.uuid;
    var rmap = {code: 0};
    incomeDao.getGiveGiftList(uuid, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.giveGiftList = rows || [];
        }
        res.send(rmap);
    });
});

router.post('/getCycleGiveGiftList', function (req, res) {
    var data = req.param("data");
    data.uuid = req.session.user.uuid;
    var rmap = {code: 0};
    incomeDao.getCycleGiveGiftList(data, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.giveGiftList = rows || [];
        }
        res.send(rmap);
    });
});

module.exports = router;