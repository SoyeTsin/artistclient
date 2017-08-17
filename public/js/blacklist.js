/**
 * Created by Linyi on 2015/8/20 0020.
 */
var blacklistModel = createModel('blacklist', function (modelName) {
    return avalon.define(modelName, function (vm) {
            vm.cycle = {startDate: '', endDate: ''}
            vm.getCycleBlacklist = function () {
                var sociatyId = '';
                if (_mainModel.initSociatyId == '') {
                    sociatyId = _mainModel.sociatyList[0].sociatyId;
                } else {
                    sociatyId = _mainModel.initSociatyId;
                }
                ajaxPost("/blacklistService/getCycleBlacklist", {
                    data: {
                        sociatyId: sociatyId,
                        cycle: vm.cycle.$model
                    }
                }, function (result) {
                    if (result.code == 0) {
                        vm.blacklistList = result.blacklistList;
                        vm.initPagination2(vm.blacklistList.length)
                    } else {
                        alert('查询失败！');
                    }
                });
            }
            vm.sociatyObj = {};
            vm.sociatyList = [];
            vm.sociatyListState = 0;
            vm.getSociatyList = function () {
                //vm.sociatyList = _mainModel.sociatyList;
                //if (vm.sociatyList.length == 0) {
                //    vm.sociatyListState = 1
                //} else {
                //    vm.sociatyObj = vm.sociatyList[0];
                //    vm.getBlacklist(vm.sociatyObj.sociatyId);
                //}
                vm.sociatyObj = {sociatyId: _mainModel.channelCode};
                vm.getBlacklist(vm.sociatyObj.sociatyId);
            }
            vm.getSociatyInit = function (sociatyId) {
                for (var i = 0; i < vm.sociatyList.length; i++) {
                    if (sociatyId == vm.sociatyList[i].$model.sociatyId) {
                        vm.sociatyObj = vm.sociatyList[i];

                    }
                }
                vm.getBlacklist(sociatyId);
            }
            vm.blacklistList = []
            vm.blacklistListClone = []
            vm.getBlacklist = function (channelId) {
                ajaxPost("/blacklistService/getBlacklist", {channelId: channelId}, function (result) {
                    if (result.code == 0) {
                        vm.blacklistList = result.blacklistList;
                        vm.initPagination2(vm.blacklistList.length)
                    } else {
                        alert('查询失败！');
                    }
                });
            }
            vm.delBlacklist = function (el, $remove) {
                ajaxPost("/blacklistService/delBlacklist", {blacklist: el.$model}, function (result) {
                    if (result.code == 0) {
                        $remove();
                        alert('解封成功！');
                    } else {
                        alert('解封失败！');
                    }
                });
            }
            /**
             * 搜索功能
             */
            vm.searchId = '';
            vm.clone = [];
            vm.search = function () {
                if (vm.clone.length == 0) {
                    vm.clone = vm.blacklistList;
                }
                if (vm.blacklistList.$model.length < vm.clone.length) {
                    vm.blacklistList = vm.clone;
                }
                if (vm.searchId != '') {
                    vm.blacklistListClone = [];
                    for (var i = 0; i < vm.blacklistList.length; i++) {
                        var str = vm.blacklistList[i].nickName.toString();
                        if (str.indexOf(vm.searchId) >= 0) {
                            vm.blacklistListClone.push(vm.blacklistList[i]);
                        }
                    }
                    vm.blacklistList = vm.blacklistListClone;
                    vm.initPagination2(vm.blacklistListClone.length);
                    vm.searchId = '';
                } else {
                    vm.blacklistList = vm.clone;
                    vm.initPagination2(vm.blacklistList.length);
                }
            }
            /**
             * 搜索功能结束
             */

            /**
             * 搜索功能
             */
            vm.searchId2 = '';
            vm.clone2 = [];
            vm.search2 = function () {
                if (vm.clone2.length == 0) {
                    vm.clone2 = vm.blacklistList;
                }
                if (vm.blacklistList.$model.length < vm.clone2.length) {
                    vm.blacklistList = vm.clone2;
                }
                if (vm.searchId2 != '') {
                    vm.blacklistListClone = [];
                    for (var i = 0; i < vm.blacklistList.length; i++) {
                        var str = vm.blacklistList[i].uuid.toString();
                        if (str.indexOf(vm.searchId2) >= 0) {
                            vm.blacklistListClone.push(vm.blacklistList[i]);
                        }
                    }
                    vm.blacklistList = vm.blacklistListClone;
                    vm.initPagination2(vm.blacklistListClone.length);
                    vm.searchId2 = '';
                } else {
                    vm.blacklistList = vm.clone2;
                    vm.initPagination2(vm.blacklistList.length);
                }
            }
            /**
             * 搜索功能结束
             */
            /**
             * 假分页2
             */
            vm.countNum2 = 50;//总条数
            vm.pageTotal2 = 5;//总页数
            vm.pageNow2 = 1;//当前页
            vm.listLast2 = [];
            vm.initPagination2 = function (c) {//分页功能初始化
                vm.blacklistListClone = [];
                vm.countNum2 = c;//总条数
                vm.pageTotal2 = (c - c % 10) / 10;//总页数
                if (c % 10 != 0) {
                    vm.pageTotal2 = vm.pageTotal2 + 1;
                }
                vm.pageNow2 = 1;//当前页
                if (c <= 10) {
                    for (var i = 0; i < c; i++) {
                        vm.blacklistListClone.push(vm.blacklistList[i]);
                    }
                } else if (c > 10) {
                    for (var i = 0; i < 10; i++) {
                        vm.blacklistListClone.push(vm.blacklistList[i]);
                    }
                }
            }
            vm.clickPage2 = function (e) {
                switch (parseInt(e)) {//parseInt(e)：e转化为int类型
                    case 0://首页
                        vm.initPagination2(vm.blacklistList.length);
                        vm.pageNow2 = 1;
                        break;
                    case 1://上一页
                        if (vm.pageNow2 > 1) {
                            vm.pageNow2 = vm.pageNow2 - 1;
                            vm.blacklistListClone = [];
                            for (var i = (vm.pageNow2 - 1) * 10; i < ((vm.pageNow2 - 1) * 10) + 10; i++) {
                                if (vm.blacklistList[i]) {
                                    vm.blacklistListClone.push(vm.blacklistList[i]);
                                }
                            }
                        }
                        break;
                    case 2://下一页
                        if (vm.pageNow2 < vm.pageTotal2) {
                            vm.blacklistListClone = [];
                            vm.pageNow2 = vm.pageNow2 + 1;
                            var a = 0;
                            for (var i = (vm.pageNow2 - 1) * 10; i < ((vm.pageNow2 - 1) * 10) + 10; i++) {
                                if (vm.blacklistList[i]) {
                                    vm.blacklistListClone.push(vm.blacklistList[i]);
                                }
                            }
                        }

                        break;
                    case 3://尾页
                        vm.pageNow2 = vm.pageTotal2;
                        vm.blacklistListClone = [];
                        for (var i = (vm.countNum2 - vm.countNum2 % 10); i < vm.countNum2; i++) {
                            if (vm.blacklistList[i]) {
                                vm.blacklistListClone.push(vm.blacklistList[i]);
                            }
                        }
                        if (vm.countNum2 % 10 == 0) {
                            for (var i = (vm.countNum2 - 10); i < vm.countNum2; i++) {
                                if (vm.blacklistList[i]) {
                                    vm.blacklistListClone.push(vm.blacklistList[i]);
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
                    vm.blacklistListClone = [];
                    for (var i = ( a - 1) * 10; i < ((a - 1) * 10) + 10; i++) {
                        if (vm.blacklistList[i]) {
                            vm.blacklistListClone.push(vm.blacklistList[i]);
                        }
                    }
                }
            }
            vm.checkboxLong = [];
            vm.porMun = 0;
            vm.allCheckboxState = 0;
            vm.allCheckbox = function () {
                vm.checkboxLong = [];
                if (vm.allCheckboxState == 0) {
                    for (var i = 0; i < vm.blacklistListClone.length; i++) {
                        vm.checkboxLong.push(vm.blacklistListClone[i].uuid)
                    }
                } else {
                    vm.checkboxLong = [];
                }
                vm.allCheckboxState = vm.allCheckboxState == 0 ? 1 : 0;
            }
            vm.checkboxLongMun = function () {
                vm.porMun = vm.checkboxLong.length;
            }
            vm.cleanBox = function () {

            }
            vm.delBlacklists = function () {
                var blacklistListClones = [];
                for (var i = 0; i < vm.checkboxLong.length; i++) {
                    for (var j = 0; j < vm.checkboxLong.length; j++) {
                        if (vm.blacklistListClone[i].uuid == vm.checkboxLong[j]) {
                            blacklistListClones.push(vm.blacklistListClone[i].$model);
                        }
                    }
                }
                ajaxPost("/blacklistService/delBlacklists", {blacklistListClones: blacklistListClones}, function (result) {
                    if (result.code == 0) {
                        vm.getBlacklist();
                        alert('解封成功！');
                    } else {
                        alert('解封失败！');
                    }
                });
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
layDate();
function layDate() {
    var start = {
        elem: '#blackStart',
        format: 'YYYY-MM-DD',
        min: '2000-01-01 00:00:00', //设定最小日期为当前日期
        max: '2099-12-31 23:59:59', //最大日期
        istime: true,
        istoday: true,
        choose: function (datas) {
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas //将结束日的初始值设定为开始日
        }
    };
    var end = {
        elem: '#end',
        format: 'YYYY-MM-DD',
        min: laydate.now(),
        max: '2099-12-31 23:59:59', //最大日期
        istime: true,
        istoday: true,
        choose: function (datas) {
            start.max = datas; //结束日选好后，重置开始日的最大日期
            blacklistModel.getCycleBlacklist();
        }
    };
    //laydate.skin('huanglv')
    laydate(start);
    laydate(end);
}

$(document).ready(function() {
    $(".tabAddStyle li a").click(function(){
			$(".tabAddStyle li a").removeClass("active");
			$(this).addClass("active");
		})
});