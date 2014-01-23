define(function (require, exports, module) {
    "use strict";
    console.log('init app...' + (new Date().getTime()));

    //Step3: add 'angular-lazyload' to your main module's list of dependencies
    var app = angular.module('app', ['angular-lazyload', 'ngRoute']);
    require('./modules/message/config.js')(app);
    require('./modules/photo/config.js')(app);
    require('./modules/leave/config.js')(app);

    //配置期
    app.config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {    
        $httpProvider.defaults.headers.common['wexkey'] = '123'; //$.fn.cookie("wexkey");
        $httpProvider.defaults.headers.common['wextoken'] = '321'; //$.fn.cookie("wextoken");
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        $httpProvider.defaults.headers.common['Authorization'] = 'token';
        // nav settings
        $routeProvider
            .when('/main', {
                controller: 'mainCtrl',
                controllerUrl: 'modules/main/mainCtrl.js',
                templateUrl: 'modules/main/main.tpl.html'
            })
            .otherwise({
                redirectTo: '/main'
            });
        }
    ]);

    //运行期
    app.run(['$lazyload', '$rootScope', function($lazyload, $rootScope){
        // set PATH
        $rootScope.PATH = 'http://test.weexiao.com';
        // init lazyload & hold refs
        $lazyload.init(app);
        app.register = $lazyload.register;
    }]);

    module.exports = app;
});