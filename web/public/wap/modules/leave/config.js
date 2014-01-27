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
                .when('/leave', {
                    controller: 'leaveCtrl',
                    controllerUrl: 'modules/leave/leaveCtrl.js',
                    templateUrl: 'modules/leave/leave.tpl.html'
                })
                .when('/class/:classId/leave', {
                    controller: 'leaveCtrl',
                    controllerUrl: 'modules/leave/leaveCtrl.js',
                    templateUrl: 'modules/leave/leave.tpl.html'
                }).when('/student/:studentId/leave', {
                    controller: 'leaveCtrl',
                    controllerUrl: 'modules/leave/leaveCtrl.js',
                    templateUrl: 'modules/leave/leave.tpl.html'
                })
                .when('/leave/new', {
                    controller: 'leaveSaveCtrl',
                    controllerUrl: 'modules/leave/leaveSaveCtrl.js',
                    templateUrl: 'modules/leave/leave.save.tpl.html'
                })
                .when('/leave/:id', {
                    controller: 'leaveSaveCtrl',
                    controllerUrl: 'modules/leave/leaveSaveCtrl.js',
                    templateUrl: 'modules/leave/leave.save.tpl.html'
                });
            }
        ]);
        app.factory('LeaveService', function($rootScope, $http){
            return {
                get: function(id) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/leave/' + id
                    }).then(function(res) {
                        return res.data || [];
                    }, function() {
                        return null;
                    });
                },
                save: function(schooldId, record) {
                    var successCode = 201, method = 'POST', uri;
                    if (record.id) {
                        method = 'POST'; //it should be PUT
                        successCode = 200;
                        uri = WEXPATH + '/api/leave/' + record.id; 
                    } else {
                        uri =  WEXPATH + '/api/school/' + schooldId + '/student/' + record.studentId + '/leave';
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
                getLeavesByUri: function(uri) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + uri
                    }).then(function(res) {
                        return res.data || [];
                    }, function() {
                        return null;
                    });
                }
            }
        });
    }
});