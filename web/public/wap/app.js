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
        window.WEXPATH = 'http://test.weexiao.com';
        $.fn.cookie("wexschool", "d28eefe9-db3b-4db5-a469-424ac5d187d8");
        
        $.fn.cookie("wexuser", "3d6a1441-b4f5-445c-a27f-02a8667ad293");
        $.fn.cookie("wexkey", "1392301167498");
        $.fn.cookie("wextoken", "5b60b9357a28dd9a41626b7a3b2515fb");
        /*
        $.fn.cookie("wexuser", "3d6a1441-b4f5-445c-a27f-02a8667ad293");
        $.fn.cookie("wexkey", "1392300051899");
        $.fn.cookie("wextoken", "5e1d3b28231421b5df8262b2301b84a1");
        
        $.fn.cookie("wexuser", "64edb1cc-54e1-4671-b2cb-cebe479a40d3");
        $.fn.cookie("wexkey", "1392300176521");
        $.fn.cookie("wextoken", "80cb95b56d291319e754c8df942a1ec7");
        
        
        $.fn.cookie("wexuser", "dcc7e4d2-7124-445a-9145-e2254eccc435");
        $.fn.cookie("wexkey", "1392299993728");
        $.fn.cookie("wextoken", "7ee276844899ca180b6222cc33004d71");*/
        
        
        
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
            $.extend(user, {
                isParent: function() {
                    return this.type == '0';
                },
                isTeacher: function() {
                    return this.type == '1';
                },
                isAdmin: function() {
                    return this.type == '1' && this.isAdmin == '1';
                },
                hasWexClasses: function() {
                    return this.wexClasses && this.wexClasses.length > 0;
                },
                hasStudents: function() {
                    return this.students && this.students.length > 0;
                }
            })
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



