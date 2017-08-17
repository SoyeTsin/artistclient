/**
 * Created by Linyi on 2015/9/30 0030.
 */
var db = require('./db.js');
var db2 = require('./db2.js');
var db3 = require('./db3.js');
var commUtil = require('../util/commUtil');
var artistIncomeDao = function () {

};

//查询公会礼物收入
artistIncomeDao.prototype.getSociatyIncomeGift = function (sociatyId, startDate, endDate, cb) {
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
                    var sql = "SELECT SUM(b.money_dif*-1) income FROM cr_giftinfo ft RIGHT JOIN (SELECT gi.*,ar.sociatyId FROM " + newtableName + " gi INNER JOIN cr_artistref ar ON ar.uuId=gi.to_uuid where ar.sociatyId=?  and gi.gift_id!='99'  and DATE_FORMAT(gi.cre_time,'%Y/%m/%d')>=? and DATE_FORMAT(gi.cre_time,'%Y/%m/%d')<=?) b ON ft.giftCode=b.gift_id";
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
                    var xxx = [
                        {income: income}
                    ];
                    cb(err, xxx);
                }
            });
        }
    });
}

//查询公会守护收入
artistIncomeDao.prototype.getSociatyIncomeGuard = function (sociatyId, startDate, endDate, cb) {
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
                    var xxx = [
                        {income: income}
                    ];
                    cb(err, xxx);
                }
            });
        }
    });
}

artistIncomeDao.prototype.getRoomIncome_gift = function (sociatyId, startDate, endDate, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill_' + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT c.channelCode,b.income FROM (SELECT ci.to_uuid uuid,ci.nick,sum(ci.money_dif*-1) income,ci.room_id FROM " + newtableName + " ci inner JOIN cr_artistref ar ON ci.to_uuid=ar.uuId where DATE_FORMAT(ci.cre_time,'%Y/%m/%d')>=?  and ci.gift_id!='99' and DATE_FORMAT(ci.cre_time,'%Y/%m/%d')<=?  GROUP BY ci.room_id) b INNER JOIN (SELECT COUNT(arf.uuId) sum,arf.sociatyId sociatyId1,can.channelCode FROM cr_artistref arf INNER JOIN cr_channelinfo can ON can.sociatyId = arf.sociatyId where can.channelCode=? GROUP BY can.channelCode) c ON c.channelCode=b.room_id";
                    connection.query(sql, [startDate, endDate, sociatyId], function (err, row) {
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


artistIncomeDao.prototype.getSociatyIncome_guard = function (sociatyId, startDate, endDate, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_guard_bill_' + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT sum(gb.total) income FROM " + newtableName + " gb INNER JOIN cr_artistref ar ON gb.artist_id=ar.uuid where ar.sociatyId=? and DATE_FORMAT(gb.start_time,'%Y/%m/%d')>=? and DATE_FORMAT(gb.start_time,'%Y/%m/%d')<=?";
                    connection.query(sql, [sociatyId, startDate, endDate], function (err, row) {
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

artistIncomeDao.prototype.getSociatyIncome_gift = function (sociatyId, startDate, endDate, cb) {
    //var sql = "SELECT sum(mr.money_dif)*-1 income FROM t_money_record mr INNER JOIN cr_artistref ar ON ar.uuId=mr.to_uuid WHERE ar.sociatyId=? and DATE_FORMAT(mr.cte_time,'%Y/%m/%d')>=? and DATE_FORMAT(mr.cte_time,'%Y/%m/%d')<=?";
    //db.getConnection(function (err, connection) {
    //    connection.query(sql, [sociatyId, startDate, endDate], function (err, rows) {
    //        connection.release();
    //        cb(err, rows);
    //    });
    //});

    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill_' + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT sum(gb.money_dif*-1) income FROM " + newtableName + " gb INNER JOIN cr_artistref ar ON gb.to_uuid=ar.uuid where ar.sociatyId=? and DATE_FORMAT(gb.cre_time,'%Y/%m/%d')>=? and DATE_FORMAT(gb.cre_time,'%Y/%m/%d')<=?";
                    connection.query(sql, [sociatyId, startDate, endDate], function (err, row) {
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

//查询所有艺人礼物总收入
artistIncomeDao.prototype.getIncomeList_gift = function (sociatyId, startDate, endDate, cb) {
    var k = 0;
    db2.getConnection(function (err, connection) {
        getConsumeDataFun();
        var rows = [];

        function getConsumeDataFun() {
            var newtableName = 't_gift_bill_' + k;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT SUM(b.money_dif*-1) income,b.to_uuid uuid,b.to_nick nick,sas.sum FROM t_subcribe_anchor_sum sas RIGHT JOIN(SELECT gb.*,ar.sociatyId FROM " + newtableName + " gb INNER JOIN cr_artistref ar ON gb.to_uuid = ar.uuId where ar.sociatyId=? and gb.gift_id!='99' and DATE_FORMAT(gb.cre_time,'%Y/%m/%d')>=? and DATE_FORMAT(gb.cre_time,'%Y/%m/%d')<=?) b ON sas.uuid=b.to_uuid GROUP BY b.to_uuid";
                    connection.query(sql, [sociatyId, startDate, endDate], function (err, row) {
                        if (row.length > 0) {
                            for (var j = 0; j < row.length; j++) {
                                rows.push(row[j]);
                            }
                            var rrr = 0;
                            for (var i in row) {
                                rrr += row[i].income
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
                    cb(err, rows);
                }
            });
        }
    });
}

//查询艺人守护总收入
artistIncomeDao.prototype.getIncomeList_guard = function (sociatyId, startDate, endDate, cb) {
    var k = 0;
    db2.getConnection(function (err, connection) {
        getConsumeDataFun();
        var rows = [];

        function getConsumeDataFun() {
            var newtableName = 't_guard_bill_' + k;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT SUM(gb.total) income,gb.artist_id uuid FROM " + newtableName + " gb left JOIN cr_artistref ar ON ar.uuId = gb.artist_id WHERE ar.sociatyId=? and DATE_FORMAT(gb.start_time,'%Y/%m/%d')>=? and DATE_FORMAT(gb.start_time,'%Y/%m/%d')<=? GROUP BY gb.artist_id";
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
                    cb(err, rows);
                }
            });
        }
    });
}

artistIncomeDao.prototype.getMun = function (cb) {
    var sql = "SELECT COUNT(oi.from_uuid) as 'mun' FROM (SELECT from_uuid FROM t_order_info WHERE `status`=1 GROUP BY from_uuid) oi";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

artistIncomeDao.prototype.getAll = function (cb) {
    var sql = "SELECT SUM(goods_num) as 'all' FROM t_order_info WHERE `status`=1";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}
artistIncomeDao.prototype.getYuE = function (cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_user_money_' + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT SUM(money_value) as 'yue' FROM " + newtableName + " WHERE money_type=0";
                    connection.query(sql, [], function (err, row) {
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

artistIncomeDao.prototype.getRecList = function (cb) {
    var sql = "SELECT f.time,f.num,e.count FROM (SELECT from_unixtime(order_timestamp,'%Y-%m-%d') time,SUM(goods_num) num FROM t_order_info WHERE `status`=1 GROUP BY from_unixtime(order_timestamp,'%Y-%m-%d'))f INNER JOIN (SELECT COUNT(b.from_uuid) 'count',b.time FROM (SELECT from_unixtime(order_timestamp,'%Y-%m-%d') time,u.from_uuid FROM t_order_info u WHERE u.status=1 GROUP BY from_unixtime(order_timestamp,'%Y-%m-%d'),u.from_uuid) b GROUP BY b.time) e ON f.time=e.time";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


artistIncomeDao.prototype.getGiveGiftList = function (data, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT ci.uuid,ci.nick,DATE_FORMAT(ci.cre_time,'%Y-%m-%d %T') cre_time,gi.giftName,ci.gift_num,FORMAT(-1*ci.money_dif,2) money_dif FROM " + newtableName + " ci left JOIN cr_giftinfo gi ON ci.gift_id=gi.rid WHERE to_uuid=? AND TO_DAYS(DATE_FORMAT(ci.cre_time,'%Y/%m/%d')) >=TO_DAYS(?) AND TO_DAYS(DATE_FORMAT(ci.cre_time,'%Y/%m/%d')) <= TO_DAYS(?) ORDER BY ci.cre_time LIMIT 1000";
                    connection.query(sql, [data.uuid, data.start, data.end], function (err, row) {
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


artistIncomeDao.prototype.getBalance = function (uuid, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_user_money_' + i;
            var selTableSql = "select table_name from information_schema. tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    //" + newtableName + "
                    var sql = "SELECT * from " + newtableName + " where money_type=0 and uuid=?";
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

artistIncomeDao.prototype.getTotal_gift = function (uuid, startDate, endDate, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT b.uuid,b.cre_time time,(b.money_dif*-1) pay,b.to_uuid,b.to_nick,g.giftName,b.gift_num FROM " + newtableName + " b INNER JOIN cr_giftinfo g ON g.rid=b.gift_id WHERE b.uuid=? and b.gift_id!=99 and DATE_FORMAT(b.cre_time,'%Y-%m-%d')>=? and DATE_FORMAT(b.cre_time,'%Y-%m-%d')<=?";
                    connection.query(sql, [uuid, startDate, endDate], function (err, row) {
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


artistIncomeDao.prototype.getTotal_guard = function (uuid, startDate, endDate, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_guard_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT a.uuid,a.price pay,a.start_time time,a.artist_id,u.nickName artistNick,a.month FROM " + newtableName + " a INNER JOIN cr_userinfo u ON a.artist_id=u.uuid WHERE a.uuid=? and DATE_FORMAT(a.start_time,'%Y-%m-%d')>=? and DATE_FORMAT(a.start_time,'%Y-%m-%d')<=?";
                    connection.query(sql, [uuid, startDate, endDate], function (err, row) {
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

artistIncomeDao.prototype.getMoneyList = function (uuid, startDate, endDate, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_yl_nick_uuid_' + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT * FROM t_money_record mr INNER JOIN " + newtableName + " nu ON nu.uuid=mr.to_uuid WHERE mr.type=10 and mr.uuid=?  and DATE_FORMAT(mr.cte_time,'%Y-%m-%d')>=? and DATE_FORMAT(mr.cte_time,'%Y-%m-%d')<=?";
                    connection.query(sql, [uuid, startDate, endDate], function (err, row) {
                        if (row.length > 0) {
                            for (var j = 0; j < row.length; j++) {
                                rows.push(row[j]);
                            }
                            getConsumeDataFun(i + 1);
                        } else {
                            getConsumeDataFun(i + 1);
                        }
                    });
                } else {//859
                    //135000387
                    connection.release();
                    cb(err, rows);
                }
            });
        }
    });
}

artistIncomeDao.prototype.getTotal_car = function (uuid, startDate, endDate, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_car_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT c.uuid,c.price pay,c.start_time time,y.name carName,c.buy_renew,c.month FROM " + newtableName + " c INNER JOIN t_yl_car_cfg y ON c.car_id=y.rid WHERE c.uuid=? and DATE_FORMAT(c.start_time,'%Y-%m-%d')>=? and DATE_FORMAT(c.start_time,'%Y-%m-%d')<=?";
                    connection.query(sql, [uuid, startDate, endDate], function (err, row) {
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


artistIncomeDao.prototype.getRechargeList = function (uuid, startDate, endDate, cb) {
    var sql = "select order_id,from_uuid,from_unixtime(order_timestamp,'%Y-%m-%d %H:%i:%s') order_timestamp,money,goods_num,status from t_order_info where from_uuid = ? and from_unixtime(order_timestamp,'%Y-%m-%d')>=? and from_unixtime(order_timestamp,'%Y-%m-%d')<=?";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [uuid, startDate, endDate], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

artistIncomeDao.prototype.getUuid = function (uuid, cb) {
    var sql = "SELECT * FROM t_yl_userinfo WHERE uuid LIKE ?";
    db2.getConnection(function (err, connection) {
        connection.query(sql, ['%' + uuid + '%'], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

artistIncomeDao.prototype.getUserNike = function (nick_name, cb) {
    var sql = "SELECT * FROM t_yl_userinfo WHERE nick_name LIKE ?";
    db2.getConnection(function (err, connection) {
        connection.query(sql, ['%' + nick_name + '%'], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

module.exports = artistIncomeDao;