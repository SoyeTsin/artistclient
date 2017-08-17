/**
 * Created by Linyi on 2015/6/15 0015.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');

var redisClient = require("../model/redisDB");


router.post('/getUserList', function (req, res) {
    //假数据
    var userList = [];
    for (var i = 0; i < 24; i++) {
        userList.push({
            userName: '小妮子',
            channelCode:Math.floor(Math.random()*100000),
            lineNum:Math.floor(Math.random()*10000),
            imgUrl: './images/0' + ( i % 6 + 1) + '.jpg'
        })
    }
    var today = commUtil.fromDateToStr(new Date(), "yyyyMMdd");

    var key = "client_page_6" + today;
    //存入redis
    redisClient.lpush(key, JSON.stringify(userList));
    //设置过期时间
    var desTime = new Date();
    desTime.setHours(24)
    desTime.setMinutes(0);
    desTime.setSeconds(0);
    desTime.setMilliseconds(0);
    console.log(desTime.toLocaleString());
    var leftSeconds = parseInt((desTime.getTime() - Date.now()) / 1000);
    redisClient.expire(key, leftSeconds);
    //取出数据
    var rmap = {code: 0}
    redisClient.lrange(key, 0, -1, function (err, list) {
        if (err) {
            rmap.code = 1;
        } else {
            var userList = [];
            list && list.forEach(function (clientIdStr) {
                userList.push(JSON.parse(clientIdStr));
            })
            rmap.userList = userList[0];
        }
        console.log(JSON.stringify(userList))
        res.send(rmap);
    })
})
module.exports = router;