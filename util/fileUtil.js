var fs = require('fs');
var url = require('url');
var http = require('http');
var gm=require('gm');
var commUtil=require('./commUtil.js');

// App variables
var file_url = 'http://upload.wikimedia.org/wikipedia/commons/4/4f/Big%26Small_edit_1.jpg';
var DOWNLOAD_DIR = 'public/temp/';
var TITLE_IMAGE_SIZE=300;

exports.httpGetImageFile = function(fileUrl,cb) {
    var subDir=commUtil.fromDateToStr(new Date(),'yyyyMMdd');
    var path=DOWNLOAD_DIR+subDir+'/';
    var fileName=commUtil.createUUID();
    var filePath=path+fileName;

    fs.exists(path, function (exists) {
        if(exists){
            downloadFile(fileUrl,filePath,fileName,cb);
        }else{
            fs.mkdir(path,function(){
                downloadFile(fileUrl,filePath,fileName,cb);
            });
        }
    });

};

function downloadFile(fileUrl,filePath,fileName,cb){
    var file = fs.createWriteStream(filePath);
    http.get(fileUrl, function(res) {
        res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
            cb(fileName);
        });
    });
}

exports.httpGetCoverFile = function(fileUrl,cb) {
    var fileName=commUtil.createUUID();
    var filePath=DOWNLOAD_DIR + fileName;
    var file = fs.createWriteStream(filePath);
    http.get(fileUrl, function(res) {
        res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
            handleCoverFile(fileName,cb);
        });
    });
};

function handleCoverFile(fileName,cb){
    var subDir=commUtil.fromDateToStr(new Date(),'yyyyMMdd');
    var path=DOWNLOAD_DIR+subDir+'/';
    var filePath=DOWNLOAD_DIR+fileName;
    var newFilePath=path+fileName;
    fs.exists(path, function (exists) {
        if(exists){
            convertCover(filePath,newFilePath,cb);
        }else{
            fs.mkdir(path,function(){
                convertCover(filePath,newFilePath,cb);
            });
        }
    });
}

function convertCover(filePath,newFilePath,cb){
    var gmFile=gm(filePath);
    gmFile.thumb(TITLE_IMAGE_SIZE, TITLE_IMAGE_SIZE,newFilePath,50,function(err){
        if (err) {
            fs.unlink(filePath);
        }else{
            fs.unlink(filePath);
        }
        cb(newFilePath);
    });
}

