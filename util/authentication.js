var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var QQStrategy = require('passport-qq').Strategy;
var SinaStrategy = require('passport-sina').Strategy;
var weixinUtil = require('../util/weixinUtil');
var UserDao = require('../models/userDao.js');
var userDao = new UserDao();
var config = require('../conf/oauth');

passport.use('local', new LocalStrategy({usernameField: "email", passwordField: "password"},
    function (email, password, done) {
        userDao.login(email, password, function (result) {
            if (!result.user) {
                return done(null, false, { message: result.reason });
            }
            else {
                return done(null, result.user);
            }
        });
    }
));

exports.authenticateWx = function (req, res, next) {
    var url = config.wx.url;
    var appid = config.wx.clientID;
    var response_type = "code";
    var scope = "snsapi_login";
    var state = Date.now() + "";
    var callbackUri = config.wx.callbackURL;
    url = url + "?appid=" + appid + "&redirect_uri=" + callbackUri + "&response_type=" + response_type + "&scope=" + scope + "&state" + state;
    res.redirect(url);
}

exports.wxCallback = function (req, res, next) {



}


passport.use(new SinaStrategy({
        clientID: config.sina.clientID,
        clientSecret: config.sina.clientSecret,
        callbackURL: config.sina.callbackURL},
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // To keep the example simple, the user's qq profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the qq account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }));


passport.use(new QQStrategy({
        clientID: config.qq.appKey,
        clientSecret: config.qq.appSecret,
        callbackURL: config.qq.callbackURL},
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // To keep the example simple, the user's qq profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the qq account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));