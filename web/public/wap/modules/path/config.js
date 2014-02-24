/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //配置期
        app.config(['$routeProvider', function($routeProvider) {    
            //Step4: add `controllerUrl` to your route item config
            $routeProvider
                .when('/class/:classId/path', {
                    controller: 'pathCtrl',
                    controllerUrl: 'modules/path/pathCtrl.js',
                    templateUrl: 'modules/path/path.tpl.html'
                })
                .when('/class/:classId/path/new', {
                    controller: 'pathSaveCtrl',
                    controllerUrl: 'modules/path/pathSaveCtrl.js',
                    templateUrl: 'modules/path/path.save.tpl.html'
                })
                .when('/class/:classId/student/:studentId/path', {
                    controller: 'pathCtrl',
                    controllerUrl: 'modules/path/pathCtrl.js',
                    templateUrl: 'modules/path/path.tpl.html'
                })
                .when('/class/:classId/student/:studentId/new', {
                    controller: 'pathSaveCtrl',
                    controllerUrl: 'modules/path/pathSaveCtrl.js',
                    templateUrl: 'modules/path/path.save.tpl.html'
                });
            }
        ]);

        app.factory('PathService', function($rootScope, $http){
            return {
                save: function(record) {
                    var successCode = 201, method = 'POST', uri;
                    var schoolId = record.schoolId,
                        classId = record.classId,
                        teacherId = record.teacherId,
                        studentId = record.studentId;

                    uri =  WEXPATH + '/api/school/' + schoolId + '/student/' + studentId + '/path';
                    
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
                remove: function(record) {
                    var schoolId = record.schoolId;
                    var pathId = record.id;
                    return $http({
                        method: 'DELETE',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/path/' + pathId
                    }).then(function(res) {
                        return true;
                    }, function(err) {
                        throw err;
                    });
                },
                getPathsByUri: function(uri) {
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