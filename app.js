var express = require('express');
var path = require('path');
var async = require('async');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
//var flash = require('express-flash');
var compression = require('compression');
var request = require('request');
//var mainService = require('./service/mainService');
//var incomeService = require('./service/incomeService');
//var channelService = require('./service/channelService');
//var clientPageService = require('./service/clientPageService');
//var artistService = require('./service/artistService');
//var roomService = require('./service/roomService');
//var artistIncomeService = require('./service/artistIncomeService');
//var roomIncomeService = require('./service/roomIncomeService');
//var roomSetUpService = require('./service/roomSetUpService');
//var blacklistService = require('./service/blacklistService');
var serverConfig = require('./conf/serverConfig.json');
var keyerService = require('./service/keyerService');
//var wechatService = require('./service/wechatService');

var db = require('./model/db.js');
var app = express();

var redis = require("./model/redisDB");

var RedisStore = require('connect-redis')(session);
app.disable("x-powered-by");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
//app.use(xmlMiddleware.xmlBodyParser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.query());
//app.use(session({secret: 'weixin.framework', cookie: { maxAge: 30*24*3600*1000 }}));
app.use(session({
    secret: 'liveclient_session',
    cookie: {maxAge: 30 * 24 * 3600 * 1000},
    store: new RedisStore({
        host: serverConfig.redis.host,
        port: serverConfig.redis.port,
        db: serverConfig.redis.db,
        pass: serverConfig.redis.password
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/login', function (req, res, next) {
    var remember = req.param("remember");
    passport.authenticate('local', function (err, user, info) {
        var loginResult = {};
        if (err) {
            return next(err);
        }
        if (!user) {
            loginResult.code = info.code;
            return res.send(loginResult);
        } else {
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                loginResult.code = user.code;
                loginResult.user = {};
                loginResult.user.uuid = user.uuid;
                loginResult.user.userid = user.userid;
                req.session.user = loginResult.user || [];
                return res.send(loginResult);
            });
        }
        //return res.send(loginResult);
    })(req, res, next);
});
/******************以下为无需登陆认证的API START******************/
//app.use("/mainService", mainService);
//app.use("/clientPageService", clientPageService);
app.use("/keyerService", keyerService);
/******************以上为无需登陆认证的API END******************/

/******************以下为受保护的API START******************/
app.use("*", ensureAuthenticated, function (req, res, next) {
    next();
});
//app.use("/incomeService", incomeService);
//app.use("/channelService", channelService);
//app.use("/artistService", artistService);
//app.use("/roomService", roomService);
//app.use("/roomIncomeService", roomIncomeService);
//app.use("/roomSetUpService", roomSetUpService);
//app.use("/blacklistService", blacklistService);
//app.use("/artistIncomeService", artistIncomeService);
/******************以上为受保护的API END******************/
passport.use(new LocalStrategy(
    function (username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            var sociaty_sql = "SELECT * FROM t_baofeng_account WHERE uuid=? AND userid=? LIMIT 1";
            db.query(sociaty_sql, [username, password], function (errs, rowss) {
                if (errs) {
                    return done(errs);
                }
                var user;
                user = rowss[0];
                user.code = 0;
                return done(null, user);
            });
        });
    }
));
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //判断请求类型
        req.logOut();
        if (req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest') {
            res.status(401).send("没有访问授权!");
        } else {
            res.redirect("/live/index.html");
        }
    }
}

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

app.listen(serverConfig.port, function () {
    console.info('http server started ' + serverConfig.port);
})

module.exports = app;
