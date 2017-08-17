var mysql = require('mysql');
var serverConfig=require('../conf/serverConfig.json');
//console.log(serverConfig);
var db  = mysql.createPool(serverConfig.db2);
module.exports = db;