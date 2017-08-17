var mailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

var smtpOptions = {
    host: "smtp.exmail.qq.com",
    secure : true,
    port: 465,
    auth: {
        user: "admin@kjifen.com",
        pass: "ds(*98-sd(23k"
    }
};

exports.sendEmail=function(from,to,subject,content){
    var smtp = mailer.createTransport(smtpTransport(smtpOptions));
    var mailOptions = {
        from:smtpOptions.auth.user,
        to:to,
        subject: subject,
        html: content
    }
    smtp.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        smtp.close();
    });
}