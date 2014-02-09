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
                .when('/notice', {
                    controller: 'noticeCtrl',
                    controllerUrl: 'modules/message/noticeCtrl.js',
                    templateUrl: 'modules/message/notice.tpl.html'
                })
                .when('/class/:classId/notice', {
                    controller: 'noticeCtrl',
                    controllerUrl: 'modules/message/noticeCtrl.js',
                    templateUrl: 'modules/message/notice.tpl.html'
                })
                .when('/class/:classId/notice/new', {
                    controller: 'noticeSaveCtrl',
                    controllerUrl: 'modules/message/noticeSaveCtrl.js',
                    templateUrl: 'modules/message/notice.save.tpl.html'
                })
                .when('/teacher/:teacherId/notice', {
                    controller: 'noticeCtrl',
                    controllerUrl: 'modules/message/noticeCtrl.js',
                    templateUrl: 'modules/message/notice.tpl.html'
                })
                .when('/message', {
                    controller: 'messageCtrl',
                    controllerUrl: 'modules/message/messageCtrl.js',
                    templateUrl: 'modules/message/message.tpl.html'
                })
                .when('/class/:classId/message', {
                    controller: 'messageCtrl',
                    controllerUrl: 'modules/message/messageCtrl.js',
                    templateUrl: 'modules/message/message.tpl.html'
                });
            }
        ]);

        app.factory('MessageService', function($rootScope, $http){
            return {
                save: function(record) {
                    var successCode = 201, method = 'POST', uri;
                    var schoolId = record.schoolId,
                        classId = record.classId,
                        teacherId = record.teacherId;

                    if (record.id) {
                        method = 'POST'; //it should be PUT
                        successCode = 200;
                        uri =  WEXPATH + '/api/school/' + schoolId + '/message/' + record.id;
                    } else {
                        if (teacherId) {
                            uri =  WEXPATH + '/api/class/' + classId + '/teacher/' + teacherId + '/message';
                        }
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
                remove: function(record) {
                    var schoolId = record.schoolId;
                    var messageId = record.id;
                    return $http({
                        method: 'DELETE',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/message/' + messageId
                    }).then(function(res) {
                        return true;
                    }, function(err) {
                        throw err;
                    });
                },
                getMessagesByUri: function(uri) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + uri
                    }).then(function(res) {
                        return res.data.sort(function(a, b) { return a.createdTime > b.createdTime ? -1 : 1; }) || [];
                    }, function(err) {
                        throw err;
                    });
                },
                reply: function(record, creator) {
                    var successCode = 201, method = 'POST', uri;
                    var schoolId = record.schoolId,
                        classId = record.classId,
                        teacherId = record.teacherId;

                    uri =  WEXPATH + '/api/school/' + schoolId + '/message/' + record.id + '/reply';
                    
                    return $http({
                        method: method,
                        headers:{'Content-Type':'application/x-www-form-urlencoded'},
                        data: $.param({
                            content: record.draftReply,
                            createdBy: creator
                        }),
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
                removeReply: function(message, reply) {
                    var schoolId = message.schoolId,
                        messageId = reply.messageId;
                    return $http({
                        method: 'DELETE',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/message/' + messageId + '/reply/' + reply.id
                    }).then(function(res) {
                        return true;
                    }, function(err) {
                        throw err;
                    });
                }
            }
        });
    }
});