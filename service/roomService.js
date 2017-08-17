/**
 * Created by Linyi on 2015/6/19 0019.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');
var RoomDao = require('../model/roomDao');
var roomDao = new RoomDao();

router.post('/getRoomObj', function (req, res) {
    var roomCode = req.param("sociatyId");
    console.log(roomCode)
    //var rmap = {code: 0};
    //roomDao.getRoomObj(userId, function (err, rows) {
    //    if (err) {
    //        log.error(err);
    //        rmap.code = 1;
    //    } else {
    //        rmap.channelList = rows || [];
    //    }
    //    res.send(rmap);
    //});
});


router.post('/getSociatyList', function (req, res) {
    var uuid = req.session.passport.user.uuid;
    //console.log(uuid)
    var rmap = {code: 0};
    roomDao.getSociatyList(uuid, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            rmap.sociatyList = rows || [];
            for (var i = 0; i < rmap.sociatyList.length; i++) {
                rmap.sociatyList[i].creDate = (rmap.sociatyList[i].creDate).toString();
            }
            res.send(rmap);
        }
    });
});


router.post('/getArtistList', function (req, res) {
    var sociatyId = req.param("sociatyId");
    var rmap = {code: 0};
    roomDao.getArtistList(sociatyId, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.artistList = rows || [];

        }
        res.send(rmap);
    });
});


router.post('/updataArtistRef', function (req, res) {
    var artistRefObj = req.param("artistRefObj");
    var rmap = {code: 0};
    roomDao.updataArtistRef(artistRefObj, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.artistList = rows || [];
        }
        res.send(rmap);
    });
});


router.post('/updataImg', function (req, res) {
    var sociatyObj = req.param("sociatyObj");
    var rmap = {code: 0};
    roomDao.updataImg(sociatyObj, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            rmap.artistList = rows || [];
        }
        res.send(rmap);
    });
});

module.exports = router;