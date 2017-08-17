/**
 * Created by Linyi on 2015/6/3 0003.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');
var MainDao = require('../model/mainDao');
var mainDao = new MainDao();

router.post('/getUser', function (req, res) {
    var userId = req.param("userId");
    var rmap = {code: 0};
    mainDao.getUser(userId, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.user = rows[0] || {};
        }
        res.send(rmap);
    });
});

router.post('/getUserAsset', function (req, res) {
    var userId = req.param("userId");
    var rmap = {code: 0};
    mainDao.getUserAsset(userId, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.userAsset = rows[0] || {};
        }
        res.send(rmap);
    });
});

module.exports = router;