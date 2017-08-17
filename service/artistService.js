/**
 * Created by Linyi on 2015/6/17 0017.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');
var ArtistDao = require('../model/artistDao');
var artistDao = new ArtistDao();

router.post('/getArtistList', function (req, res) {
    var uuid = req.session.user.uuid;
    var rmap = {code: 0, channelList: {}};
    artistDao.getArtistList(uuid, function (err, sociatyName, channelList) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            artistDao.getArtistList2(uuid, function (err, liveDate) {
                if (err) {
                    log.error(err);
                    rmap.code = 1;
                    res.send(rmap);
                } else {
                    artistDao.get_t_subcribe(uuid, function (err, subcribeSum) {
                        if (err) {
                            log.error(err);
                            rmap.code = 1;
                            res.send(rmap);
                        } else {
                            rmap.channelList.channelName = channelList[0].channelName || '';
                            rmap.channelList.channelCode = channelList[0].channelCode || '';
                            rmap.channelList.creDate = channelList[0].creDate || '';
                            rmap.channelList.recommend = channelList[0].recommend || 0;
                            rmap.channelList.sociatyName = sociatyName[0].sociatyName || '';
                            rmap.channelList.userName = req.session.user.userName;
                            rmap.channelList.nickName = req.session.user.nickName;
                            rmap.channelList.userCreDate = req.session.user.creDate;
                            rmap.channelList.picturesUrl = req.session.user.picturesUrl;
                            rmap.channelList.homeId = req.session.user.homeId;
                            var subSum = 0;
                            for (var i in subcribeSum) {
                                subSum = subSum + subcribeSum[i].subcribeSum;
                            }
                            rmap.channelList.subcribeSum = subSum;
                            var liveDateSum = 0;
                            for (var i in liveDate) {
                                liveDateSum = liveDateSum + (liveDate[i].endDate - liveDate[i].startDate);
                            }
                            rmap.channelList.liveDate = liveDateSum || 0;
                            res.send(rmap);
                        }
                    });
                }
            });
        }
    });
});


router.post('/getArtistList3', function (req, res) {
    var uuid = req.session.user.uuid;
    var rmap = {code: 0, channelList: {}};
    var date = commUtil.getDataDay('yesterday');
    artistDao.getArtistList3(uuid, date, function (err, liveDate) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            var liveDateSum = 0;
            for (var i in liveDate) {
                liveDateSum = liveDateSum + (liveDate[i].endDate - liveDate[i].startDate);
            }
            rmap.yesLiveDate = liveDateSum || 0;
        }
        res.send(rmap);
    });
});

module.exports = router;