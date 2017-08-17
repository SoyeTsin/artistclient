/**
 * Created by Linyi on 2015/8/19 0019.
 */
var db = require('./db.js');
var db2 = require('./db2.js');
var db3 = require('./db3.js');
var roomSetUpDao = function () {

};


roomSetUpDao.prototype.getChannelState = function (channelId, cb) {
    var sql = "select * from cr_channelauthority where channelId=?";
    db2.getConnection(function (err, connection) {
        connection.query(sql, channelId, function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


roomSetUpDao.prototype.updataChannelState = function (channelState, cb) {
    var sql = "update cr_channelauthority set ? where channelId=?";
    db.getConnection(function (err, connection) {
        connection.query(sql, [channelState, channelState.channelId], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


roomSetUpDao.prototype.getChannelAdmin = function (channelId, cb) {
    db2.getConnection(function (err, connection) {
        var rows = [];
        var k = 0;
        yirenshouruFun();
        function yirenshouruFun() {
            var newtableName = 't_yl_nick_uuid_' + k;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT ya.uuid,ui.nick_name nickName,ya.authority,ya.room_id from t_yl_user_room_authority ya INNER JOIN " + newtableName + " ui ON ui.uuid=ya.uuid where ya.room_id=? and ya.authority=1";
                    connection.query(sql, [channelId], function (err, row) {
                        for (var j = 0; j < row.length; j++) {
                            rows.push(row[j]);
                        }
                        k += 1;
                        yirenshouruFun();
                    });
                } else {
                    connection.release();
                    cb(err, rows);
                }
            });
        }
    });
}


roomSetUpDao.prototype.delChannelAdmin = function (channelAdminList, cb) {
    var data = {
        uuid: channelAdminList.uuid,
        room_id: channelAdminList.room_id,
        authority: 0
    }
    var sql = "update t_yl_user_room_authority set ? where uuid = ? and room_id=?";
    db.getConnection(function (err, connection) {
        connection.query(sql, [data, channelAdminList.uuid, channelAdminList.room_id], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

module.exports = roomSetUpDao;