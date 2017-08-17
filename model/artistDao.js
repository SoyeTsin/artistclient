/**
 * Created by Linyi on 2015/6/17 0017.
 */
var db = require('./db.js');
var db2 = require('./db2.js');
var db3 = require('./db3.js');
var channelDao = function () {

};


channelDao.prototype.getArtistList = function (uuid, cb) {
    db2.getConnection(function (err, connection) {
        var sql = "SELECT si.sociatyName  FROM cr_artistref ar INNER JOIN cr_sociatyinfo si on(ar.sociatyId=si.sociatyCode) where ar.uuId=?";
        connection.query(sql, uuid, function (err, sociatyName) {
            var sql = "SELECT ui.uuid,ui.picturesUrl,ci.channelCode,ci.channelName,ui.homeRecommend recommend,DATE_FORMAT(ci.creDate,'%Y-%m-%d %T') creDate FROM cr_userinfo ui INNER JOIN cr_channelinfo ci ON ci.channelCode=ui.homeId where ui.uuid=?";
            connection.query(sql, uuid, function (err, channelList) {
                connection.release();
                cb(err, sociatyName, channelList);
            });
        });
    });
}
channelDao.prototype.getArtistList2 = function (uuid, cb) {
    db2.getConnection(function (err, connection) {
        var sql = "SELECT endDate,startDate FROM st_artisttrack  where uuid=?";
        connection.query(sql, uuid, function (err, liveDate) {
            connection.release();
            cb(err, liveDate);
        });
    });
}

channelDao.prototype.getArtistList3 = function (uuid, date, cb) {
    db2.getConnection(function (err, connection) {
        var sql = "SELECT endDate,startDate FROM st_artisttrack  where uuid=? and DATE_FORMAT(startDate,'%Y-%m-%d')>=?";
        connection.query(sql, [uuid, date], function (err, liveDate) {
            connection.release();
            cb(err, liveDate);
        });
    });
}

channelDao.prototype.get_t_subcribe = function (uuid, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_subcribe' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT COUNT(anchor_id) as subcribeSum from " + newtableName + " WHERE uuid=? GROUP BY uuid";
                    connection.query(sql, [uuid], function (err, row) {
                        if (row.length > 0) {
                            for (var j = 0; j < row.length; j++) {
                                rows.push(row[j]);
                            }
                            getConsumeDataFun(i + 1);
                        } else {
                            getConsumeDataFun(i + 1);
                        }
                    });
                } else {
                    connection.release();
                    cb(err, rows);
                }
            });
        }
    });
}

module.exports = channelDao;