/**
 * Created by Linyi on 2015/6/3 0004.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');
var ChannelDao = require('../model/channelDao');
var channelDao = new ChannelDao();

router.post('/getChannelList', function (req, res) {
    var userId = req.session.user.rid;
    var rmap = {code: 0};
    channelDao.getChannelList(userId, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.channelList = rows || [];
        }
        res.send(rmap);
    });
});

module.exports = router;