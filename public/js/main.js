avalon.filters.screenName = function (screen) {
    var screenName = "";
    if (screen == "artist.html") {
        screenName = "艺人管理";
    } else if (screen == "sociaty.html") {
        screenName = "马甲管理";
    }
    return screenName;
}
var _mainModel = createModel('main', function (modelName) {
    return avalon.define(modelName, function (vm) {
            var LOGIN = 'L';
            var MAIN = 'M';
            var CONTENT = 'C';
            vm.loginState = '0';
            vm.screen = null;
            vm.roomScreen = null;
            vm.uuid = "124000427";
            vm.bfuid = "135601920088444147";
            vm.nickName = "1231232123";
       
            vm.user = {
                userName: "",
                password: "",
                uuid: ''
            };
            vm.userList = {
                userName: "",
                password: ""
            };
            vm.asset = {
                yesterdayIncome: '0',
                weekIncome: '0',
                month: [],
                assetSum: '0'
            }
            vm.initSociatyId = '';
            vm.sociatyInitFun = function (el) {
                vm.sociatyObj = el.$model;
                var sociatyId = el.$model.sociatyId;
                vm.initSociatyId = sociatyId;
                roomModel.getSociatyInit(sociatyId);
                artistIncomeModel.getSociatyInit(sociatyId);
            }
            vm.getLastWeekAsset = function () {
                vm.asset.month = (vm.asset.month - 88.83).toFixed(2);
            }
            vm.viwArt = 0;
            vm.openArtistScreen = function () {
                vm.viwArt = 0;
                vm.openScreen("artist.html");
            }
            vm.openIncomeScreen = function () {
                vm.viwArt = 1;
                vm.openScreen("artist.html");
            }
            vm.openSociatyScreenTest = function () {
                vm.openScreen("room.html");
            }
            vm.openRoomIncomeScreen = function () {
                vm.openScreen("roomIncome.html");
            }
            vm.openBlacklistScreen = function () {
                vm.openScreen("blacklist.html");
            }
            vm.setArtistScreenState = 0;
            vm.setArtistScreen = function (el) {
                vm.openArtistScreen();
                vm.loginState = 2;
                vm.setArtistScreenState = 1;
            }
            vm.uuu = 0;
            vm.openRoomTScreen = function () {
                vm.openScreen("room.html");
                if (vm.uuu == 0) {
                    vm.uuu = 1;
                } else {
                    roomSetUpModel.getSociatyInit(vm.channelCode);
                    blacklistModel.getSociatyInit(vm.channelCode);
                }
            }
            vm.roomState = 0;
            vm.sociatyId == 0;
            vm.openSociatyScreen = function () {
                vm.openScreen("sociaty.html");
                //$("#pullDown").find("ul").hide();
                if (vm.roomState == 0) {
                    vm.roomState = 1;
                } else {
                    roomModel.getSociatyInit(vm.channelCode);
                    artistIncomeModel.getSociatyInit(vm.channelCode);
                }
                //vm.sociatyId == vm.sociatyList[0].sociatyId;
            }
            vm.channelCode = '';
            vm.sociatyObj = {};
            vm.root = 0;
            vm.openIncomeInputScreen = function (el) {
                vm.setArtistScreenState = 0;
                vm.loginState = 2;
                vm.sociatyObj = el;
                vm.channelCode = el.room_id;
                vm.openSociatyScreen();
                //vm.getSociatyIncomeList(vm.channelCode);
            }
            vm.openFansScreen = function () {
                vm.openScreen("fans.html");
            }
            vm.openRoomInfoScreen = function () {
                ajaxPost("/mainService/getSociatyUuid", {uuid: vm.user.uuid}, function (result) {
                    if (result.code == 0) {
                        if (result.sociatyList.length > 0) {
                            vm.openScreen("sociaty.html");
                        } else {
                            vm.openScreen("sociaty.html");
                            //alert('您不是会长！');
                        }
                    } else {
                        alert('公会权限查询失败！');
                    }
                });
                //vm.sociatyInit(vm.sociatyLists[0].sociatyId)
            }
            vm.openRoomSetUpScreen = function () {
                vm.openScreen("roomSetUp.html");
            }
            vm.openSociatyPage = 0;
            vm.openSociaty = function (e) {
                vm.openSociatyPage = e;
            }
            vm.openScreen = function (screen) {
                if (screen == LOGIN || screen == MAIN) {
                    vm.state = screen;
                    vm.screen = null;
                    vm.setHelpScreen("main.html");
                } else {
                    vm.state = CONTENT;
                    vm.screen = screen;
                }
            }
            vm.openRoomScreen = function (roomScreen) {
                if (roomScreen == LOGIN || roomScreen == MAIN) {
                    vm.state = roomScreen;
                    vm.roomScreen = null;
                    vm.setHelpScreen("main.html");
                } else {
                    vm.state = CONTENT;
                    vm.roomScreen = roomScreen;
                }
            }
            vm.userUrl = '';
            vm.getUser = function () {
                ajaxPost("/mainService/getUser", {}, function (result) {
                    if (result.code == 0) {
                        vm.user = result.user;
                        vm.userUrl = result.user.faceUrl;
                        vm.getSociatyList();
                    } else {
                        alert('个人资料查询失败！');
                    }
                });
            }
            vm.Artist = {};
            vm.getArtist = function () {
                ajaxPost("/mainService/getArtistList", {}, function (result) {
                    if (result.code == 0) {
                        vm.Artist.assetSum = result.assetSum;
                    } else {
                        alert('个人资产余额查询失败！');
                    }
                });
            }
            vm.outLog = function () {
                vm.loginState = '0';
            }
            vm.getUserAsset = function () {
                ajaxPost("/mainService/getUserAsset", {}, function (result) {
                    if (result.code == 0) {
                        vm.asset.yesterdayIncome = result.yesterdayIncome;
                        vm.asset.weekIncome = result.weekIncome;
                        vm.asset.assetSum = result.assetSum;
                    } else {
                        alert('个人资产余额查询失败！');
                    }
                });
            }
            vm.keyLogin = function (e) {
                if (e.keyCode == 13) {
                    vm.login();
                }
            }
            vm.roomSelect = '';
            vm.roomSelectList = [];
            vm.getRoomSelectList = function () {
                ajaxPost("/mainService/getRoomSelectList", {}, function (result) {
                    if (result.code == 0) {
                        vm.roomSelectList = result.roomSelectList;
                        vm.roomSelect = result.roomSelectList[0].channelCode;
                        vm.changeRoom();
                    } else {
                        alert('信息查询失败！')
                    }
                });
            }
            vm.changeRoom = function () {
                var roomSelect = vm.roomSelect;
                vm.setRoomCode();
            }
            vm.setRoomCode = function () {
                ajaxPost("/mainService/setRoomCode", {roomCode: vm.roomSelect}, function (result) {
                    if (result.code == 0) {

                    } else {
                        alert('频道信息发送失败！')
                    }
                });
            }
            vm.sociatyList = [];
            vm.sociatyListState = 0;
            vm.sociatyinit = '';
            vm.getSociatyList = function () {
                ajaxPost("/mainService/getSociatyList", {uuid: vm.user.uuid}, function (result) {
                    if (result.code == 0) {
                        vm.sociatyList = result.sociatyList;
                        if (vm.sociatyList.length == 0) {
                            vm.sociatyListState = 1
                        }
                    } else {
                        alert('频道信息发送失败！');
                    }
                });
            }

            vm.cycle = '';
            vm.monthIncome = 0;
            vm.getCycle = function () {
                var channelCode = vm.channelCode;
                ajaxPost("/roomIncomeService/getSociatyIncome_cycle", {
                    date: {
                        sociatyList: channelCode,
                        startDate: vm.cycle,
                        endDate: vm.cycle
                    }
                }, function (result1) {
                    if (result1.code == 0) {
                        vm.monthIncome = result1.income;
                    } else {
                        alert("收入查询失败！");
                    }
                });
            }
            vm.smsg = '加载中..'
            vm.sociatyIncome = {sum: 0, yesDay: 0, week: 0, asset: 0};
            vm.getSociatyIncomeList = function (sociatyList) {
                ajaxPost("/roomIncomeService/getSociatyIncomeList", {
                    date: {
                        sociatyList: sociatyList,
                        startDate: '1900/01/01',
                        endDate: '2100/10/10'
                    }
                }, function (result) {
                    if (result.code == 0) {
                        vm.sociatyIncome.sum = result.income;
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
            vm.roomList = [];
            vm.redRoomList = [];
            vm.yellowRoomList = [];
            vm.login = function () {
                ajaxPost("/login", {
                    username: vm.uuid,
                    password: vm.bfuid
                }, function (result) {
                    if (result.code == -1) {
                        alert("账号服务器返回错误。");
                        vm.loginState = '0';

                    } else if (result.code == 1) {
                        alert("链接账号服务器失败！");
                        vm.loginState = '0';

                    } else if (result.code == 2) {
                        alert("账号不存在！");
                        vm.loginState = '0';

                    } else if (result.code == 3) {
                        alert("密码错误！");
                        vm.loginState = '0';

                    } else if (result.code == -2) {
                        alert("没有相关权限！");
                        vm.loginState = '0';

                    } else if (result.code == -3) {
                        alert("不是会长账号！");
                        vm.loginState = '0';

                    } else if (result.code == 1000) {
                        alert("链接超时！(Result:1000)");
                        vm.loginState = '0';

                    } else if (result.code == null) {
                        alert("登陆状态异常！");
                        vm.loginState = '0';

                    } else if (result.code == 0) {
                        vm.loginState = '1';
                        vm.user = result.user;
                        vm.user.uuid = vm.uuid;
                        vm.user.nickName = getCookie('LIVE_USERNAME');
                        vm.userUrl = 'http://picture.show.baofeng.com/fac/fac_' + vm.user.uuid;
                        vm.user.picturesUrl = 'http://picture.show.baofeng.com/artshow/artshow_' + vm.user.uuid;
                        ajaxPost("/mainService/getRoomList", {uuid: result.user.uuid}, function (room_result) {
                            if (room_result.code == 0) {
                                vm.redRoomList = room_result.roomList
                            }
                            else {
                                alert('没有查到房间信息！');
                            }
                        });
                        ajaxPost("/mainService/getArtistSociatyList", {uuid: result.user.uuid}, function (room_result) {
                            if (room_result.code == 0) {
                                vm.yellowRoomList = room_result.roomList
                            }
                            else {
                                alert('没有查到艺人所属公会！')
                            }
                        });
                    }
                });
            }
            vm.fanhui = function () {
                vm.loginState = '1';
            }

            vm.cssSelect = function () {
                //下拉
                function pullDown(pullDown) {
                    var pullDown = $(pullDown);
                    var pullDownText = $(pullDown).find("span");
                    pullDown.find("ul").hide();
                    //pullDownText.text(pullDown.find("ul").find("li:first-child").text())
                    var i = 0;
                    pullDownText.click(function (event) {
                        vm.openRoomInfoScreen()
                        event.stopPropagation();//屏蔽上一级点击事件
                        $("#tabTitle h3:nth-child(2)").addClass("selectedH3");
                        $("div.sociatyDown").find("span").addClass("selectSociatyDown");
                        $("#tabTitle h3:nth-child(1)").removeClass("selectedH3");
                        $("#tabContent > div").hide().eq($("#tabTitle h3").index(this)).show();
                        if (i == 0) {
                            $(".artistTab > li:first-child a,.roomTab li:first-child a").addClass("artistStyle");
                            i = 1;
                        }
                        $(this).siblings("ul").slideToggle(100)
                        $(this).siblings("ul").find("li").click(function () {
                            pullDownText.find("a").text($(this).text())
                            $(this).parents("ul").hide();
                        })
                    })
                }

                pullDown("#pullDown");
                pullDown("#incomePullDown");
                pullDown("#roomPullDown");
                //第一层TAB切换
                $("#tabTitle h3").click(function () {
                    $(this).addClass("selectedH3").siblings("h3").removeClass();
                    $("#tabContent > div").hide().eq($("#tabTitle h3").index(this)).show();
                    $(".artistTab > li > a,.roomTab > li > a").removeClass();
                    $(".artistTab > li:first-child a,.roomTab li:first-child a").addClass("artistStyle");
                });
                $("#tabTitle h3:nth-child(2)").click(function () {
                    $("div.sociatyDown").find("span").addClass("selectSociatyDown");
                })
                $("#tabTitle h3:nth-child(1)").click(function () {
                    $("div.sociatyDown").find("span").removeClass("selectSociatyDown");
                })
                //第二层tab切换添加样式
                $(".artistTab > li:first-child > a").addClass("artistStyle");
                $(".artistTab > li > a,.roomTab > li > a").click(function () {
                    $(".artistTab > li > a,.roomTab > li > a").removeClass();
                    $(this).addClass("artistStyle")
                })
                var incomeRecordSpan = $(".incomeRecord > ul > li > span");
                if (incomeRecordSpan.html().length > 8) {
                    incomeRecordSpan.css("font-size", "22px")
                } else {
                    incomeRecordSpan.css("font-size", "50px")
                }
            }
            vm.sociatyObj = {};
            vm.sociatyLists = [];
            vm.sociatyListState = 0;
            vm.getSociatyLists = function () {//查询公会列表
                ajaxPost("/roomService/getSociatyList", {}, function (result) {
                    if (result.code == 0) {
                        vm.sociatyLists = result.sociatyList;
                        vm.sociatyinit = vm.sociatyLists[0].channelName || '';
                        if (vm.sociatyLists.length == 0) {
                            vm.sociatyListState = 1
                        } else {
                            vm.sociatyObj = vm.sociatyLists[0];
                        }
                        vm.initSel();
                    } else {
                        alert("频道信息查询失败！")
                    }
                });
            }
            vm.uiSta = 0;
            vm.initSel = function () {
                $("#pullDown").find("ul").hide();
            }
            vm.uiDRD = function () {
                event.stopPropagation();
                $("#pullDown").find("ul").show();
            }
            vm.initState = 0;
            /**
             * 注销
             */
            vm.outLogin = function () {
                vm.uuid = "";
                vm.nickName = "";
                vm.loginState = 0;
                window.location.href = 'http://sso.baofeng.net/api/server/logout?from=funshow_web&next_action=' + window.location.href;
            }
            /**
             * 登陆
             */
            vm.isLogin = function () {
                var bfcsid = getCookie('bfcsid');
                var st = getCookie('st');
                var bfuid = getCookie('bfuid');
                var data = {
                    data: {
                        bfcsid: bfcsid, st: st, from: 'fengxiu_web', version: '1.0'
                    }
                }
                ajaxPost("/mainService/islogin", data, function (result) {
                    if (result.code == 0) {
                        if (result.jsonObj.status == 1) {
                            var bf_nick = result.jsonObj.info.username;
                            ajaxPost("/mainService/getUserObj_uuid_nick", {data: result.jsonObj}, function (result) {
                                if (result.code == 0) {
                                    setCookie("LIVE_USERNAME", result.userObj.nickName);
                                    setCookie("LIVE_UUID", result.userObj.uuid);
                                    vm.user.uuid = result.userObj.uuid;
                                    vm.user.nickName = result.userObj.nickName;
                                    vm.uuid = result.userObj.uuid;
                                    vm.nickName = result.userObj.nickName;
                                    vm.bfuid = bfuid;
                                    vm.login();
                                } else {
                                    alert('您的暴风账号 ' + bf_nick + ' 还未在风秀激活，请登录风秀客户端激活');
                                }
                            });
                        } else {

                        }
                    } else {
                    }
                });
            }
            vm.init = function () {
                if (vm.initState == 0) {
                    vm.cssSelect();
                    vm.initState = 1;
                }
                //vm.isLogin();
                vm.login();
            }
        }
    )
});
$(document).ready(function () {
    $(".tabAddStyle li a").click(function () {
        $(".tabAddStyle li a").removeClass("active");
        $(this).addClass("active");
    })


});