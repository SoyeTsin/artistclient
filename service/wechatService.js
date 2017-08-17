/**
 * Created by Linyi on 2015/6/3 0003.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var log = require('../util/log');
var commUtil = require('../util/commUtil');
var request = require('request');
var redis = require('redis');
var con = require("../conf/serverConfig.json")

//微信支付部分
var ACCESS_TOKEN = "";
var jsapi_ticket = "";
var expires_in = 0;
var client = redis.createClient(con.redis.port, con.redis.host);
client.on("error", function (error) {
    console.log(error);
});
client.set("ACCESS_TOKEN", "4ox2CPuArRZuvw_wpXy9yBsexsZdvaM0I5WUzTQ8mJVffHEfYV1CT_nlCKXNl7T4nBKPY047CBqtqmWqqgPYlvvSSMgbJBSYXmNzvbpjWmm6FDnlQrI_c_Cm9DNRAMYQYLYeAIACPC");
client.set("jsapi_ticket", "kgt8ON7yVITDhtdwci0qeXcpFr-qd9gkygIqDh0mjXp054Qwm6nvEGXxCcxC9gyVMBnA3MGZimNFQwSOcoFwJQ");
client.quit();

setInterval(function () {
    expires_in--;
    if (expires_in < 10) {
        console.log("HTTPS-0");
        var url = encodeURI("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxd0abd7f5ba498cf6&secret=09244b42dd40604f107ecf330bc0d510");
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("HTTPS-1");
                var strList = body.split('\n ');
                var str = strList.join('');
                var jsonObj = eval('(' + str + ')');
                ACCESS_TOKEN = jsonObj.access_token;
                expires_in = jsonObj.expires_in;
                var client = redis.createClient(con.redis.port, con.redis.host);
                client.on("error", function (error) {
                    console.log(error);
                });
                client.set("ACCESS_TOKEN", ACCESS_TOKEN);
                var url = encodeURI("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + ACCESS_TOKEN + "&type=jsapi");
                request(url, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var strList = body.split('\n ');
                        var str = strList.join('');
                        var jsonObj = eval('(' + str + ')');
                        jsapi_ticket = jsonObj.ticket;
                        client.on("error", function (error) {
                            console.log(error);
                        });
                        client.set("jsapi_ticket", jsapi_ticket);
                        client.quit();
                        console.log("ACCESS_TOKEN:" + ACCESS_TOKEN);
                        console.log("jsapi_ticket:" + jsapi_ticket);
                    }
                })
            }
        })
    }
}, 1000);

module.exports = router;