function preload(url,cb){
    var img = new Image();
    img.src = url;
    if (img.complete){
        cb(img);
    }
    else {
        img.onload = function () {
            cb(img);
        };
    }
}

function findPicpointById(index,dopicArray){
    var id=index;
    var result=null;
    for(var i=0;i<dopicArray.length;i++){
        if(id==dopicArray[i].liIndex){
            result=dopicArray[i].pointArray;
            break;
        }
    }
    return result;
}

function findPicDataById(index,picDataList){
    var result=null;
    for(var i=0;i<picDataList.length;i++){
        if(index==picDataList[i].id){
            result=picDataList[i].picData;
            break;
        }
    }
    return result;
}

function getNextPageId(index,picDataList){
    var result=getPicDataIndex(index,picDataList);
    if(result==(picDataList.length-1)){
        result=0;
    }
    else{
        result++;
    }
    result=picDataList[result].id;
    return result;
}

function getPicDataIndex(id,picDataList){
    var result=0;
    for(var i=0;i<picDataList.length;i++){
        if(id==picDataList[i].id){
            result=i;
            break;
        }
    }
    return result;
}

function deletePicDataById(index,picDataList){
    for(var i=0;i<picDataList.length;i++){
        if(index==picDataList[i].id){
            picDataList.splice(i,1);
            break;
        }
    }
}

function convertImage(screen,imageRect,picdata){
    var displayParam=null;
    if(picdata!=null){
        var scale = screen.width / picdata.w;
        var screenInImageRectHeight=screen.height/scale;
        var heightOffset=Math.abs((picdata.h-screenInImageRectHeight)/2);
        displayParam= {width: (imageRect.width * scale), height: (imageRect.height * scale),x: (picdata.x * scale), y: ((picdata.y+heightOffset) * scale)};
    }
    else{
        var bigScreen={width:screen.width,height:(screen.width*1024/640)};
        var scaleW=bigScreen.width/imageRect.width;
        var scaleH=bigScreen.height/imageRect.height;
        var scale=scaleH>scaleW?scaleH:scaleW;
        var newRect={width: (imageRect.width * scale), height: (imageRect.height * scale)};
        var newX=Math.abs(Math.round((newRect.width-screen.width)/2));
        var newY=Math.abs(Math.round((newRect.height-screen.height)/2));
        displayParam = {width:newRect.width,height:newRect.height,x:newX,y:newY};
    }
    return displayParam;
}

function displayImageAsList(files,colNum,parentDiv,onclickMethod){
    var fileLen = files.length;
    var lastIndex = 0;
    var lastCol = lastIndex % colNum > 0 ? (parseInt(lastIndex / colNum) + 1) : (parseInt(lastIndex / colNum));
    var screenWidth = document.body.clientWidth / colNum * 0.9;
    var screenHeight = screenWidth / 80 * 128;
    $("#"+parentDiv).html("");
    for (var i = 0; i < files.length; i++) {
        lastIndex++;
        var thisColDiv = null;
        if (lastIndex % colNum == 1 && (lastIndex <= 16)) {
            lastCol++;
            thisColDiv = '<div id="imagesListColDiv' + lastCol + '" class="row" style="height:' + screenHeight * 1.1 + 'px;"></div>';
            $("#"+parentDiv).append(thisColDiv);
            for (var j = 0; j < colNum; j++) {
                var thisCellDiv = '<div class="col-25" style="text-align:center;border:0px;width:' + screenWidth + 'px;height:' + screenHeight * 1.1 + 'px;" id="imagesListCellDiv' + (lastIndex + j) + '"></div>';
                $("#imagesListColDiv" + lastCol).append(thisCellDiv);
            }
        }
        addImageToList(files[i],lastIndex,colNum,onclickMethod);
    }
}
function addImageToList(url,completedIndex,colNum,onclickMethod) {
    preload(url, function (img) {
        var screenWidth = document.body.clientWidth / colNum * 0.9;
        var screen = {width: screenWidth, height: screenWidth / 80 * 128};
        var imageRect = {width: img.width, height: img.height};
        var picData = null;
        var displayParam = convertImage(screen, imageRect, picData);
        var paramData = {
            index: completedIndex,
            url: url
        };
        var imgStr = '<div style="width: ' + screen.width + 'px; height:' + screen.height + 'px;background-color:#000000"><div onclick="'+onclickMethod+'('+completedIndex+',&quot;' + paramData.url + '&quot;);" style="cursor:pointer; border:0; width: ' + screen.width + 'px; height:' + screen.height + 'px; background-image: url(' + url + '); background-size:' + displayParam.width + 'px ' + displayParam.height + 'px;background-position: -' + displayParam.x + 'px -' + displayParam.y + 'px; background-repeat: no-repeat;"></div></div>';
        if (imageRect.width > imageRect.height) {
            var newScreen = {width: screen.width, height: imageRect.height * (screen.width / imageRect.width)};
            var newRect = newScreen;
            var newImagePoint = {top: Math.abs((screen.height - newScreen.height) / 2), left: 0};
            var imgStr = '<div style="width: ' + screen.width + 'px; height:' + screen.height + 'px;background-color:#000000"><div onclick="'+onclickMethod+'('+completedIndex+',&quot;' + paramData.url + '&quot;);" style="position: relative;top:' + newImagePoint.top + 'px;cursor:pointer; border:0; width: ' + newScreen.width + 'px; height:' + newScreen.height + 'px; background-image: url(' + url + '); background-size:' + newScreen.width + 'px ' + newScreen.height + 'px;background-position: -0px -0px; background-repeat: no-repeat;"></div></div>';
        }
        $('#imagesListCellDiv' + completedIndex).html(imgStr);
    });
}
