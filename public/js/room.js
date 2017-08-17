/**
 * Created by Linyi on 2015/6/19 0019.
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
var roomModel = createModel('room', function (modelName) {
    return avalon.define(modelName, function (vm) {
            vm.roomObj = {};
            vm.sociatyId = _mainModel.channelCode;
            vm.liveStart = ''
            vm.liveEnd = ''
            vm.getRoomObj = function () {
                ajaxPost("/roomService/getRoomObj", {sociatyId: vm.sociatyId}, function (result) {
                    if (result.code == 0) {
                        vm.roomObj = result.roomObj;
                    } else {
                        alert('频道信息查询失败1！');
                    }
                });
            }
            vm.sociatyObj = _mainModel.sociatyObj;
            //vm.sociatyList = [];
            //vm.sociatyListState = 0;
            //vm.getSociatyList = function () {
            //    ajaxPost("/roomService/getSociatyList", {}, function (result) {
            //        if (result.code == 0) {
            //            vm.sociatyList = result.sociatyList;
            //            if (vm.sociatyList.length == 0) {
            //                vm.sociatyListState = 1
            //            } else {
            //                vm.sociatyObj = vm.sociatyList[0];
            //                vm.getArtistList(vm.sociatyObj.sociatyId);
            //            }
            //        } else {
            //            alert("频道信息查询失败！")
            //        }
            //    });
            //}
            vm.getSociatyInit = function (sociatyId) {
                vm.getArtistList(_mainModel.channelCode);
                vm.sociatyObj = _mainModel.sociatyObj;
            }
            vm.artistSum = 0;
            vm.artistList = [];
            vm.artistListClone = [];
            vm.getArtistList = function (sociatyId) {
                var data = {
                    sociatyId: vm.sociatyId,
                    liveStart: vm.liveStart,
                    liveEnd: vm.liveEnd
                }
                ajaxPost("/roomIncomeService/getArtistAssetList", {data: data}, function (result) {
                    if (result.code == 0) {
                        vm.artistList = result.artistAssetList;
                        vm.artistSum = result.artistAssetList.length;
                        vm.initPagination2(vm.artistList.length);
                    } else {
                        alert('查询失败！');
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
                vm.artistListClone = [];
                vm.countNum2 = c;//总条数
                vm.pageTotal2 = (c - c % 10) / 10;//总页数
                if (c % 10 != 0) {
                    vm.pageTotal2 = vm.pageTotal2 + 1;
                }
                vm.pageNow2 = 1;//当前页
                if (c <= 10) {
                    for (var i = 0; i < c; i++) {
                        vm.artistListClone.push(vm.artistList[i]);
                    }
                } else if (c > 10) {
                    for (var i = 0; i < 10; i++) {
                        vm.artistListClone.push(vm.artistList[i]);
                    }
                }
            }
            vm.clickPage2 = function (e) {
                switch (parseInt(e)) {//parseInt(e)：e转化为int类型
                    case 0://首页
                        vm.initPagination2(vm.artistList.length);
                        vm.pageNow2 = 1;
                        break;
                    case 1://上一页
                        if (vm.pageNow2 > 1) {
                            vm.pageNow2 = vm.pageNow2 - 1;
                            vm.artistListClone = [];
                            for (var i = (vm.pageNow2 - 1) * 10; i < ((vm.pageNow2 - 1) * 10) + 10; i++) {
                                if (vm.artistList[i]) {
                                    vm.artistListClone.push(vm.artistList[i]);
                                }
                            }
                        }
                        break;
                    case 2://下一页
                        if (vm.pageNow2 < vm.pageTotal2) {
                            vm.artistListClone = [];
                            vm.pageNow2 = vm.pageNow2 + 1;
                            var a = 0;
                            for (var i = (vm.pageNow2 - 1) * 10; i < ((vm.pageNow2 - 1) * 10) + 10; i++) {
                                if (vm.artistList[i]) {
                                    vm.artistListClone.push(vm.artistList[i]);
                                }
                            }
                        }

                        break;
                    case 3://尾页
                        vm.pageNow2 = vm.pageTotal2;
                        vm.artistListClone = [];
                        for (var i = (vm.countNum2 - vm.countNum2 % 10); i < vm.countNum2; i++) {
                            if (vm.artistList[i]) {
                                vm.artistListClone.push(vm.artistList[i]);
                            }
                        }
                        if (vm.countNum2 % 10 == 0) {
                            for (var i = (vm.countNum2 - 10); i < vm.countNum2; i++) {
                                if (vm.artistList[i]) {
                                    vm.artistListClone.push(vm.artistList[i]);
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
                    vm.artistListClone = [];
                    for (var i = ( a - 1) * 10; i < ((a - 1) * 10) + 10; i++) {
                        if (vm.artistList[i]) {
                            vm.artistListClone.push(vm.artistList[i]);
                        }
                    }
                }
            }
            /**
             * 分页结束
             */
            vm.cssSelect = function () {
                $(document).ready(function () {
                    //下拉组件
                    function pullDown(pullDown) {
                        var pullDown = $(pullDown);
                        var pullDownText = $(pullDown).find("span");
                        pullDown.find("ul").hide();
                        pullDownText.text(pullDown.find("ul").find("li:first-child").text())
                        pullDownText.click(function () {
                            $(this).siblings("ul").slideToggle(100)
                            $(this).siblings("ul").find("li").click(function () {
                                pullDownText.text($(this).text())
                                $(this).parent("ul").hide()
                            })
                        })
                    }

                    pullDown('roomPullDown');
                })
            }
        vm.getSociatyInit = function (sociatyId) {
            vm.getArtistList(_mainModel.channelCode);
            vm.cssSelect();
        }
            vm.init = function () {
                //vm.getSociatyList();
                vm.getArtistList(_mainModel.channelCode);
                vm.cssSelect();
            }
        }
    )
});
function layDate2() {
    var start = {
        elem: '#liveStart',
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
        elem: '#liveEnd',
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