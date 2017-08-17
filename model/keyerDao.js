/**
 * Created by Linyi on 2015/8/17 0017.
 */
var db = require('./db.js');
var db2 = require('./db2.js');
var db3 = require('./db3.js');
var keyerDao = function () {

};


keyerDao.prototype.feiwenheaixin = function (cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT aw.artistId uuid,sum(gb.money_dif*-1) income,gb.to_nick nick FROM " + newtableName + " gb right JOIN cr_artistwhite aw ON aw.artistId=gb.to_uuid WHERE aw.coreRecommend=1 GROUP BY aw.artistId";
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

keyerDao.prototype.getCoreRecommend = function (cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT aw.artistId uuid,sum(gb.money_dif*-1) income,gb.to_nick nick FROM " + newtableName + " gb right JOIN cr_artistwhite aw ON aw.artistId=gb.to_uuid WHERE aw.coreRecommend=1 GROUP BY aw.artistId";
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


keyerDao.prototype.dangTianShouRu = function (data, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT sum(money_dif*-1) income FROM " + newtableName + " WHERE to_uuid=? and DATE_FORMAT(cre_time,'%Y-%m-%d')>=? and DATE_FORMAT(cre_time,'%Y-%m-%d')<=?";
                    connection.query(sql, [data.uuid, data.startDate, data.endDate], function (err, row) {
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

keyerDao.prototype.shouJiDangTianShouRu = function (data, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT sum(money_dif*-1) income FROM " + newtableName + " WHERE to_uuid=? and DATE_FORMAT(cre_time,'%Y-%m-%d')>=? and DATE_FORMAT(cre_time,'%Y-%m-%d')<=? and src>0";
                    connection.query(sql, [data.uuid, data.startDate, data.endDate], function (err, row) {
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


keyerDao.prototype.ZuiDuo = function (data, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT sum(money_dif*-1) income,to_uuid,nick FROM " + newtableName + " WHERE uuid=? and DATE_FORMAT(cre_time,'%Y-%m-%d')>=? and DATE_FORMAT(cre_time,'%Y-%m-%d')<=? GROUP BY to_uuid";
                    connection.query(sql, [data.uuid, data.startDate, data.endDate], function (err, row) {
                        if (row.length > 0) {
                            for (var i = 0; i < rows.length; i++) {
                                for (var j = 0; j < row.length; j++) {
                                    if (rows[i].to_uuid == row[j].to_uuid) {
                                        rows[i].income = rows[i].income + row[j].income;
                                    }
                                }
                            }
                            for (var i = 0; i < rows.length; i++) {
                                for (var j = 0; j < row.length; j++) {
                                    if (rows[i].to_uuid == row[j].to_uuid) {
                                        row[j].income = 0;
                                    }
                                }
                            }
                            for (var j = 0; j < row.length; j++) {
                                if (row[j].income != 0) {
                                    rows.push(row[j]);
                                }
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


keyerDao.prototype.gongXianGift = function (data, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT uuid,nick,sum(money_dif*-1) income FROM " + newtableName + " WHERE to_uuid=? and DATE_FORMAT(cre_time,'%Y-%m-%d')>=? and DATE_FORMAT(cre_time,'%Y-%m-%d')<=? GROUP BY uuid ORDER BY income desc";
                    connection.query(sql, [data.uuid, data.startDate, data.endDate], function (err, row) {
                        if (row.length > 0) {
                            for (var i = 0; i < rows.length; i++) {
                                for (var j = 0; j < row.length; j++) {
                                    if (rows[i].uuid == row[j].uuid) {
                                        rows[i].income = rows[i].income + row[j].income;
                                    }
                                }
                            }
                            for (var i = 0; i < rows.length; i++) {
                                for (var j = 0; j < row.length; j++) {
                                    if (rows[i].uuid == row[j].uuid) {
                                        row[j].income = 0;
                                    }
                                }
                            }
                            for (var j = 0; j < row.length; j++) {
                                if (row[j].income != 0) {
                                    rows.push(row[j]);
                                }
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


keyerDao.prototype.gongXianGuard = function (data, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_guard_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT uuid,nick,sum(price) income FROM " + newtableName + " WHERE artist_id = ? and DATE_FORMAT(start_time,'%Y-%m-%d')>=? and DATE_FORMAT(start_time,'%Y-%m-%d')<=?  GROUP BY uuid ORDER BY income desc";
                    connection.query(sql, [data.uuid, data.startDate, data.endDate], function (err, row) {
                        if (row.length > 0) {
                            for (var i = 0; i < rows.length; i++) {
                                for (var j = 0; j < row.length; j++) {
                                    if (rows[i].uuid == row[j].uuid) {
                                        rows[i].income = rows[i].income + row[j].income;
                                    }
                                }
                            }
                            for (var i = 0; i < rows.length; i++) {
                                for (var j = 0; j < row.length; j++) {
                                    if (rows[i].uuid == row[j].uuid) {
                                        row[j].income = 0;
                                    }
                                }
                            }
                            for (var j = 0; j < row.length; j++) {
                                if (row[j].income != 0) {
                                    rows.push(row[j]);
                                }
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

keyerDao.prototype.sel_t_yl_artist_play_time = function (newDay, cb) {
    var sql = "SELECT uuid,room_id channelId,start_time startDate,end_time endDate from t_yl_artist_play_time WHERE DATE_FORMAT(start_time,'%Y-%m-%d')>=?";
    //var sql = "inert into st_artisttrack set (select a.uuid,a.room_id channelId,a.start_time startDate,a.end_time endDate from t_yl_artist_play_time a where DATE_FORMAT(a.start_time,'%Y-%m-%d')>=?)"
    db2.getConnection(function (err, connection) {
        connection.query(sql, [newDay], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

keyerDao.prototype.getChannelauthority = function (channelId, cb) {
    var sql = "SELECT * from cr_channelauthority where channelId=?";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [channelId], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


keyerDao.prototype.setUninstall = function (undata, cb) {
    var sql = "insert into cr_pc_uninstall set ?";
    db.getConnection(function (err, connection) {
        connection.query(sql, [undata], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


keyerDao.prototype.getAdList = function (cb) {
    var sql = "select * from cr_ad";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [], function (err, rows) {
            connection.release();
            //console.log(rows)
            cb(err, rows);
        });
    });
}


keyerDao.prototype.get_new_ad = function (cb) {
    var sql = "select rid,url,type,DATE_FORMAT(creDate,'%Y-%m-%d %H:%i:%S') creDate,states,DATE_FORMAT(start_time,'%Y-%m-%d %H:%i:%S') start_time,DATE_FORMAT(end_time,'%Y-%m-%d %H:%i:%S') end_time,adurl,remarks,title,`order`,official,DATE_FORMAT(start_activity,'%Y-%m-%d %H:%i:%S') start_activity,DATE_FORMAT(end_activity,'%Y-%m-%d %H:%i:%S') end_activity from cr_ad_new";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


keyerDao.prototype.setInstall = function (insdata, cb) {
    var sql = "insert into cr_pc_install set ?";
    db.getConnection(function (err, connection) {
        connection.query(sql, [insdata], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

keyerDao.prototype.insWebData = function (insdata, cb) {
    var sql = "insert into cr_web_hits set ?";
    db.getConnection(function (err, connection) {
        connection.query(sql, [insdata], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}


keyerDao.prototype.sel_st_artisttrack = function (newDay, cb) {
    var sql = "SELECT * from st_artisttrack WHERE DATE_FORMAT(startDate,'%Y-%m-%d')>=?";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [newDay], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

keyerDao.prototype.upData_st_artisttrack = function (data, cb) {
    db.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];
        var errs = [];

        function getConsumeDataFun(i) {
            var selTableSql = "insert ignore into st_artisttrack  set ?";

            connection.query(selTableSql, [data[i]], function (err, row) {
                if (i < data.length) {
                    if (err) {
                        errs.push(err)
                    } else {
                        rows.push(row)
                    }
                    getConsumeDataFun(i + 1);
                } else {
                    connection.release();
                    cb(errs, rows);
                }
            });
        }
    });
}

keyerDao.prototype.getWeekIncome = function (uuid, startDate, endDate, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT DATE_FORMAT(cre_time,'%Y-%m-%d') time,sum(money_dif*-1) income FROM " + newtableName + " WHERE to_uuid=? and DATE_FORMAT(cre_time,'%Y-%m-%d')>=? and DATE_FORMAT(cre_time,'%Y-%m-%d')<=? GROUP BY DATE_FORMAT(cre_time,'%Y-%m-%d')";
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


keyerDao.prototype.getPhoneWeekIncome = function (uuid, startDate, endDate, cb) {
    db2.getConnection(function (err, connection) {
        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill' + "_" + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT DATE_FORMAT(cre_time,'%Y-%m-%d') time,sum(money_dif*-1) income FROM " + newtableName + " WHERE to_uuid=? and DATE_FORMAT(cre_time,'%Y-%m-%d')>=? and DATE_FORMAT(cre_time,'%Y-%m-%d')<=? and src>0 GROUP BY DATE_FORMAT(cre_time,'%Y-%m-%d')";
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

keyerDao.prototype.getPhoneWeekIncomes = function (uuid, startDate, endDate, cb) {
    db2.getConnection(function (err, connection) {
        //var sql = "SELECT sum(money_dif*-1) income,to_uuid,uuid,to_nick FROM t_gift_bill_0 WHERE to_uuid=199000004 and DATE_FORMAT(cre_time,'%Y-%m-%d')>=? and DATE_FORMAT(cre_time,'%Y-%m-%d')<=? GROUP BY uuid";

        getConsumeDataFun(0);
        var rows = [];

        function getConsumeDataFun(i) {
            var newtableName = 't_gift_bill_' + i;
            var selTableSql = "select table_name from information_schema.tables where table_name ='" + newtableName + "'";
            connection.query(selTableSql, [], function (err, rowsTable) {
                if (rowsTable.length > 0) {
                    var sql = "SELECT sum(money_dif*-1) income,to_uuid,to_nick,uuid,nick,src FROM " + newtableName + " WHERE src='2' and to_uuid=? and DATE_FORMAT(cre_time,'%Y-%m-%d')>=? and DATE_FORMAT(cre_time,'%Y-%m-%d')<=? GROUP BY uuid";
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

keyerDao.prototype.sel_cr_max_online_hour = function (cb) {
    var sql = "SELECT * from cr_max_online_hour";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}
keyerDao.prototype.sel_cr_sociaty_room_maxnum = function (cb) {
    var sql = "SELECT * from cr_sociaty_room_maxnum";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

keyerDao.prototype.ins_st_active = function (obj, cb) {
    var sql = "INSERT ignore into st_active set ?";
    db.getConnection(function (err, connection) {
        connection.query(sql, [obj], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

keyerDao.prototype.ins_st_roomactive = function (list, time, cb) {
    var sql = "INSERT ignore into st_roomactive set roomid=?,pcu=?,creDate=?";
    db.getConnection(function (err, connection) {
        var i = 0;
        var rows = [];
        var errs = null;
        Fun();
        function Fun() {
            if (i < list.length) {
                connection.query(sql, [list[i].room_id, list[i].max_num, time], function (err, rows) {
                    if (err) {
                        errs = err;
                        connection.release();
                        cb(err, rows);
                    } else {
                        i += 1;
                        Fun();
                    }
                });
            } else {
                connection.release();
                cb(err, rows);
            }
        }
    });
}


keyerDao.prototype.upData_st_active = function (obj, cb) {
    var sql = "update st_active set ? where DATE_FORMAT(creDate,'%Y-%m-%d')=?";
    db.getConnection(function (err, connection) {
        connection.query(sql, [obj, obj.creDate], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

keyerDao.prototype.getAd = function (cb) {
    var sql = "SELECT * from cr_ad where type='android'";
    db2.getConnection(function (err, connection) {
        connection.query(sql, [], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}
keyerDao.prototype.getYuE = function (cb) {
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


keyerDao.prototype.ins_yuE = function (yue, time, cb) {
    var obj = {
        time: time,
        value: yue
    }
    var sql = "INSERT ignore into cr_balance_snap set ?";
    db.getConnection(function (err, connection) {
        connection.query(sql, [obj], function (err, rows) {
            connection.release();
            cb(err, rows);
        });
    });
}

module.exports = keyerDao;