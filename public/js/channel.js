/**
 * Created by Linyi on 2015/6/2 0002.
 */
avalon.filters.formatRecommend = function (value) {
    var result = "";
    if (value == 0) {
        result = "否";
    } else {
        result = "是";
    }
    return result;
}
var channelModel = createModel('channel', function (modelName) {
    return avalon.define(modelName, function (vm) {
            vm.channelList = [];
            vm.channelState = 1;
            vm.initState = 0;
            vm.channelApply = function () {
                vm.channelState = vm.channelState == 0 ? 1 : 0;
            }
            vm.getGiveGiftList = function () {
                ajaxPost("/channelService/getChannelList", {}, function (result) {
                    if (result.code == 0) {
                        vm.channelList = result.channelList;
                    } else {
                        alert('频道信息查询失败！');
                    }
                });
            }
            vm.init = function () {
                if (vm.initState == 0) {
                    vm.getGiveGiftList();
                    vm.initState = 1;
                }
            }
        }
    )
});