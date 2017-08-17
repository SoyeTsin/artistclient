/**
 * Created by Linyi on 2015/8/18 0018.
 */
var roomIncomeModel = createModel('roomIncome', function (modelName) {
    return avalon.define(modelName, function (vm) {
            vm.sociatyObj = {};
            vm.sociatyList = [];
            vm.sociatyListState = 0;
            vm.getSociatyInit = function (sociatyId) {
                vm.channelCode = _mainModel.channelCode;
                vm.getSociatyIncome(_mainModel.channelCode);
                vm.getArtistAssetList(_mainModel.channelCode);
            }
            vm.channelCode = '';
            vm.smsg = '加载中..'
            vm.sociatyIncome = {sum: 0, yesDay: 0, week: 0, asset: 0};
            vm.getSociatyIncome = function (sociatyList) {
                ajaxPost("/roomIncomeService/getSociatyIncomeList", {
                    date: {
                        sociatyList: sociatyList,
                        startDate: '1900/01/01',
                        endDate: '2100/10/10'
                    }
                }, function (result) {
                    if (result.code == 0) {
                        vm.sociatyIncome.sum = result.income;
                        _mainModel.sociatyIncome.sum = result.income;
                        vm.smsg = '加载中....'
                        var newDate = new Date();
                        newDate.setDate(newDate.getDate() - 1);
                        var startDate = newDate.toLocaleDateString();
                        ajaxPost("/roomIncomeService/getSociatyIncomeList", {
                            date: {
                                sociatyList: sociatyList,
                                startDate: startDate,
                                endDate: startDate
                            }
                        }, function (result0) {//6212264000007474584
                            if (result0.code == 0) {
                                vm.sociatyIncome.yesDay = result0.income;
                                _mainModel.sociatyIncome.yesDay = result0.income;
                                vm.smsg = '加载中......'
                                var startDate = getDataDay('lastWeekStart');
                                var endDate = getDataDay('lastWeekEnd');
                                ajaxPost("/roomIncomeService/getSociatyIncomeList", {
                                    date: {
                                        sociatyList: sociatyList,
                                        startDate: startDate,
                                        endDate: endDate
                                    }
                                }, function (result1) {
                                    if (result1.code == 0) {
                                        vm.sociatyIncome.week = result1.income;
                                        _mainModel.sociatyIncome.week = result1.income;
                                        //vm.getArtistAssetList(sociatyId);
                                        vm.smsg = ''
                                    } else {
                                        alert("收入查询失败！");
                                    }
                                });
                            } else {
                                alert("收入查询失败！");
                            }
                        });
                    } else {
                        alert("收入查询失败！");
                    }
                });
            }
            vm.sociatyLists = [];
            vm.getSociatyLists = function () {
                ajaxPost("/roomService/getSociatyList", {}, function (result) {
                    if (result.code == 0) {
                        vm.sociatyLists = result.sociatyList;
                        vm.sociatyinit = vm.sociatyLists[0].channelName || '';
                        if (vm.sociatyLists.length == 0) {
                            vm.sociatyListState = 1
                        } else {
                            vm.sociatyObj = vm.sociatyLists[0];
                            //vm.getArtistList(_mainModel.channelCode);
                        }
                    } else {
                        alert("频道信息查询失败！")
                    }
                });
            }
            vm.clickSociaty = function () {
                //vm.change(vm.clickSociatyObj)
                vm.getSociatyIncome(vm.channelCode);
                vm.getArtistAssetList(vm.channelCode)
            }
            //vm.getSociaty
            vm.artistAssetList = [];
            vm.artistAssetListClone = [];
            vm.getArtistAssetList = function (sociatyId) {
                ajaxPost("/roomIncomeService/getArtistAssetList", {sociatyId: sociatyId}, function (result) {
                    if (result.code == 0) {
                        vm.artistAssetList = result.artistAssetList;
                        vm.initPagination2(vm.artistAssetList.length)
                    } else {
                        alert('查询失败！');
                    }
                });
            }
            //排序
            vm.tip = function (el) {
                var max = 0;
                for (var i = 0; i < vm.artistAssetList.length; i++) {
                    if (vm.artistAssetList[i].desc2 > max) {
                        max = vm.artistAssetList[i].desc2;
                    }
                }
                var artistRefObj = {};
                artistRefObj.sociatyId = _mainModel.channelCode;
                artistRefObj.uuId = el.uuid;
                artistRefObj.desc2 = max + 1;
                vm.updataArtistRef(artistRefObj);
            }
            vm.up = function (el) {
                var desc2 = 0;
                for (var i = 0; i < vm.artistAssetList.length; i++) {
                    if (vm.artistAssetList[i].desc2 == el.desc2) {
                        if (i != 0) {
                            desc2 = vm.artistAssetList[i - 1].desc2;
                        }
                    }
                }
                var artistRefObj = {};
                artistRefObj.sociatyId = _mainModel.channelCode;
                artistRefObj.uuId = el.uuid;
                artistRefObj.desc2 = desc2 + 1;
                vm.updataArtistRef(artistRefObj);
            }
            vm.down = function (el) {
                var desc2 = 0;
                for (var i = 0; i < vm.artistAssetList.length; i++) {
                    if (vm.artistAssetList[i].desc2 == el.desc2) {
                        if (i != vm.artistAssetList.length) {
                            desc2 = vm.artistAssetList[i + 1].desc2;
                        }
                    }
                }
                var artistRefObj = {};
                artistRefObj.sociatyId = _mainModel.channelCode;
                artistRefObj.uuId = el.uuid;
                artistRefObj.desc2 = desc2 - 1;
                vm.updataArtistRef(artistRefObj);
            }
            vm.updataArtistRef = function (artistRefObj) {
                ajaxPost("/roomIncomeService/updataArtistRef", {artistRefObj: artistRefObj}, function (result) {
                    if (result.code == 0) {
                        vm.getArtistAssetList(_mainModel.channelCode);
                    } else {
                        swal("排序失败！", "", "error");
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
                vm.artistAssetListClone = [];
                vm.countNum2 = c;//总条数
                vm.pageTotal2 = (c - c % 10) / 10;//总页数
                if (c % 10 != 0) {
                    vm.pageTotal2 = vm.pageTotal2 + 1;
                }
                vm.pageNow2 = 1;//当前页
                if (c <= 10) {
                    for (var i = 0; i < c; i++) {
                        vm.artistAssetListClone.push(vm.artistAssetList[i]);
                    }
                } else if (c > 10) {
                    for (var i = 0; i < 10; i++) {
                        vm.artistAssetListClone.push(vm.artistAssetList[i]);
                    }
                }
            }
            vm.clickPage2 = function (e) {
                switch (parseInt(e)) {//parseInt(e)：e转化为int类型
                    case 0://首页
                        vm.initPagination2(vm.artistAssetList.length);
                        vm.pageNow2 = 1;
                        break;
                    case 1://上一页
                        if (vm.pageNow2 > 1) {
                            vm.pageNow2 = vm.pageNow2 - 1;
                            vm.artistAssetListClone = [];
                            for (var i = (vm.pageNow2 - 1) * 10; i < ((vm.pageNow2 - 1) * 10) + 10; i++) {
                                if (vm.artistAssetList[i]) {
                                    vm.artistAssetListClone.push(vm.artistAssetList[i]);
                                }
                            }
                        }
                        break;
                    case 2://下一页
                        if (vm.pageNow2 < vm.pageTotal2) {
                            vm.artistAssetListClone = [];
                            vm.pageNow2 = vm.pageNow2 + 1;
                            var a = 0;
                            for (var i = (vm.pageNow2 - 1) * 10; i < ((vm.pageNow2 - 1) * 10) + 10; i++) {
                                if (vm.artistAssetList[i]) {
                                    vm.artistAssetListClone.push(vm.artistAssetList[i]);
                                }
                            }
                        }

                        break;
                    case 3://尾页
                        vm.pageNow2 = vm.pageTotal2;
                        vm.artistAssetListClone = [];
                        for (var i = (vm.countNum2 - vm.countNum2 % 10); i < vm.countNum2; i++) {
                            if (vm.artistAssetList[i]) {
                                vm.artistAssetListClone.push(vm.artistAssetList[i]);
                            }
                        }
                        if (vm.countNum2 % 10 == 0) {
                            for (var i = (vm.countNum2 - 10); i < vm.countNum2; i++) {
                                if (vm.artistAssetList[i]) {
                                    vm.artistAssetListClone.push(vm.artistAssetList[i]);
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
                    vm.artistAssetListClone = [];
                    for (var i = ( a - 1) * 10; i < ((a - 1) * 10) + 10; i++) {
                        if (vm.artistAssetList[i]) {
                            vm.artistAssetListClone.push(vm.artistAssetList[i]);
                        }
                    }
                }
            }
            /**
             * 分页结束
             */
            vm.newDate = '';
            vm.newAsset = ''
            vm.change = function (sociatyId) {
                ajaxPost("/roomIncomeService/getNewAsset", {
                    data: {
                        sociatyId: sociatyId,
                        newDate: vm.newDate
                    }
                }, function (result) {
                    if (result.code == 0) {
                        vm.newAsset = result.newAsset;
                        vm.newDate = result.newDate;
                    } else {
                        swal("排序失败！", "", "error");
                    }
                });
            }
            vm.shuaxin = function () {
                vm.getSociatyList();
                //vm.getSociatyLists();
            }
            vm.init = function () {
                vm.channelCode = _mainModel.channelCode;
                vm.getSociatyIncome(_mainModel.channelCode);
                //vm.getArtistAssetList(_mainModel.channelCode);
            }
        }
    )
});
function layDate() {
    var start = {
        elem: '#start',
        format: 'YYYY-MM-DD',
        max: laydate.now(), //最大日期
        istime: true,
        istoday: true,
        choose: function (datas) {
            //end.start = datas //将结束日的初始值设定为开始日
            roomIncomeModel.change();
        }
    };
    laydate(start);
}
layDate();