/**
 * Created by Linyi on 2015/6/3 0003.
 */
var db = require('./db.js');
var db2 = require('./db2.js');
var db3 = require('./db3.js');
var mainDao = function () {

};
/**
 * 根据暴风userid查找风秀id
 * @param uuid
 * @param cb
 */
mainDao.prototype.getUserObj_uuid = function (userid, cb) {
    var sql = 'SELECT uuid,userid FROM t_baofeng_account WHERE userid=?';
    db2.getConnection(function (err, connection) {
        connection.query(sql, userid, function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}
/**
 * 根绝uuid查找用户昵称
 * @param userid
 * @param cb
 */
mainDao.prototype.getUserObj_nick = function (uuid, cb) {
    var sql = 'SELECT * FROM t_yl_userinfo WHERE uuid=?';
    db2.getConnection(function (err, connection) {
        connection.query(sql, uuid, function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

mainDao.prototype.getRoomList = function (uuid, cb) {
    db2.getConnection(function (err, connection) {
        var sql1 = 'SELECT b.* from cr_sociatyinfo si INNER JOIN (select ra.uuid,ra.room_id,ra.authority,ci.channelCode,ci.channelName from t_yl_user_room_authority ra INNER JOIN cr_channelinfo ci ON ra.room_id=ci.channelCode WHERE ra.uuid=? and ra.authority!=0) b ON b.channelCode=si.sociatyCode';
        connection.query(sql1, uuid, function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}
mainDao.prototype.getArtistSociatyList = function (uuid, cb) {
    db2.getConnection(function (err, connection) {
        var sql1 = 'SELECT * FROM cr_artistref ar INNER JOIN cr_sociatyinfo si ON ar.sociatyId=si.sociatyCode WHERE ar.uuId=?';
        connection.query(sql1, uuid, function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}
module.exports = mainDao;