avalon.filters.screenName = function (screen) {
    var screenName = "";
    if (screen == "artist.html") {
        screenName = "艺人管理";
    } else if (screen == "sociaty.html") {
        screenName = "马甲管理";
    }
    return screenName;
}
var mainModel = createModel('main', function (modelName) {
    return avalon.define(modelName, function (vm) {
            var LOGIN = 'L';
            var MAIN = 'M';
            var CONTENT = 'C';
            vm.screen = null;
            vm.openArtistScreen = function () {
                vm.openScreen("artist.html");
            }
            vm.openSociatyScreen = function () {
                vm.openScreen("sociaty.html");
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
            vm.init = function () {
                vm.openScreen();
            }
        }
    )
});