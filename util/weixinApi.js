var WechatApi = require('wechat').API;
var CacheDao=require('./cacheDao.js');
var cacheDao=new CacheDao();

var wechatApis=new Array();
var MESSAGE_URL="";
var DEAL_MESSAGE_TEMPLATE="";
var MESSAGE_TOP_COLOR= '#FF0000';

exports.sendDealMessage=function(domainId,openId,data,cb){
    this.getApi(domainId,function(api){
        api.sendTemplate(openId,DEAL_MESSAGE_TEMPLATE, MESSAGE_URL, MESSAGE_TOP_COLOR, data, cb);
    });
}

exports.getApi=function(domainId,cb){
    var api=wechatApis[domainId];
    if(api){
        cb(api);
    }else{
        cacheDao.getDomain(domainId,function(rule) {
            api = new WechatApi(rule.app_id, rule.app_secret);
            wechatApis[domainId]=api;
            cb(api);
        });
    }
}