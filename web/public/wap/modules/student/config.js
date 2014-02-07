/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //配置
        app.config(['$routeProvider', function($routeProvider) {    
            //Step4: add `controllerUrl` to your route item config
            $routeProvider
                .when('/student', {
                    controller: 'studentCtrl',
                    controllerUrl: 'modules/student/studentCtrl.js',
                    templateUrl: 'modules/student/student.tpl.html'
                })
                .when('/class/:classId/student', {
                    controller: 'studentCtrl',
                    controllerUrl: 'modules/student/studentCtrl.js',
                    templateUrl: 'modules/student/student.tpl.html'
                })
                .when('/class/:classId/student/new', {
                    controller: 'studentSaveCtrl',
                    controllerUrl: 'modules/student/studentSaveCtrl.js',
                    templateUrl: 'modules/student/student.save.tpl.html'
                })
                .when('/class/:classId/student/:id', {
                    controller: 'studentViewCtrl',
                    controllerUrl: 'modules/student/studentViewCtrl.js',
                    templateUrl: 'modules/student/student.view.tpl.html'
                })
                .when('/class/:classId/student/:studentId/newparent', {
                    controller: 'parentCreateCtrl',
                    controllerUrl: 'modules/student/parentCreateCtrl.js',
                    templateUrl: 'modules/student/student.parent.create.tpl.html'
                });;
            }
        ]);
        app.factory('StudentService', function($rootScope, $http){
            return {
                get: function(schoolId, id) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/student/' + id
                    }).then(function(res) {
                        return res.data || {};
                    }, function(err) {
                        throw err;
                    });
                },
                getParents: function(schoolId, studentId) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/student/' + studentId + '/parent' 
                    }).then(function(res) {
                        return res.data || [];
                    }, function(err) {
                        throw err;
                    });
                },
                save: function(schoolId, classId, record) {
                    var successCode = 201, method = 'POST', uri;
                    if (record.id) {
                        method = 'POST'; //it should be PUT
                        successCode = 200;
                        uri = WEXPATH + '/api/school/' + schoolId + '/student/' + record.id; 
                    } else {
                        uri = WEXPATH + '/api/school/' + schoolId + '/class/' + classId + '/parent';
                    }
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
                saveParent: function(schoolId, studentId, record) {
                    var successCode = 201, method = 'POST', uri;
                    
                    uri = WEXPATH + '/api/school/' + schoolId + '/student/' + studentId + '/parent';
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
                remove: function(schoolId, studentId) {
                    return $http({
                        method: 'DELETE',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/student/' + studentId
                    }).then(function(res) {
                        return true;
                    }, function(err) {
                        throw err;
                    });
                },
                removeParent: function(schoolId, parentId) {
                    return $http({
                        method: 'DELETE',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/parent/' + parentId
                    }).then(function(res) {
                        return true;
                    }, function(err) {
                        throw err;
                    });
                },
                getStudentsByUri: function(uri) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + uri
                    }).then(function(res) {
                        return res.data || [];
                    }, function(err) {
                        throw err;
                    });
                }
            }
        });
    }
});