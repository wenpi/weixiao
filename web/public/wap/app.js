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
        $.fn.cookie("wexschool", "d28eefe9-db3b-4db5-a469-424ac5d187d8");
        $.fn.cookie("wexuser", "02b3213c-c4ba-4b7b-be4b-8d751f8b305e");
        $.fn.cookie("wexkey", "1392121859050");
        $.fn.cookie("wextoken", "2f2091276dce31bddd5ae49398e6c4ee");
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

            var schoolId = $.fn.cookie("wexschool");
            switch(user.type) {
            case '0':
                UserService.getParent(schoolId, user.id).then(function(parent) {
                    var parent = $.extend(user, parent, {schoolId: schoolId});
                    UserService.getStudentsByParent(parent)
                    .then(function(students) {
                        if (students && students.length > 0) {
                            parent.students = students;
                        } else {
                            parent.students = [];
                        }
                        $rootScope.session.user = parent;
                    });
                }, function() {
                    alert('抱歉，加载家长信息出错。');
                    return;
                });
            break;
            case '1':
                UserService.getTeacher(schoolId, user.id).then(function(teacher) {
                    var teacher = $.extend(user, teacher, {schoolId: schoolId});
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



