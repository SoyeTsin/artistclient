var http = require('http');
var https = require('https');
var util = require('util');
var querystring = require('querystring');
var commUtil=require('./commUtil.js');
var CommonDao=require('../models/commonDao.js');
var commonDao=new CommonDao();
var crypto = require('crypto');

var ipServicekey='94b76eeda1b3270c73e5750acd5ac89b';
var ipServiceServer ='http://api.map.baidu.com/location/ip?ip=';
var geoServiceServer='http://api.map.baidu.com/geocoder/v2/?output=json&address=';
var gpsServiceServer='http://api.map.baidu.com/geoconv/v1/?output=json&coords=';
////api.map.baidu.com/geocoder/v2/?address=百度大厦&output=json&ak=E4805d16520de693a3fe707cdc962045&callback=showLocation
//var urlShortServer='dwz.cn';
var urlShortServer="http://api.t.sina.com.cn/short_url/shorten.json?source=1681459862&url_long=";

var smsAccountId='aaf98f89493ff1d30149401a85950045';
var smsAuthToken='3648b96eb4d147a2b8df48ec8a2977b8';
var smsAppId='aaf98f89493ff1d30149401abf100048';
var smsServiceServer='sandboxapp.cloopen.com';
var smsServicePort=8883;
//var smsServiceServer='https://app.cloopen.com:8883';

//var smsHttpServer='http://api.sms.cn/mt/?uid=';
//var smsHttpUser='huangming';
//var smsHttpPassword='8fcbc4973b0cd2b1df438a0efcc34d2b';
var smsHttpServer='http://www.10000ccom.com/sendservice.ashx?UserName=';
var smsHttpUser='26673719';
var smsHttpPassword='romanote007';

exports.smsSendMessage=function(tel,content,cb){
    var password=smsHttpPassword;//crypto.createHash('md5').update(smsHttpPassword+smsHttpUser).digest("hex");
    //var url=smsHttpServer+smsHttpUser+'&pwd='+password+'&mobile='+tel+'&content='+content+'&encode=utf8';
    var url=smsHttpServer+smsHttpUser+'&Password='+password+'&mobile='+tel+'&content='+content+'&encode=utf8';
    commonHttpRequestMethod(url,false,function(err,result){
        if(err){
            cb(false);
        }else{
            if(result=='success'){
                cb(true);
            }else{
                cb(false);
            }

            //TODO
            /*
            if(result.indexOf('stat=100')>=0){
                cb(true);
            }else{
                cb(false);
            }*/
        }
    });
}
/*
exports.smsSend=function(tel,code,cb){
    var sign=smsAccountId+smsAuthToken+commUtil.fromDateToStr(new Date(),'yyyyMMddhhmmss');
    sign=crypto.createHash('md5').update(sign).digest("hex");
    var url='/2013-12-26/Accounts/'+smsAccountId+'/register/validate?sig='+sign.toUpperCase();
    var data={"to":tel,"appId":smsAppId,"templateId":"1","datas":[code,'weilinked']};
    commonHttpsPost(url,data,function(result){
        cb(result);
    });
}
*/
var commonHttpsPost=function(url,data,cb){
    var postData = JSON.stringify(data);
    var opt = {
        method: "POST",
        hostname: smsServiceServer,
        port: smsServicePort,
        path: url,
        headers: {
            "Content-Type": 'application/json',
            "Content-Length": postData.length
        }
    };
    var req = https.request(opt, function (serverFeedback) {
        if (serverFeedback.statusCode == 200) {
            var content = "";
            serverFeedback.on('data', function (data) { content += data; })
                .on('end', function () { cb(JSON.parse(content)); });
        }
        else {
            cb(null);
        }
    });
    req.write(postData + "\n");
    req.end();
}

var commonHttpRequestMethod=function(url,isJson,cb){
    http.get(url, function(res) {
        var code = res.statusCode;
        var content='';
        if (code == 200) {
            res.on('data', function(data) {
                try {
                    content=content+data;
                } catch (err) {
                    cb(err);
                }
            });
            res.on('end',function(){
                var result=null;
                if(isJson){
                    result=JSON.parse(content);
                }else{
                    result=content;
                }
                cb(null,result);
            });
        } else {
            cb({ code: code });
        }
    }).on('error', function(e) { cb(e); });
}

var commonHttpRequest=function(url,cb){
    commonHttpRequestMethod(url,true,cb);
}

exports.httpRequest=function(url,cb){
    commonHttpRequest(url,cb);
}

var getGeoFromAddress=function(address,cb){
    var url = geoServiceServer + address+'&ak='+ipServicekey;
    commonHttpRequest(url,cb);
}

exports.convertGpsToBaidu=function(lan,lat,cb){
    var url = gpsServiceServer + lan+','+lat+'&from=1&to=5&ak='+ipServicekey;
    commonHttpRequest(url,cb);
}

exports.getGeoFromAddressAndSave=function(rid,address,tableName,lngField,latField){
    getGeoFromAddress(address,function(err,data){
        if(!err){
            if(data.status==0){
                var sql="update "+tableName+" set "+lngField+" = "+data.result.location.lng+", "+latField+"="+data.result.location.lat+" where rid="+rid;
                commonDao.run(sql,function(err,data){
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
    });
}

exports.getBaiduPositionFromAddress=function(address,cb){
    getGeoFromAddress(address,function(err,data){
        var result={code:0};
        if(!err){
            if(data.status==0){
                result.position={lng:data.result.location.lng,lat:data.result.location.lat};
            }else{
                result.code=2;
            }
        }else{
            result.code=1;
        }
        cb(result);
    });
}

var getAddressFromIp=function(ip,cb){
    var url = ipServiceServer + ip+'&ak='+ipServicekey;
    commonHttpRequest(url,cb);
}

exports.getClientIP = function(req){
    var ipAddress;
    var headers = req.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
        //ipAddress=req.ip;
    }
    return ipAddress;
}
/*
exports.getShortUrl=function (longUrl,cb)
{
    var params = querystring.stringify({'url':longUrl});
    var options = {
        host: urlShortServer,
        port: 80,
        path: '/create.php',
        method: 'post',
        headers: {
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':params.length
        }};
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var data='';
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            data=data+chunk;
        });
        res.on('end', function(){
            var result=JSON.parse(data);
            cb(null,result.tinyurl);
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            cb(e);
        });
    });
    req.write(params);
    req.end();
}
*/

exports.getShortUrl=function (longUrl,cb)
{
    var urlShortUrl=urlShortServer+longUrl;
    commonHttpRequest(urlShortUrl,function(err,data){
        if(err){
            cb(err);
        }else{
            cb(null,data[0].url_short);
        }
    });
}

var letv_video_url='http://api.letvcloud.com/open.php';
var letv_user_id='132239';
var letv_security_key='fa0548c7bfdb6b70948c72528a531ebb';
var letv_user_unique='919b056bb2';

exports.vedioUploadProgress=function (progress_url,cb)
{
    commonHttpRequest(progress_url,cb);
}

exports.vedioUploadInit=function (fileName,cb)
{
    var timestamp=Math.round(new Date().getTime()/1000)+'';
    var parameter='apivideo.upload.init'+
        'formatjson'+
        'timestamp'+timestamp+
        'user_unique'+letv_user_unique+
        'ver2.0'+
        'video_name'+fileName+letv_security_key;
    var sign=crypto.createHash('md5').update(parameter).digest("hex");
    var url=letv_video_url+'?user_unique='+encodeURIComponent(letv_user_unique)+'&'+
        'timestamp='+ encodeURIComponent(timestamp)+'&'+
        'api='+encodeURIComponent('video.upload.init')+'&'+
        'format='+encodeURIComponent('json')+'&'+
        'ver='+encodeURIComponent('2.0')+'&'+
        'video_name='+encodeURIComponent(fileName)+'&'+
        'sign='+sign;

    commonHttpRequest(url,cb);
}

exports.vedioImagePreview=function (video_id,cb){
    var timestamp=Math.round(new Date().getTime()/1000)+'';
    var parameter='apiimage.get'+
        'formatjson'+
        'size'+'300_300'+
        'timestamp'+timestamp+
        'user_unique'+letv_user_unique+
        'ver2.0'+
        'video_id'+video_id+letv_security_key;
    var sign=crypto.createHash('md5').update(parameter).digest("hex");
    var url=letv_video_url+'?user_unique='+encodeURIComponent(letv_user_unique)+'&'+
        'timestamp='+ encodeURIComponent(timestamp)+'&'+
        'api='+encodeURIComponent('image.get')+'&'+
        'format='+encodeURIComponent('json')+'&'+
        'ver='+encodeURIComponent('2.0')+'&'+
        'video_id='+encodeURIComponent(video_id)+'&'+
        'size='+encodeURIComponent('300_300')+'&'+
        'sign='+sign;
    commonHttpRequest(url,cb);
}