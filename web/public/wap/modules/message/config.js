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
                .when('/message', {
                    controller: 'messageCtrl',
                    controllerUrl: 'modules/message/messageCtrl.js',
                    templateUrl: 'modules/message/message.tpl.html'
                });
            }
        ]);
    }
});