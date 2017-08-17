/**
 * Created by Linyi on 2015/8/19 0019.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');
var RoomSetUpDao = require('../model/roomSetUpDao');
var roomSetUpDao = new RoomSetUpDao();

router.post('/getChannelState', function (req, res) {
    var channelId = req.param("channelId");
    var rmap = {code: 0};
    roomSetUpDao.getChannelState(channelId, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.channelState = rows[0] || {};
        }
        res.send(rmap);
    });
});

router.post('/updataChannelState', function (req, res) {
    var channelState = req.param("channelState");
    var rmap = {code: 0};
    roomSetUpDao.updataChannelState(channelState, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            res.send(rmap);
        }
    });
});


router.post('/getChannelAdmin', function (req, res) {
    var channelId = req.param("channelId");
    var rmap = {code: 0};
    roomSetUpDao.getChannelAdmin(channelId, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            rmap.channelAdminList = rows || [];
            res.send(rmap);
        }
    });
});


router.post('/delChannelAdmin', function (req, res) {
    var channelAdminList = req.param("channelAdminList");
    var rmap = {code: 0};
    roomSetUpDao.delChannelAdmin(channelAdminList, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            res.send(rmap);
        }
    });
});

module.exports = router;