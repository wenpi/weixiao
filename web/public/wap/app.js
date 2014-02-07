define(function (require, exports, module) {
    "use strict";

    var args = getArgs(), isStatic = true;
    // set PATH
    if (window.location.hostname.indexOf('weexiao') >= 0) {
        window.WEXPATH = '';
        if (args.wexschool) {
            $.fn.cookie("wexschool", args.wexschool);
            $.fn.cookie("wexuser", args.wexuser);
            $.fn.cookie("wexkey", args.wexkey);
            $.fn.cookie("wextoken", args.wextoken);
            isStatic = false;
        }
    } else { // for debug
        window.WEXPATH = 'http://192.168.1.105';
        $.fn.cookie("wexschool", "a106d68b-cbfd-294a-5324-8d0a5e329e2d");
        $.fn.cookie("wexuser", "2e9db4f7-4293-4c11-80eb-4895ebe01b50");
        $.fn.cookie("wexkey", "1391790020017");
        $.fn.cookie("wextoken", "5f2cc67f5fe04c9ee4509d5f20fe1593");
        isStatic = false;
    }
    

    //Step3: add 'angular-lazyload' to your main module's list of dependencies
    var app = angular.module('app', ['angular-lazyload', 'ngRoute', 'ngSanitize']);
    require('./modules/main/config.js')(app);
    require('./modules/user/config.js')(app);
    require('./modules/student/config.js')(app);
    require('./modules/message/config.js')(app);
    require('./modules/photo/config.js')(app);
    require('./modules/leave/config.js')(app);

    //配置期
    app.config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {
        $httpProvider.defaults.headers.common['wexuser'] = $.fn.cookie("wexuser");  
        $httpProvider.defaults.headers.common['wexkey'] = $.fn.cookie("wexkey");
        $httpProvider.defaults.headers.common['wextoken'] = $.fn.cookie("wextoken");
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
    app.run(['$lazyload', '$rootScope', 'UserService', function($lazyload, $rootScope, UserService){

        // init lazyload & hold refs
        $lazyload.init(app);
        app.register = $lazyload.register;
        // get user info and put it into the session
        $rootScope.session = {user: null};
        $rootScope.common = {};

        // 如果只是查看使用帮助之类的界面
        if (isStatic) {
            setTimeout(function() {
                $("#loading").hide();
            }, 500);
            return true;
        }

        // 理论上这不应该被访问
        if (!$.fn.cookie("wexuser")) {
            alert("您尚未登录。");
            return false;
        }

        UserService.get($.fn.cookie("wexuser")).then(function(user) {
            return user;
        }, function(err) {
            return null;
        }).then(function(user) {
            if (!user) { 
                alert("读取用户资料异常，无法初始化应用。");
                return; 
            }
            setTimeout(function() {
                $("#loading").hide();
            }, 500);

            switch(user.type) {
            case '0':
                UserService.getParent(user.id).then(function(parent) {
                    $rootScope.session.user = $.extend(user, parent);
                }, function() {
                    //alert('抱歉，加载家长信息出错。');
                    return;
                });
            break;
            case '1':
                UserService.getTeacher(user.id).then(function(teacher) {
                    var teacher = $.extend(user, teacher, {schoolId: $.fn.cookie("wexschool")});
                    UserService.getClassesByTeacher(teacher)
                    .then(function(wexClasses) {
                        if (wexClasses && wexClasses.length > 0) {
                            teacher.wexClasses = wexClasses;
                        } else {
                            teacher.wexClasses = [];
                        }
                        $rootScope.session.user = teacher;

                        $(wexClasses).each(function (i, wexClass) {
                            UserService.getStudentsByClass(wexClass).then(function(students) {
                                wexClass.students = students || [];
                            })
                        });
                    });
                }, function() {
                    alert('抱歉，加载教师信息出错。');
                    return;
                });
            break;
            }  
        });
    }]);

    module.exports = app;
});



