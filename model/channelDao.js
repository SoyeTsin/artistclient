/**
 * Created by Linyi on 2015/6/4 0004.
 */
var db = require('./db.js');
var db2 = require('./db2.js');
var db3 = require('./db3.js');
var channelDao = function () {

};


channelDao.prototype.getChannelList = function (userId, cb) {
    var sql = "select * from cr_channelInfo ci INNER JOIN cr_channeladmininfo ca on(ci.rid=ca.channelId) where ca.userId=?";
    db2.getConnection(function (err, connection) {
        connection.query(sql, userId, function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

module.exports = channelDao;