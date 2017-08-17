/**
 * Created by Linyi on 2015/8/20 0020.
 */
var db = require('./db.js');
var db2 = require('./db2.js');
var db3 = require('./db3.js');
var blacklistDao = function () {

};


blacklistDao.prototype.getBlacklist = function (channelId, cb) {
    db2.getConnection(function (err, connection) {
        var bi = 0;
        var ni = 0;
        var rows = [];
        getB();
        function getB() {
            var newtableName1 = 't_yl_room_unable_' + bi;
            var selTableSql1 = "select table_name from information_schema.tables where table_name ='" + newtableName1 + "'";
            connection.query(selTableSql1, [], function (err, rowsTable1) {
                if (rowsTable1.length > 0) {
                    ni = 0;
                    getN();
                    function getN() {
                        var newtableName2 = 't_yl_nick_uuid_' + ni;
                        var selTableSql2 = "select table_name from information_schema.tables where table_name ='" + newtableName2 + "'";
                        connection.query(selTableSql2, [], function (err, rowsTable2) {
                            if (rowsTable2.length > 0) {
                                //" + newtableName + "
                                var sql = "SELECT ru.room_id,ru.uuid,DATE_FORMAT(ru.start_time,'%Y-%m-%d %T') creDate,nu.nick_name nickName FROM " + newtableName1 + " ru INNER JOIN " + newtableName2 + " nu ON nu.uuid=ru.uuid where ru.room_id=? and ru.type!=0 order by DATE_FORMAT(ru.start_time,'%Y-%m-%d %T') desc";
                                connection.query(sql, [channelId], function (err, row) {
                                    if (row.length > 0) {
                                        for (var j = 0; j < row.length; j++) {
                                            rows.push(row[j]);
                                        }
                                        ni += 1;
                                        getN();
                                    } else {
                                        ni += 1;
                                        getN();
                                    }
                                });
                            } else {
                                bi += 1;
                                getB();
                            }
                        });
                    }
                } else {
                    connection.release();
                    cb(err, rows);
                }
            });
        }
    });
}


blacklistDao.prototype.getCycleBlacklist = function (data, cb) {
    data.cycle.startDate = data.cycle.startDate + ' 00:00:00'
    data.cycle.endDate = data.cycle.endDate + ' 23:59:59'
    var sql = "select uuid,nickName,userName,executorId,executorName,executorNickName,roomId,DATE_FORMAT(creDate,'%Y-%m-%d %T') creDate, from cr_blacklist where roomId=? and creDate>? and creDate<?";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [data.sociatyId, data.cycle.startDate, data.cycle.endDate], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


blacklistDao.prototype.delBlacklist = function (blacklist, cb) {
    db.getConnection(function (err, connection) {
        var rows = [];
        var ni = 0;
        getN();
        function getN() {
            var newtableName2 = 't_yl_room_unable_' + ni;
            var selTableSql2 = "select table_name from information_schema.tables where table_name ='" + newtableName2 + "'";
            connection.query(selTableSql2, [], function (err, rowsTable2) {
                if (rowsTable2.length > 0) {
                    //" + newtableName + "
                    var sql = "update " + newtableName2 + " set type=0 where uuid = ? and room_id=?";
                    connection.query(sql, [blacklist.uuid, blacklist.room_id], function (err, row) {
                        if (row.affectedRows == 0) {
                            for (var j = 0; j < row.length; j++) {
                                rows.push(row);
                            }
                            ni += 1;
                            getN();
                        } else {
                            ni += 1;
                            getN();
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


blacklistDao.prototype.delBlacklists = function (blacklists, cb) {
    var sql = "update cr_blacklist set type=0 where uuid = ? and room_id=?";
    db.getConnection(function (err, connection) {
        var i = 0
        delBlacklist();
        var rows = [];

        function delBlacklist() {
            if (i < blacklists.length) {
                var rows = [];
                var ni = 0;
                getN();
                function getN() {
                    var newtableName2 = 't_yl_room_unable_' + ni;
                    var selTableSql2 = "select table_name from information_schema.tables where table_name ='" + newtableName2 + "'";
                    connection.query(selTableSql2, [], function (err, rowsTable2) {
                        if (rowsTable2.length > 0) {
                            //" + newtableName + "
                            var sql = "update " + newtableName2 + " set type=0 where uuid = ? and room_id=?";
                            connection.query(sql, [blacklists[i].uuid, blacklists[i].room_id], function (err, row) {
                                if (row.affectedRows == 0) {
                                    for (var j = 0; j < row.length; j++) {
                                        rows.push(row);
                                    }
                                    ni += 1;
                                    getN();
                                } else {
                                    ni += 1;
                                    getN();
                                }
                            });
                        } else {
                            i += 1;
                            delBlacklist();
                        }
                    });
                }
            }
            else {
                connection.release();
                cb(err, rows);
            }
        }
    });
}

module.exports = blacklistDao;