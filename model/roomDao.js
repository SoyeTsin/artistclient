/**
 * Created by Linyi on 2015/6/19 0019.
 */
var db = require('./db.js');
var db2 = require('./db2.js');
var db3 = require('./db3.js');
var roomDao = function () {

};


roomDao.prototype.getChannelList = function (userId, cb) {
    var sql = "select * from cr_channelInfo ci INNER JOIN cr_channeladmininfo ca on(ci.rid=ca.channelId) where ca.userId=?";
    db2.getConnection(function (err, connection) {
        connection.query(sql, userId, function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


roomDao.prototype.getSociatyList = function (uuid, cb) {
    var sql = "SELECT cin.sociatyId,cin.channelCode,cin.channelName,cin.channelLevel,cin.channelType,cin.recommend,cin.uuid,DATE_FORMAT(cin.creDate,'%Y-%m-%d %T') creDate,si.sociatyLogoUrl FROM cr_sociatyinfo si INNER JOIN (select ci.sociatyId,ci.channelCode,ci.channelName,ci.channelLevel,ci.channelType,ci.recommend,ci.uuid,DATE_FORMAT(ci.creDate,'%Y-%m-%d %T') creDate  from cr_channelinfo ci where channelType = 0 and uuid= ? and sociatyId !=0) cin on cin.sociatyId=si.sociatyCode";
    db2.getConnection(function (err, connection) {
        connection.query(sql, uuid, function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


roomDao.prototype.getArtistList = function (sociatyId, cb) {
    var sql = "select b.uuid,b.nickName,b.homeId,b.desc1 from cr_sociatyinfo si INNER JOIN (select ui.uuid,ui.nickName,ar.sociatyId,ar.desc1,ui.homeId from cr_userinfo ui INNER JOIN cr_artistref ar on ar.uuId=ui.uuid) b ON(si.sociatyCode=b.sociatyId) WHERE si.sociatyCode=?  ORDER BY b.desc1 desc"
    db2.getConnection(function (err, connection) {
        connection.query(sql, [sociatyId], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


roomDao.prototype.updataArtistRef = function (artistRefObj, cb) {
    var sql = "update cr_artistref set ? where uuId = ? and sociatyId=?"
    db.getConnection(function (err, connection) {
        connection.query(sql, [artistRefObj, artistRefObj.uuId, artistRefObj.sociatyId], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

roomDao.prototype.updataImg = function (sociatyObj, cb) {
    var sql = "update cr_sociatyinfo set sociatyLogoUrl=? where rid=?"
    db.getConnection(function (err, connection) {
        connection.query(sql, [sociatyObj.sociatyLogoUrl, sociatyObj.channelCode], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

module.exports = roomDao;