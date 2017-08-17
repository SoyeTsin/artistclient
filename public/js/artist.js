//avalon.filters.artistScreenName = function (artistScreen) {
//    var artistScreenName = "";
//    if (artistScreen == "income.html") {
//        artistScreenName = "收入明细";
//    } else if (artistScreen == "channel.html") {
//        artistScreenName = "小窝查看";
//    } else if (artistScreen == "contract.html") {
//        artistScreenName = "签约管理";
//    } else if (artistScreen == "remove.html") {
//        artistScreenName = "解约管理";
//    }
//    return artistScreenName;
//}
avalon.filters.recommendFilters = function (recommend) {
    var recommendStr = "";
    var i = recommend * 1;
    if (i <= 0 || i == null) {
        recommendStr = "否";
    } else if (i > 0) {
        recommendStr = "是";
    }
    return recommendStr;
}
avalon.filters.channelNameFilters = function (channelName) {
    var recommendStr = "";
    if (channelName == null) {
        recommendStr = "否";
    } else {
        recommendStr = "是";
    }
    return recommendStr;
}
var artistModel = createModel('artist', function (modelName) {
    return avalon.define(modelName, function (vm) {
            vm.initState = 0;
            vm.channelList = {};
            vm.liveDate = function (date) {
                //计算出相差天数
                var days = Math.floor(date / (24 * 3600 * 1000))
                var leave1 = date % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000))
                var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
                var minutes = Math.floor(leave2 / (60 * 1000))
                var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
                var seconds = Math.round(leave3 / 1000)
                return (days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒")
            }
            vm.getArtistList = function () {
                ajaxPost("/artistService/getArtistList", {}, function (result) {
                    if (result.code == 0) {
                        vm.channelList = result.channelList;
                        vm.channelList.liveDate = vm.liveDate(vm.channelList.liveDate);
                        vm.channelList.yesLiveDate = '0天 0小时 0分钟 0秒';
                        ajaxPost("/artistService/getArtistList3", {}, function (result0) {
                            if (result0.code == 0) {
                                var yesLiveDate = result0.yesLiveDate;
                                vm.channelList.yesLiveDate = vm.liveDate(yesLiveDate);
                                vm.channelList.picturesUrl = _mainModel.user.$model.picturesUrl;

                            } else {
                                alert('个人信息查询失败！');
                            }
                        });
                    } else {
                        alert('个人信息查询失败！');
                    }
                });
            }
            vm.init = function () {
                if (vm.initState == 0) {
                    vm.getArtistList();
                    vm.initState = 1;
                }
            }
        }
    )
});

$(document).ready(function() {
	$(".artistTab li").click(function(){
		$(this).addClass("active").siblings("li").removeClass("active");
	})
});