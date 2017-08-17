var incomeModel = createModel('income', function (modelName) {
    return avalon.define(modelName, function (vm) {
            vm.giveGiftList = [];
            vm.giveGiftListClone = [];
            vm.getGiveGiftList = function () {
                ajaxPost("/incomeService/getGiveGiftList", {}, function (result) {
                    if (result.code == 0) {
                        vm.giveGiftList = result.giveGiftList;
                        vm.initPagination2(vm.giveGiftList.length)
                    } else {
                        alert('营收明细查询失败！');
                    }
                });
            }
            vm.layDate = function () {

            }
            vm.cycle = {startDate: '', endDate: ''}
            vm.getCycleGiveGiftList = function () {
                ajaxPost("/incomeService/getCycleGiveGiftList", {
                    data: {
                        cycle: vm.cycle.$model
                    }
                }, function (result) {
                    if (result.code == 0) {
                        vm.giveGiftList = result.giveGiftList;
                        vm.initPagination2(vm.giveGiftList.length)
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
            vm.init = function () {
                vm.getGiveGiftList();
                //vm.layDate();
            }
        }
    )
});
//var incomeModelClass= new incomeModel();
function layDate(){
    var start = {
        elem: '#start',
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
            incomeModel.getCycleGiveGiftList();
        }
    };
//laydate.skin('huanglv')
    laydate(start);
    laydate(end);
}
layDate();