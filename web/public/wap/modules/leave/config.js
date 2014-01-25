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
                });
            }
        ]);
        app.factory('LeaveService', function($rootScope, $http){
            return {
                getLeavesByClass: function(schoolId, wexclass) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/class/' + wexclass.id + '/leave'
                    }).then(function(res) {
                        return res.data.result || [];
                    }, function() {
                        return null;
                    });
                }
            }
        });
    }
});