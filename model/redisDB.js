var redis = require('redis');
var serverConfig = require('../conf/serverConfig.json');
//console.log(serverConfig);
var redisClient = redis.createClient(
    serverConfig.redis.port,
    serverConfig.redis.host
)

redisClient.select(1, function (err, result) {
    !err && console.log("数据库"+serverConfig.db.host+"连接:" + result);
});
redisClient.on("error", function (err) {
    console.log("Redis Error " + err);
});

redisClient.on("connect", function () {
    console.log("Redis缓存数据库连接成功");
});

/*redisClient.set("name","becky");
redisClient.lpush("clients_1","6",function(err,value){
    console.log("插入list错误:"+err);
});
redisClient.lpush("clients_1","7",function(err,value){
    console.log("插入list错误:"+err);
});
redisClient.lrange("client_domainId_test",0,-1,function(err,value){
    console.log("今日会员:"+JSON.stringify(value));
})*/
//redisClient.expire("name",15);
var   desTime=new Date();
//desTime.setHours(24)
desTime.setMinutes(new Date().getMinutes()+1);
desTime.setSeconds(new Date().getSeconds());
desTime.setMilliseconds(0)
console.log(desTime.toLocaleString()) ;

/*var  expireTime = desTime.getTime();
var now= new Date().getTime() ;

var  times=(expireTime-now)/1000;
redisClient.expire("name",parseInt(times));*/

/*redisClient.keys("*",function(err,key){
          console.log(key);
});*/
module.exports = redisClient;