/**
 * Created by Linyi on 2015/6/3 0003.
 */
var db = require('./db.js');
var db2 = require('./db2.js');
var db3 = require('./db3.js');
var incomeDao = function () {

};


incomeDao.prototype.getGiveGiftList = function (uuid, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT ci.nick,DATE_FORMAT(ci.cre_time,'%Y-%m-%d %T') cre_time,gi.giftName,ci.gift_num,FORMAT(-1*ci.money_dif,2) money_dif FROM " + newtableName + " ci left JOIN cr_giftinfo gi ON ci.gift_id=gi.rid WHERE to_uuid=?";
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

incomeDao.prototype.getCycleGiveGiftList = function (data, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT ci.nick,DATE_FORMAT(ci.cre_time,'%Y-%m-%d %T') cre_time,gi.giftName,ci.gift_num,FORMAT(-1*ci.money_dif,2) money_dif FROM " + newtableName + " ci INNER JOIN cr_giftinfo gi ON ci.gift_id=gi.rid WHERE to_uuid=? and DATE_FORMAT(cre_time,'%Y-%m-%d')>=? and DATE_FORMAT(cre_time,'%Y-%m-%d')<=?";
                    connection.query(sql, [data.uuid, data.cycle.startDate, data.cycle.endDate], function (err, row) {
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

module.exports = incomeDao;