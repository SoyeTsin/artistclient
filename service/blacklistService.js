/**
 * Created by Linyi on 2015/8/20 0020.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');
var BlacklistDao = require('../model/blacklistDao');
var blacklistDao = new BlacklistDao();

router.post('/getBlacklist', function (req, res) {
    var channelId = req.param("channelId");
    var rmap = {code: 0};
    blacklistDao.getBlacklist(channelId, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.blacklistList = rows || [];
        }
        res.send(rmap);
    });
});


router.post('/getCycleBlacklist', function (req, res) {
    var data = req.param("data");
    var rmap = {code: 0};
    blacklistDao.getCycleBlacklist(data, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.blacklistList = rows || [];
        }
        res.send(rmap);
    });
});

router.post('/delBlacklist', function (req, res) {
    var blacklist = req.param("blacklist");
    var rmap = {code: 0};
    blacklistDao.delBlacklist(blacklist, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
        }
        res.send(rmap);
    });
});

router.post('/delBlacklists', function (req, res) {
    var blacklists = req.param("blacklistListClones");
    var rmap = {code: 0};
    blacklistDao.delBlacklists(blacklists, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
        }
        res.send(rmap);
    });
});

module.exports = router;