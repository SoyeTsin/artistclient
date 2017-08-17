var express = require('express');
var router = express.Router();
var path=require("path");

/**
 * 判断路径是否是需要授权页面 如果是则
 */
router.all('*', function(req, res,next) {
   var page= path.basename(req.url);
    var reg=/^auth[\w]*\.html$/;
   if(reg.test(page))
   {
       ensureAuthenticated(req,res,next);
   }else{
       next();
   }
});

//验证权限
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect("/src/login.html");
    }
}

module.exports = router;
