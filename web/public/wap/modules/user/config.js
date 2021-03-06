define(function (require, exports, module) {
    "use strict";

    module.exports = function(app){
        require('./userPickerCtrl.js')(app);

        //配置期
        app.config(['$routeProvider', function($routeProvider) {    
            //Step4: add `controllerUrl` to your route item config
            $routeProvider
                .when('/user/:id', {
                    controller: 'profileCtrl',
                    controllerUrl: 'modules/user/profileCtrl.js',
                    templateUrl: 'modules/user/profile.tpl.html'
                });
            }
        ]);

        app.factory('UserService', function($rootScope, $http){
            var uri = WEXPATH + '/api/user';
            return {
                get: function(id) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: uri + '/' + id
                    }).then(function(res) {
                        return res.data;
                    }, function(err) {
                        throw err;
                    });
                },
                getParent: function(schoolId, parentId) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/parent/' + parentId
                    }).then(function(res) {
                        return res.data;
                    }, function(err) {
                        throw err;
                    });
                },
                getTeacher: function(schoolId, teacherId) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/teacher/' + teacherId
                    }).then(function(res) {
                        return res.data;
                    }, function(err) {
                        throw err;
                    });
                },
                getClassesByTeacher: function(teacher) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/school/' + teacher.schoolId + '/teacher/' + teacher.id + '/class'
                    }).then(function(res) {
                        return res.data;
                    }, function(err) {
                        throw err;
                    });
                },
                getStudentsByClass: function(wexClass) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/school/' + wexClass.schoolId + '/class/' + wexClass.id + '/student'
                    }).then(function(res) {
                        return res.data;
                    }, function(err) {
                        throw err;
                    });
                },
                getStudentsByParent: function(parent) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/school/' + parent.schoolId + '/parent/' + parent.id + '/student'
                    }).then(function(res) {
                        return res.data;
                    }, function(err) {
                        throw err;
                    });
                },
                save: function(userId, record) {
                    var successCode = 200, method = 'POST', uri;
                    
                    uri = WEXPATH + '/api/user/' + userId; 

                    return $http({
                        method: method,
                        headers:{'Content-Type':'application/x-www-form-urlencoded'},
                        data: $.param(record),
                        url: uri
                    }).then(function(res) {
                        if (res.status === successCode) {
                            return true;
                        } else {
                            throw new Error("not match the success code");
                        }
                    }, function(err) {
                        throw err;
                    });
                },
            }
        });

        app.directive("wxUserPicker", [ '$location', function($location) {
            return {
                restrict : 'A',
                replace : true,
                controller: 'userPickerCtrl',
                templateUrl: 'modules/user/user.picker.tpl.html',
                link : function($scope, $element, $attrs) {
                }
            };
        }]);
    }
});