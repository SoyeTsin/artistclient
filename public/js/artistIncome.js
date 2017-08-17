/**
 * Created by Linyi on 2015/9/30 0030.
 */
var artistIncomeModel = createModel('artistIncome', function (modelName) {
    return avalon.define(modelName, function (vm) {
            vm.sociatyLists = [];
            vm.sociaty = '';
            vm.sociatyId = ''
            vm.getSociatyList = function () {
                ajaxPost("/activeDataService/getSociatyList", {}, function (result) {
                    if (result.code == 0) {
                        vm.sociatyLists = result.sociatyLists;
                        vm.sociaty = vm.sociatyLists[0];
                        vm.sociatyId = vm.sociaty.rid;
                        //vm.getRoomIncome();
                        vm.getSociatyIncome();
                        vm.getArtistIncome();
                    } else {
                        swal("频道信息查询失败！", "", "error");
                    }
                });
            }
            vm.changeSelect = function (el) {
                vm.sociaty = el;
                vm.sociatyId = el.rid;
                vm.giveGiftListClone = [];
                //vm.getRoomIncome();
                vm.getSociatyIncome();
                vm.getArtistIncome();
            }
            vm.room_startDate = '';
            vm.room_endDate = '';
            vm.roomIncome = {};
            vm.roomIncomeYesIncome = '';
            vm.roomIncomeWeekIncome = '';
            vm.smsg = ''
            vm.rmsg = ''
            vm.sociaty_startDate = '';
            vm.sociaty_endDate = '';
            vm.sociatyIncome = '';
            vm.sociatyIncomeYesIncome = '';
            vm.sociatyIncomeWeekIncome = '';
            vm.sociatyIncomeCycleIncome = '加载中..';
            vm.getSociatyIncomeCycleIncome = function () {
                ajaxPost("/artistIncomeService/getSociatyIncomeList_a", {
                    date: {
                        sociatyList: vm.sociatyId,
                        startDate: vm.artistIncome_startDate,
                        endDate: vm.artistIncome_endDate
                    }
                }, function (result1) {
                    if (result1.code == 0) {
                        vm.sociatyIncomeCycleIncome = result1.income;
                    } else {
                        swal("收入查询失败！", "", "error");
                    }
                });
            };
            vm.getSociatyIncome = function () {
                vm.smsg = '加载中..'
                ajaxPost("/artistIncomeService/getSociatyIncomeList_a", {
                    date: {
                        sociatyList: vm.sociatyId,
                        startDate: '1900/01/01',
                        endDate: '2100/10/10'
                    }
                }, function (result) {
                    if (result.code == 0) {
                        vm.sociatyIncome = result.income;
                        _mainModel.sociatyIncome.sum = result.income;
                        vm.smsg = '加载中....'
                        var newDate = new Date();
                        newDate.setDate(newDate.getDate() - 1);
                        var startDate = newDate.format('yyyy/MM/dd');
                        ajaxPost("/artistIncomeService/getSociatyIncomeList_a", {
                            date: {
                                sociatyList: vm.sociatyId,
                                startDate: startDate,
                                endDate: startDate
                            }
                        }, function (result0) {//6212264000007474584
                            if (result0.code == 0) {
                                vm.sociatyIncomeYesIncome = result0.income;
                                _mainModel.sociatyIncome.yesDay = result0.income;
                                vm.smsg = '加载中......'
                                var startDate = getDataDay('lastWeekStart');
                                var endDate = getDataDay('lastWeekEnd');
                                ajaxPost("/artistIncomeService/getSociatyIncomeList_a", {
                                    date: {
                                        sociatyList: vm.sociatyId,
                                        startDate: startDate,
                                        endDate: endDate
                                    }
                                }, function (result1) {
                                    if (result1.code == 0) {
                                        vm.sociatyIncomeWeekIncome = result1.income;
                                        _mainModel.sociatyIncome.week = result1.income;
                                        vm.smsg = ''
                                    } else {
                                        swal("收入查询失败！", "", "error");
                                    }
                                });
                            } else {
                                swal("收入查询失败！", "", "error");
                            }
                        });
                    } else {
                        swal("收入查询失败！", "", "error");
                    }
                });
            }
            vm.sociatyIncomeAll = 0;
            vm.artistIncomeList = [];
            vm.artistIncomeListClone = [];
            vm.artistIncome_startDate = '';
            vm.artistIncome_endDate = '';
            vm.getCycleConsume = function () {
                vm.giveGiftListClone = [];
                vm.sociatyIncomeAll = 0;
                ajaxPost("/artistIncomeService/getArtistIncome_a", {
                    date: {
                        sociatyId: vm.sociatyId,
                        startDate: vm.artistIncome_startDate,
                        endDate: vm.artistIncome_endDate
                    }
                }, function (result) {
                    if (result.code == 0) {
                        vm.artistIncomeList = result.artistIncome;
                        vm.artistIncome_startDate = result.startDate;
                        vm.artistIncome_endDate = result.endDate;
                        vm.getSociatyIncomeCycleIncome();
                        for (var i in result.artistIncome) {
                            vm.sociatyIncomeAll += result.artistIncome[i].income;
                        }
                        vm.initPagination(vm.artistIncomeList.length);
                    } else {
                        swal("收入查询失败！", "", "error");
                    }
                });
            }
            vm.getArtistIncome = function () {
                vm.sociatyIncomeAll = 0;
                ajaxPost("/artistIncomeService/getArtistIncome_a", {
                    date: {
                        sociatyId: vm.sociatyId,
                        startDate: '',
                        endDate: ''
                    }
                }, function (result) {
                    if (result.code == 0) {
                        vm.artistIncomeList = result.artistIncome;
                        vm.artistIncome_startDate = result.startDate;
                        vm.artistIncome_endDate = result.endDate;
                        vm.getSociatyIncomeCycleIncome();
                        for (var i in result.artistIncome) {
                            vm.sociatyIncomeAll += result.artistIncome[i].income;
                        }
                        vm.initPagination(vm.artistIncomeList.length);
                    } else {
                        swal("收入查询失败！", "", "error");
                    }
                });
            }
            /**
             * 假分页
             */
            vm.countNum = 50;//总条数
            vm.pageTotal = 5;//总页数
            vm.pageNow = 1;//当前页
            vm.initPagination = function (c) {//分页功能初始化
                vm.artistIncomeListClone = [];
                vm.countNum = c;//总条数
                vm.pageTotal = (c - c % 10) / 10;//总页数
                if (c % 10 != 0) {
                    vm.pageTotal = vm.pageTotal + 1;
                }
                vm.pageNow = 1;//当前页
                if (c <= 10) {
                    for (var i = 0; i < c; i++) {
                        vm.artistIncomeListClone.push(vm.artistIncomeList[i]);
                    }
                } else if (c > 10) {
                    for (var i = 0; i < 10; i++) {
                        vm.artistIncomeListClone.push(vm.artistIncomeList[i]);
                    }
                }
            }
            vm.clickPage = function (e) {
                switch (parseInt(e)) {//parseInt(e)：e转化为int类型
                    case 0://首页
                        vm.initPagination(vm.artistIncomeList.length);
                        vm.pageNow = 1;
                        break;
                    case 1://上一页
                        if (vm.pageNow > 1) {
                            vm.pageNow = vm.pageNow - 1;
                            vm.artistIncomeListClone = [];
                            for (var i = (vm.pageNow - 1) * 10; i < ((vm.pageNow - 1) * 10) + 10; i++) {
                                if (vm.artistIncomeList[i]) {
                                    vm.artistIncomeListClone.push(vm.artistIncomeList[i]);
                                }
                            }
                        }
                        break;
                    case 2://下一页
                        if (vm.pageNow < vm.pageTotal) {
                            vm.artistIncomeListClone = [];
                            vm.pageNow = vm.pageNow + 1;
                            var a = 0;
                            for (var i = (vm.pageNow - 1) * 10; i < ((vm.pageNow - 1) * 10) + 10; i++) {
                                if (vm.artistIncomeList[i]) {
                                    vm.artistIncomeListClone.push(vm.artistIncomeList[i]);
                                }
                            }
                        }

                        break;
                    case 3://尾页
                        vm.pageNow = vm.pageTotal;
                        vm.artistIncomeListClone = [];
                        for (var i = (vm.countNum - vm.countNum % 10); i < vm.countNum; i++) {
                            if (vm.artistIncomeList[i]) {
                                vm.artistIncomeListClone.push(vm.artistIncomeList[i]);
                            }
                        }
                        if (vm.countNum % 10 == 0) {
                            for (var i = (vm.countNum - vm.countNum % 10); i < vm.countNum; i++) {
                                if (vm.artistIncomeList[i]) {
                                    vm.artistIncomeListClone.push(vm.artistIncomeList[i]);
                                }
                            }
                        }
                        break;
                }
            }
            vm.skip = '';//页面跳转的页数
            vm.skipPage = function () {//页面跳转方法
                if (vm.skip <= vm.pageTotal) {
                    var a = 0;
                    if (vm.skip != '') {
                        a = parseInt(vm.skip);
                    }
                    if (a > 0 && a <= vm.pageTotal) {
                        vm.artistIncomeListClone = [];
                        for (var i = ( a - 1) * 10; i < ((a - 1) * 10) + 10; i++) {
                            if (vm.artistIncomeList[i]) {
                                vm.artistIncomeListClone.push(vm.artistIncomeList[i]);
                            }
                        }
                    }
                    vm.pageNow = vm.skip;//当前页
                } else {
                    swal("你想跳太阳去吗？？？", "", "error");
                }
            }
            /**
             * 分页结束
             */
            vm.getGiveGiftObj = {};
            vm.selArtIncome = function (el) {
                vm.getGiveGiftObj = el;
                vm.getGiveGiftList(el.uuid);
            }
            vm.giveGiftList = [];
            vm.giveGiftListClone = [];
        vm.yirenjiazai = "";
            vm.getGiveGiftList = function (uuid) {
                var data = {
                    start: vm.artistIncome_startDate, end: vm.artistIncome_endDate, uuid: uuid
                }
                vm.yirenjiazai = "加载中...(最多显示前2000条)";
                ajaxPost("/artistIncomeService/getGiveGiftList_bb", {data: data}, function (result) {
                    if (result.code == 0) {
                        vm.yirenjiazai = "";
                        vm.giveGiftList = result.giveGiftList;
                        vm.initPagination2(vm.giveGiftList.length)
                    } else {
                        alert('营收明细查询失败！');
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
                vm.giveGiftListClone = [];
                vm.countNum2 = c;//总条数
                vm.pageTotal2 = (c - c % 10) / 10;//总页数
                if (c % 10 != 0) {
                    vm.pageTotal2 = vm.pageTotal2 + 1;
                }
                vm.pageNow2 = 1;//当前页
                if (c <= 10) {
                    for (var i = 0; i < c; i++) {
                        vm.giveGiftListClone.push(vm.giveGiftList[i]);
                    }
                } else if (c > 10) {
                    for (var i = 0; i < 10; i++) {
                        vm.giveGiftListClone.push(vm.giveGiftList[i]);
                    }
                }
            }
            vm.clickPage2 = function (e) {
                switch (parseInt(e)) {//parseInt(e)：e转化为int类型
                    case 0://首页
                        vm.initPagination2(vm.giveGiftList.length);
                        vm.pageNow2 = 1;
                        break;
                    case 1://上一页
                        if (vm.pageNow2 > 1) {
                            vm.pageNow2 = vm.pageNow2 - 1;
                            vm.giveGiftListClone = [];
                            for (var i = (vm.pageNow2 - 1) * 10; i < ((vm.pageNow2 - 1) * 10) + 10; i++) {
                                if (vm.giveGiftList[i]) {
                                    vm.giveGiftListClone.push(vm.giveGiftList[i]);
                                }
                            }
                        }
                        break;
                    case 2://下一页
                        if (vm.pageNow2 < vm.pageTotal2) {
                            vm.giveGiftListClone = [];
                            vm.pageNow2 = vm.pageNow2 + 1;
                            var a = 0;
                            for (var i = (vm.pageNow2 - 1) * 10; i < ((vm.pageNow2 - 1) * 10) + 10; i++) {
                                if (vm.giveGiftList[i]) {
                                    vm.giveGiftListClone.push(vm.giveGiftList[i]);
                                }
                            }
                        }

                        break;
                    case 3://尾页
                        vm.pageNow2 = vm.pageTotal2;
                        vm.giveGiftListClone = [];
                        for (var i = (vm.countNum2 - vm.countNum2 % 10); i < vm.countNum2; i++) {
                            if (vm.giveGiftList[i]) {
                                vm.giveGiftListClone.push(vm.giveGiftList[i]);
                            }
                        }
                        if (vm.countNum2 % 10 == 0) {
                            for (var i = (vm.countNum2 - 10); i < vm.countNum2; i++) {
                                if (vm.giveGiftList[i]) {
                                    vm.giveGiftListClone.push(vm.giveGiftList[i]);
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
                    vm.giveGiftListClone = [];
                    for (var i = ( a - 1) * 10; i < ((a - 1) * 10) + 10; i++) {
                        if (vm.giveGiftList[i]) {
                            vm.giveGiftListClone.push(vm.giveGiftList[i]);
                        }
                    }
                }
            }
            /**
             * 分页结束
             */
            /**
             * 重新获取房间数据
             * @param sociatyId
             */
            vm.getSociatyInit = function (sociatyId) {
                vm.sociaty = _mainModel.sociatyObj;
                vm.sociatyId = _mainModel.channelCode;
                vm.getSociatyIncome();
                vm.getArtistIncome();
            }
            vm.init = function () {
                vm.sociaty = _mainModel.sociatyObj;
                vm.sociatyId = _mainModel.channelCode;
                vm.getSociatyIncome();
                vm.getArtistIncome();
            }
        }
    )
});
//下拉
function pullDown(pullDown) {
    var pullDown = $(pullDown);
    var pullDownText = $(pullDown).find("span");
    pullDown.find("ul").hide();
    //pullDownText.text(pullDown.find("ul").find("li:first-child").text())
    pullDownText.click(function () {
        $(this).siblings("ul").slideToggle(100)
        $(this).siblings("ul").find("li").click(function () {
            pullDownText.text($(this).text())
            $(this).parents("ul").hide();
        })
    })
}

pullDown("#activeDataPull");
function layDate2() {
    var start = {
        elem: '#arisIncomeStart2',
        format: 'YYYY/MM/DD',
        min: '1900-06-16 23:59:59', //设定最小日期为当前日期
        max: laydate.now(), //最大日期
        istime: true,
        istoday: true,
        choose: function (datas) {
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas //将结束日的初始值设定为开始日
        }
    };
    var end = {
        elem: '#arisIncomeEnd2',
        format: 'YYYY/MM/DD',
        min: laydate.now(),
        max: '2099-06-16 23:59:59',
        istime: true,
        istoday: true,
        choose: function (datas) {
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };
    //laydate.skin('huanglv')
    laydate(start);
    laydate(end);
}
layDate2();

$(document).ready(function (e) {
    $(".tabAddStyle a").click(function () {
        $(".tabAddStyle a").removeClass("active");
        $(this).addClass("active");
    })
});