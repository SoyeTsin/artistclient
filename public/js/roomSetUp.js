/**
 * Created by Linyi on 2015/8/19 0019.
 */
var roomSetUpModel = createModel('roomSetUp', function (modelName) {
    return avalon.define(modelName, function (vm) {
            vm.channelState = {};
            vm.checkboxLong = [];
            vm.getChannelState = function (channelId) {
                ajaxPost("/roomSetUpService/getChannelState", {channelId: channelId}, function (result) {
                    if (result.code == 0) {
                        vm.channelState = result.channelState;
                        if (vm.channelState) {
                            vm.checkboxState(vm.channelState);
                            vm.speakTimeLimit = vm.channelState.speakTimeLimit;
                            vm.speakSpeedLimit = vm.channelState.speakSpeedLimit;
                            vm.speakLengthLimit = vm.channelState.speakLengthLimit;
                        }
                    } else {
                        swal("查询失败", "", "error");
                    }
                });
            }
            vm.sociatyObj = {};
            vm.sociatyList = [];
            vm.sociatyListState = 0;
            vm.getSociatyList = function () {
                vm.sociatyObj = {sociatyId: _mainModel.channelCode};
                vm.getChannelState(vm.sociatyObj.sociatyId);
                vm.getChannelAdmin(vm.sociatyObj.sociatyId);
            }
            vm.getSociatyInit = function (sociatyId) {
                for (var i = 0; i < vm.sociatyList.length; i++) {
                    if (sociatyId == vm.sociatyList[i].$model.sociatyId) {
                        vm.sociatyObj = vm.sociatyList[i];

                    }
                }
                vm.getChannelState(sociatyId);
                vm.getChannelAdmin(sociatyId);

            }
            vm.checkboxState = function (channelState) {
                if (channelState.textLimit > 0) {
                    vm.checkboxLong.push('textLimit')
                }
                if (channelState.speakTimeLimit > 0) {
                    vm.checkboxLong.push('speakTimeLimit')
                }
                if (channelState.speakSpeedLimit > 0) {
                    vm.checkboxLong.push('speakSpeedLimit')
                }
                if (channelState.speakLengthLimit > 0) {
                    vm.checkboxLong.push('speakLengthLimit')
                }
            }
            vm.speakTimeLimit = 0;
            vm.speakSpeedLimit = 0;
            vm.speakLengthLimit = 0;
            vm.checkboxClick = function () {
                if (vm.channelState) {
                    vm.channelState.textLimit = 0;
                    vm.channelState.speakTimeLimit = 0;
                    vm.channelState.speakSpeedLimit = 0;
                    vm.channelState.speakLengthLimit = 0;
                }
                for (var i = 0; i < vm.checkboxLong.length; i++) {
                    if (vm.checkboxLong[i] == 'textLimit') {
                        vm.channelState.textLimit = 1;
                    }
                    if (vm.checkboxLong[i] == 'speakTimeLimit') {
                        vm.channelState.speakTimeLimit = vm.speakTimeLimit;
                    }
                    if (vm.checkboxLong[i] == 'speakSpeedLimit') {
                        vm.channelState.speakSpeedLimit = vm.speakSpeedLimit;
                    }
                    if (vm.checkboxLong[i] == 'speakLengthLimit') {
                        vm.channelState.speakLengthLimit = vm.speakLengthLimit;
                    }
                }
                //alert(JSON.stringify(vm.channelState.$model));
                ajaxPost("/roomSetUpService/updataChannelState", {channelState: vm.channelState.$model}, function (result) {
                    if (result.code == 0) {
                        alert('修改成功');
                    } else {
                        swal("查询失败", "", "error");
                    }
                });
            }
            /**
             * 管理员列表
             */
            vm.channelAdminList = [];
            vm.channelAdminListClone = [];
            vm.getChannelAdmin = function (channelId) {
                ajaxPost("/roomSetUpService/getChannelAdmin", {channelId: channelId}, function (result) {
                    if (result.code == 0) {
                        vm.channelAdminList = result.channelAdminList;
                        vm.initPagination2(vm.channelAdminList.length);
                    } else {
                        swal("查询失败", "", "error");
                    }
                });
            }
            vm.delChannelAdmin = function (el, $remove) {
                ajaxPost("/roomSetUpService/delChannelAdmin", {channelAdminList: el.$model}, function (result) {
                    if (result.code == 0) {
                        $remove();
                        alert('撤销成功');
                    } else {
                        swal("查询失败", "", "error");
                    }
                });
            }
            /**
             * 假分页2
             */
            vm.countNum2 = 50;//总条数
            vm.pageTotal2 = 5;//总页数
            vm.pageNow2 = 1;//当前页
            vm.listLast2 = [];
            vm.initPagination2 = function (c) {//分页功能初始化
                vm.channelAdminListClone = [];
                vm.countNum2 = c;//总条数
                vm.pageTotal2 = (c - c % 10) / 10;//总页数
                if (c % 10 != 0) {
                    vm.pageTotal2 = vm.pageTotal2 + 1;
                }
                vm.pageNow2 = 1;//当前页
                if (c <= 10) {
                    for (var i = 0; i < c; i++) {
                        vm.channelAdminListClone.push(vm.channelAdminList[i]);
                    }
                } else if (c > 10) {
                    for (var i = 0; i < 10; i++) {
                        vm.channelAdminListClone.push(vm.channelAdminList[i]);
                    }
                }
            }
            vm.clickPage2 = function (e) {
                switch (parseInt(e)) {//parseInt(e)：e转化为int类型
                    case 0://首页
                        vm.initPagination2(vm.channelAdminList.length);
                        vm.pageNow2 = 1;
                        break;
                    case 1://上一页
                        if (vm.pageNow2 > 1) {
                            vm.pageNow2 = vm.pageNow2 - 1;
                            vm.channelAdminListClone = [];
                            for (var i = (vm.pageNow2 - 1) * 10; i < ((vm.pageNow2 - 1) * 10) + 10; i++) {
                                if (vm.channelAdminList[i]) {
                                    vm.channelAdminListClone.push(vm.channelAdminList[i]);
                                }
                            }
                        }
                        break;
                    case 2://下一页
                        if (vm.pageNow2 < vm.pageTotal2) {
                            vm.channelAdminListClone = [];
                            vm.pageNow2 = vm.pageNow2 + 1;
                            var a = 0;
                            for (var i = (vm.pageNow2 - 1) * 10; i < ((vm.pageNow2 - 1) * 10) + 10; i++) {
                                if (vm.channelAdminList[i]) {
                                    vm.channelAdminListClone.push(vm.channelAdminList[i]);
                                }
                            }
                        }

                        break;
                    case 3://尾页
                        vm.pageNow2 = vm.pageTotal2;
                        vm.channelAdminListClone = [];
                        for (var i = (vm.countNum2 - vm.countNum2 % 10); i < vm.countNum2; i++) {
                            if (vm.channelAdminList[i]) {
                                vm.channelAdminListClone.push(vm.channelAdminList[i]);
                            }
                        }
                        if (vm.countNum2 % 10 == 0) {
                            for (var i = (vm.countNum2 - 10); i < vm.countNum2; i++) {
                                if (vm.channelAdminList[i]) {
                                    vm.channelAdminListClone.push(vm.channelAdminList[i]);
                                }
                            }
                        }
                        break;
                }
            }
            vm.skip2 = '';//页面跳转的页数
            vm.skipPage2 = function () {//页面跳转方法
                var a = 0;
                if (vm.skip2 != '') {
                    a = parseInt(vm.skip2);
                }
                if (a > 0 && a <= vm.pageTotal2) {
                    vm.channelAdminListClone = [];
                    for (var i = ( a - 1) * 10; i < ((a - 1) * 10) + 10; i++) {
                        if (vm.channelAdminList[i]) {
                            vm.channelAdminListClone.push(vm.channelAdminList[i]);
                        }
                    }
                }
            }
            /**
             * 分页结束
             */
            vm.init = function () {
                vm.getSociatyList();
            }
        }
    )
});
$(document).ready(function () {
    $(".roomPucButtion a").click(function () {
        $(this).addClass("active").siblings("a").removeClass("active");
    })
});
