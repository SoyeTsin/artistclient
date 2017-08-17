/**
 * Created by Linyi on 2015/8/18 0018.
 */
var db = require('./db.js');
var db2 = require('./db2.js');
var db3 = require('./db3.js');
var roomIncomeDao = function () {

};

roomIncomeDao.prototype.getSociatyIncome_gift = function (sociatyId, startDate, endDate, cb) {
    var sql = "SELECT sum(mr.money_dif)*-1 income FROM t_money_record mr INNER JOIN cr_artistref ar ON ar.uuId=mr.to_uuid WHERE ar.sociatyId=? and DATE_FORMAT(mr.cte_time,'%Y/%m/%d')>=? and DATE_FORMAT(mr.cte_time,'%Y/%m/%d')<=?";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [sociatyId, startDate, endDate], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

roomIncomeDao.prototype.getSociatyIncomeGift = function (sociatyId, startDate, endDate, cb) {
    var k = 0;

    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun() {
            var newtableName = 't_gift_bill_' + k;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT SUM(b.money_dif*-1) income FROM cr_giftinfo ft INNER JOIN (SELECT gi.*,ar.sociatyId FROM " + newtableName + " gi INNER JOIN cr_artistref ar ON ar.uuId=gi.to_uuid where ar.sociatyId=?  and DATE_FORMAT(gi.cre_time,'%Y/%m/%d')>=? and DATE_FORMAT(gi.cre_time,'%Y/%m/%d')<=?) b ON ft.giftCode=b.gift_id";
                    connection.query(sql, [sociatyId, startDate, endDate], function (err, row) {
                        if (row.length > 0) {
                            for (var j = 0; j < row.length; j++) {
                                rows.push(row[j]);
                            }
                            k++;
                            getConsumeDataFun();
                        } else {
                            k++;
                            getConsumeDataFun();
                        }
                    });
                } else {
                    connection.release();
                    var income = 0;
                    for (var i in rows) {
                        income += rows[i].income;
                    }
                    var xxx = [{income: income}];
                    cb(err, xxx);
                }
            });
        }
    });
}


roomIncomeDao.prototype.getSociatyIncomeGuard = function (sociatyId, startDate, endDate, cb) {
    var k = 0;

    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun() {
            var newtableName = 't_guard_bill_' + k;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT SUM(b.price*b.month) income FROM cr_userinfo ui INNER JOIN (SELECT gb.*,ar.sociatyId FROM " + newtableName + " gb INNER JOIN cr_artistref ar ON gb.artist_id = ar.uuId and ar.sociatyId=? and DATE_FORMAT(gb.start_time,'%Y/%m/%d')>=? and DATE_FORMAT(gb.start_time,'%Y/%m/%d')<=?) b ON ui.uuid=b.artist_id";
                    connection.query(sql, [sociatyId, startDate, endDate], function (err, row) {
                        if (row.length > 0) {
                            for (var j = 0; j < row.length; j++) {
                                rows.push(row[j]);
                            }
                            k++;
                            getConsumeDataFun();
                        } else {
                            k++;
                            getConsumeDataFun();
                        }
                    });
                } else {
                    connection.release();
                    var income = 0;
                    for (var i in rows) {
                        income += rows[i].income;
                    }
                    var xxx = [{income: income}];
                    cb(err, xxx);
                }
            });
        }
    });
}

roomIncomeDao.prototype.getSociatyIncome_cycle_gift = function (sociatyId, startDate, endDate, cb) {
    var k = 0;

    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun() {
            var newtableName = 't_gift_bill_' + k;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT SUM(b.money_dif*-1) income FROM cr_giftinfo ft INNER JOIN (SELECT gi.*,ar.sociatyId FROM " + newtableName + " gi INNER JOIN cr_artistref ar ON ar.uuId=gi.to_uuid where ar.sociatyId=?  and DATE_FORMAT(gi.cre_time,'%Y-%m')>=? and DATE_FORMAT(gi.cre_time,'%Y-%m')<=?) b ON ft.giftCode=b.gift_id";
                    connection.query(sql, [sociatyId, startDate, endDate], function (err, row) {
                        if (row.length > 0) {
                            for (var j = 0; j < row.length; j++) {
                                rows.push(row[j]);
                            }
                            k++;
                            getConsumeDataFun();
                        } else {
                            k++;
                            getConsumeDataFun();
                        }
                    });
                } else {
                    connection.release();
                    var income = 0;
                    for (var i in rows) {
                        income += rows[i].income;
                    }
                    var xxx = [{income: income}];
                    cb(err, xxx);
                }
            });
        }
    });
}

roomIncomeDao.prototype.getSociatyIncome_cycle_guard = function (sociatyId, startDate, endDate, cb) {
    var k = 0;

    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun() {
            var newtableName = 't_guard_bill_' + k;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT SUM(b.price*b.month) income FROM cr_userinfo ui INNER JOIN (SELECT gb.*,ar.sociatyId FROM " + newtableName + " gb INNER JOIN cr_artistref ar ON gb.artist_id = ar.uuId and ar.sociatyId=? and DATE_FORMAT(gb.start_time,'%Y-%m')>=? and DATE_FORMAT(gb.start_time,'%Y-%m')<=?) b ON ui.uuid=b.artist_id";
                    connection.query(sql, [sociatyId, startDate, endDate], function (err, row) {
                        if (row.length > 0) {
                            for (var j = 0; j < row.length; j++) {
                                rows.push(row[j]);
                            }
                            k++;
                            getConsumeDataFun();
                        } else {
                            k++;
                            getConsumeDataFun();
                        }
                    });
                } else {
                    connection.release();
                    var income = 0;
                    for (var i in rows) {
                        income += rows[i].income;
                    }
                    var xxx = [{income: income}];
                    cb(err, xxx);
                }
            });
        }
    });
}

roomIncomeDao.prototype.getSociatyIncomeSum = function (sociatyId, cb) {
    db2.getConnection(function (err, connection) {
        var sql = "SELECT -1*SUM(money_dif) sum FROM st_consumeinfo where room_id = ?";
        connection.query(sql, sociatyId, function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

roomIncomeDao.prototype.getSociatyIncomeType = function (sociatyId, type, cb) {
    db2.getConnection(function (err, connection) {
        var sql = "SELECT -1*SUM(money_dif) sum  FROM st_consumeinfo where room_id = ? and cre_time>? and cre_time<?";
        connection.query(sql, [sociatyId, type.from, type.to], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


roomIncomeDao.prototype.getNewAsset = function (data, cb) {
    db2.getConnection(function (err, connection) {
        var sql = "SELECT sum(mr.money_dif)*-1 income FROM t_money_record mr INNER JOIN cr_artistref ar ON ar.uuId=mr.to_uuid WHERE ar.sociatyId=? and DATE_FORMAT(mr.cte_time,'%Y-%m-%d')=?";
        connection.query(sql, [data.sociatyId, data.newDate], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


roomIncomeDao.prototype.getSociatyAsset = function (sociatyId, cb) {
    db2.getConnection(function (err, connection) {
        var sql = "SELECT sum(mr.money_dif)*-1 income FROM t_money_record mr INNER JOIN cr_artistref ar ON ar.uuId=mr.to_uuid WHERE ar.sociatyId=?";
        connection.query(sql, [sociatyId], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


roomIncomeDao.prototype.updataArtistRef = function (artistRefObj, cb) {
    var sql = "update cr_artistref set ? where uuId = ? and sociatyId=?"
    db.getConnection(function (err, connection) {
        connection.query(sql, [artistRefObj, artistRefObj.uuId, artistRefObj.sociatyId], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


roomIncomeDao.prototype.getArtistAssetList = function (data, cb) {
    db2.getConnection(function (err, connection) {
        var sql = "SELECT ui.uuid,ui.nickName FROM cr_userinfo ui RIGHT JOIN cr_artistref ar ON ar.uuId=ui.uuid WHERE ar.sociatyId=?";
        connection.query(sql, [data.sociatyId], function (err, row0) {
            var rows = row0;
            getConsumeDataFun(0);
            function getConsumeDataFun(i) {
                if (i < rows.length) {
                    //" + newtableName + "
                    //var sql = "SELECT start_time startDate,end_time endDate FROM t_yl_artist_play_time  where uuid=? AND TO_DAYS(start_time)>=TO_DAYS(?) AND TO_DAYS(end_time)<=TO_DAYS(?)";
                    var sql = "select uuid,sum(UNIX_TIMESTAMP(end_time)-UNIX_TIMESTAMP(start_time)) as 'duration' from t_yl_artist_play_time where `uuid` =? and TO_DAYS(start_time)>=TO_DAYS(?) AND TO_DAYS(start_time)<=TO_DAYS(?)";
                    connection.query(sql, [rows[i].uuid, data.liveStart, data.liveEnd], function (err, row) {
                        if (row.length > 0) {
                            var liveDateSum = 0;
                            for (var j in row) {
                                liveDateSum = row[j].duration * 1000;
                            }
                            rows[i].liveDate = liveDate(liveDateSum);
                            rows[i].times = liveDateSum;
                            getConsumeDataFun(i + 1);
                        } else {
                            getConsumeDataFun(i + 1);
                        }
                    });
                } else {
                    connection.release();
                    cb(err, rows);
                }
            }
        });
    });
}

roomIncomeDao.prototype.yirenshouru = function (data, cb) {
    db2.getConnection(function (err, connection) {
        var rows = [];
        initDataFun(0);
        function initDataFun(k) {
            if (k < data.length) {
                yirenshouruFun(0);

                function yirenshouruFun(i) {
                    if (i < data.length) {
                        var newtableName = 't_gift_bill' + "_" + i;
                        var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
                        connection.query(selTableSql, [], function (err, rowsTable) {
                            if (rowsTable.length > 0) {
                                var sql = "SELECT sum(money_dif*-1) income,to_uuid uuid FROM " + newtableName + " WHERE to_uuid=?";
                                connection.query(sql, [data[k].uuid], function (err, row) {
                                    if (row.length > 0) {
                                        for (var j = 0; j < row.length; j++) {
                                            rows.push(row[j]);
                                        }
                                        yirenshouruFun(i + 1);
                                    } else {
                                        yirenshouruFun(i + 1);
                                    }
                                });
                            } else {
                                initDataFun(k + 1);
                            }
                        });
                    }
                }
            } else {
                connection.release();
                cb(err, rows);
            }
        }
    });
}

function liveDate(date) {
    //计算出相差天数
    if (date) {
        //var days = Math.floor(date / (24 * 3600 * 1000))
        //var leave1 = date % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
        var hours = Math.floor(date / (3600 * 1000))
        var leave2 = date % (3600 * 1000)        //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000))
        var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000)
        //return (days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒")
        return ( hours + "小时 " + minutes + "分钟 " + seconds + "秒")
    } else {
        //return ( "0天 " + "0小时 " + "0分钟 " + "0秒")
        return ("0小时 " + "0分钟 " + "0秒")
    }

}
module.exports = roomIncomeDao;