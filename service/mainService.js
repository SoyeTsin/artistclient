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
var session = require('express-session');
var request = require('request');

/**
 * 验证暴风账号
 */
router.post('/islogin', function (req, res) {
    var rmap = {code: 0};
    var data = req.param("data");
    var url = "http://shahe.sso.baofeng.net/islogin?bfcsid=" + data.bfcsid + "&st=" + data.st + "&from=" + data.from + "&version=" + data.version;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            var strList = body.split('\n ');
            var str = strList.join('');
            var jsonObj = eval('(' + str + ')');
            rmap.code = 0;
            rmap.jsonObj = jsonObj;
            res.send(rmap);
        } else {
            rmap.code = 1000;
            res.send(rmap);
        }
    })
});

/**
 * 获取用户信息
 */
router.post('/getUserObj_uuid_nick', function (req, res) {
    var data = req.param("data");
    var rmap = {code: 0};
    var userid = data.info.userid;
    mainDao.getUserObj_uuid(userid, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
            res.send(rmap);
        } else {
            if (rows.length > 0) {
                var uuid = rows[0].uuid;
                mainDao.getUserObj_nick(uuid, function (err0, rows0) {
                    if (err0) {
                        log.error(err0);
                        rmap.code = 1;
                        res.send(rmap);
                    } else {
                        if (rows0.length > 0) {
                            rmap.userObj = {uuid: uuid, nickName: rows0[0].nick_name};
                            res.send(rmap);
                        } else {
                            rmap.code = 1;
                            res.send(rmap);
                        }
                    }
                });
            } else {
                rmap.code = 1;
                res.send(rmap);
            }
        }
    });
});
/**
 * 查询公会列表
 */
router.post('/getRoomList', function (req, res) {
    var uuid = req.param("uuid");
    var rmap = {code: 0};
    mainDao.getRoomList(uuid, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            var listt = rows || [];
            for (var i in listt) {
                listt[i].roomUrl = 'http://picture.show.baofeng.com/icon/icon_' + listt[i].room_id;
            }
            var roomList = [];
            for (var i in listt) {
                if (listt[i].authority == '2' || listt[i].authority == 2) {
                    roomList.push(listt[i]);
                }
            }
            rmap.roomList = roomList;
        }
        res.send(rmap);
    });
});
/**
 * 查询艺人所属公会
 */
router.post('/getArtistSociatyList', function (req, res) {
    var uuid = req.param("uuid");
    var rmap = {code: 0};
    mainDao.getArtistSociatyList(uuid, function (err, rows) {
        if (err) {
            log.error(err);
            rmap.code = 1;
        } else {
            var listt = rows || [];
            for (var i in listt) {
                listt[i].roomUrl = 'http://picture.show.baofeng.com/icon/icon_' + listt[i].sociatyId;
            }
            rmap.roomList = listt;
        }
        res.send(rmap);
    });
});


module.exports = router;