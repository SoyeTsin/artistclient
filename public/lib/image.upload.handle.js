function SingleImageUploadHandle(options){
    this.uploadButtonId=options.uploadButtonId;
    this.uploadButtonImage=options.uploadButtonImage;
    this.defaultUploadButtonImage=options.uploadButtonImage;
    this.width=options.width;
    this.height=options.height;
    this.changeBackground=options.changeBackground;
    this.onProgress=options.onProgress;
    this.onComplete=options.onComplete;

    this.imageUrl=null;

    this.init=function(){
        var _this=this;
        $('#'+this.uploadButtonId).css('height',this.height+'px ');
        $('#'+this.uploadButtonId).css('width',this.width+'px ');
        $('#'+this.uploadButtonId).append('<div id="'+this.uploadButtonId+'b'+'" style="border:0;height:'+this.height+'px;width:'+this.width+'px"></div>');
        $('#'+this.uploadButtonId).append('<div id="'+this.uploadButtonId+'q'+'" style="display:none;margin-left: 95px;" ></div>');
        $('#'+this.uploadButtonId).css('background','url('+this.uploadButtonImage+')');
        $('#'+this.uploadButtonId).css('background-size',this.height+'px '+this.width+'px');
        $('#'+this.uploadButtonId+'b').uploadify({
            'swf'      : 'lib/uploadify.swf',
            'formData':{
                'isCover':false
            },
            'uploader' : '/upload/image',
            'fileTypeExts':'*.jpg;*.jpeg;*.gif;*.png;',
            'checkExisting':false,
            'buttonText': '',
            'width':this.width ,
            'height':this.height,
            'removeCompleted':true,
            'removeTimeout':1,
            'queueID':this.uploadButtonId+'q',
            'multi':false,
            onUploadProgress:function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal){
                var progress=Math.round((bytesUploaded*100/bytesTotal));
                if(_this.onProgress){
                    _this.onProgress(progress);
                }
            },
            'onUploadSuccess':function(file, data, response){
                data = eval( '('+ data +')');
                _this.imageUrl=null;
                if(!data.errorCode){
                    _this.setImageUrl(data.fileUrl);
                }
                if(_this.onComplete){
                    _this.onComplete(_this.imageUrl);
                }
            }
        });
    }

    this.setImageUrl=function(imageUrl){
        this.imageUrl = imageUrl;
        if(this.changeBackground){
            var url=this.imageUrl;
            if(!url){
                url=this.defaultUploadButtonImage;
            }
            $('#'+this.uploadButtonId).css('background','url('+url+') center center no-repeat');
            $('#'+this.uploadButtonId).css('background-size',this.width+'px');
        }
    }
    this.init();
}

function ImageUploadHandle(options){
    this.picDataList=new Array();
    this.imageUploadButtonId=options.imageUploadButtonId;
    this.buttonHiddenContainer=options.buttonHiddenContainer;
    this.imageProgressDivId=options.imageProgressDivId;
    this.cellDivPreid=options.cellDivPreid;

    this.preViewIconRect={width:options.width,height:options.height};
    this.maxCount=options.maxCount;

    this.originalTop=options.originalTop;
    this.originalLeft=options.originalLeft;
    this.rowNumber=options.rowNumber;
    this.hOffset=options.hOffset;
    this.vOffset=options.vOffset;

    this.onNewImageFile=options.onNewImageFile;
    this.onUploadProgress=options.onUploadProgress;
    this.onUploadSuccess=options.onUploadSuccess;

    this.imageUploadButton=null;
    this.imageIndex=0;
    this.imageUploadButtonConvert=null;

    this.init=function(){
        this.initUpload();
        this.imageUploadButton=$('#'+this.buttonHiddenContainer);
    }

    this.initUpload=function(){
        var _this=this;
        $('#'+this.imageUploadButtonId).uploadify({
            'swf'      : 'lib/uploadify.swf',
            'uploader' : '/upload/image',
            'buttonText': '',
            'checkExisting':false,
            'buttonImage':'img/up_imgs.png',
            'fileTypeExts':'*.jpg;*.jpeg;*.gif;*.png;',
            'width':130,
            'height':204,
            'multi':false,
            'removeCompleted':true,
            'removeTimeout':1,
            'queueID':_this.imageProgressDivId,
            'onUploadProgress':function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal){
                //$('#imageProgressDisplayDivId').html(bytesUploaded);
                if(_this.onUploadProgress){
                    _this.onUploadProgress(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal);
                }
            },
            'onUploadSuccess':function(file, data, response){
                data = eval( '('+ data +')');
                if(data.errorCode){
                    alert('无效的图片格式');
                    return;
                }
                var url = data.fileUrl;
                _this.afterImageUpload(url,null);
                if(_this.onNewImageFile){
                    _this.onNewImageFile(url);
                }
                if(_this.onUploadSuccess){
                    _this.onUploadSuccess(url);
                }
            }
        });
    }
    this.convertPosition=function(index){
        if(this.imageUploadButtonConvert!=null){
            this.imageUploadButtonConvert.remove();
            this.imageUploadButtonConvert=null;
        }
        var col=index-1;
        var row=parseInt(col/this.rowNumber);
        col=col-row*this.rowNumber;
        if(index>this.maxCount){
            //$("#"+_this.buttonHiddenContainer).append(_this.imageUploadButton);
            this.imageUploadButton.css('left','-900px');
        }else{
            //$("#"+_this.cellDivPreid+ nextCellIndex).append(_this.imageUploadButton);
            this.imageUploadButton.css('left',(col*this.hOffset+this.originalLeft)+'px');
            this.imageUploadButton.css('top',(row*this.vOffset+this.originalTop)+'px');
            if(col==0){
                var divIndex=row*this.rowNumber+col;
                $('#imageListCell'+index).append('<div id="imageUploadButtonConvert" style="border:0;height:204px;width:130px"></div>');
                this.imageUploadButtonConvert=$('#imageUploadButtonConvert');
            }
        }
    }

    this.setImageUrls=function(imageList){
        this.picDataList=new Array();
        this.imageIndex=0;
        this.imageUploadButtonConvert=null;
        for(var i=0;i<this.maxCount;i++){
            $("#"+this.cellDivPreid+ (i+1)).html("");
        }
        for(var i=0;i<imageList.length;i++){
            this.afterImageUpload(imageList[i],null);
        }
    }

    this.afterImageUpload=function(url,pointArray){
        var _this=this;
        this.imageIndex++;
        var id=this.imageIndex;
        var newImageData={id:id,url:url,picData:pointArray};
        this.picDataList.push(newImageData);
        preload(url,function(img){
            var imageRect={width:img.width,height:img.height};
            var picData=findPicDataById(id,_this.picDataList);
            var displayParam=convertImage(_this.preViewIconRect,imageRect,picData);
            var imgStr='<div id="imageIconDiv'+id+'" data-source="'+url+'" style="cursor:pointer; border:0; width:' + _this.preViewIconRect.width + 'px; height:' + _this.preViewIconRect.height + 'px; background-image: url(' + url + '); background-size:' + displayParam.width + 'px ' + displayParam.height + 'px;background-position: -' + displayParam.x + 'px -' + displayParam.y + 'px; background-repeat: no-repeat;"></div>';
            var cellIndex=getPicDataIndex(id,_this.picDataList)+1;
            var nextCellIndex=cellIndex+1;
            _this.convertPosition(nextCellIndex);
            $("#"+_this.cellDivPreid+ cellIndex).append($("<span id='delIconDiv"+id+"' class='upih'><b></b><i>del</i></span>")); //增加删除按钮和灰色背景元素(<b></b><i></i>)
            $("#"+_this.cellDivPreid+ cellIndex).append($(imgStr));

            //图片上传完成后，增加mouseover事件，点击删除功能
            $('#'+_this.cellDivPreid+cellIndex).bind('mouseover',function(){
                $(this).find('span').show();
            });

            $('#'+_this.cellDivPreid+cellIndex).find('span').find('i').bind('click',function(){
                _this.removeImg(id);
            });

            $('#'+_this.cellDivPreid+cellIndex).bind('mouseout',function(){
                $(this).find('span').hide();
            });
        });
    }

    this.displayPreview=function(id,url,screen,el){
        var picData=findPicDataById(id,this.picDataList);
        preload(url,function(img){
            var imageRect={width:img.width,height:img.height};
            var displayParam=convertImage(screen,imageRect,picData);
            if(!isIEBrowser()){
                $(el).css({'border':0,
                    'width': (screen.width + 'px'),
                    'height':(screen.height + 'px'),
                    'background-image': 'url(' + url + ')',
                    'background-size':displayParam.width + 'px ' + displayParam.height + 'px',
                    'background-position': '-' + displayParam.x + 'px -' + displayParam.y + 'px',
                    'background-repeat': 'no-repeat'});
            }else{
                $(el).css({'border':0,
                    'width': (screen.width + 'px'),
                    'height':(screen.height + 'px'),
                    'background-image': 'url(' + url + ')',
                    'background-size': 'cover',
                    'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+url+'",sizingMethod="scale");',
                    'background-position': '-' + displayParam.x + 'px -' + displayParam.y + 'px',
                    'background-repeat': 'no-repeat'});
            }
        });
    };

    this.removeImgDirect=function(id){
        var cellIndex=getPicDataIndex(id,this.picDataList)+1;
        $("#"+this.cellDivPreid+ cellIndex).html('');
        for(var i=0;i<this.picDataList.length;i++){
            if(this.picDataList[i].id>=id){
                if(i<this.picDataList.length-1){
                    var nextImageNode= $("#imageIconDiv"+(this.picDataList[i+1].id));
                    var nextDeleteNode= $("#delIconDiv"+(this.picDataList[i+1].id));
                    $("#"+this.cellDivPreid+(i+1)).append(nextImageNode);
                    $("#"+this.cellDivPreid+(i+1)).append(nextDeleteNode);
                }else if(i==this.picDataList.length-1){
                    //$("#delIconDiv"+(i+1)).remove();
                    this.convertPosition(i+1);
                    //$("#"+this.cellDivPreid+(i+1)).append(this.imageUploadButton);
                }
            }
        }
        deletePicDataById(id,this.picDataList);
    }

    this.removeImg=function(id,reSetFlag){
        var _this=this;
        if(!reSetFlag){//数据重置时批量删除 不进行确认
            _this.removeImgDirect(id);
        }else{
            _this.removeImgDirect(id);
        }
    }
    this.init();
}
function isIEBrowser(){
    var browser=navigator.appName
    var b_version=navigator.appVersion
    var version=b_version.split(";");
    var trim_Version=version[1].replace(/[ ]/g,"");
    if(browser=="Microsoft Internet Explorer"){
        if(trim_Version=="MSIE6.0")
        {
            return true;
        }
        else if(trim_Version=="MSIE7.0")
        {
            return true;
        }
        else if(trim_Version=="MSIE8.0")
        {
            return true;
        }
        else if(trim_Version=="MSIE9.0")
        {
            return true;
        }
        else if(trim_Version=="MSIE10.0")
        {
            return true;
        }
    }
    return false;
}
