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
                .when('/photo', {
                    controller: 'photoCtrl',
                    controllerUrl: 'modules/photo/photoCtrl.js',
                    templateUrl: 'modules/photo/photo.tpl.html'
                })
                .when('/school/:schoolId/teacher/:teacherId/photo', {
                    controller: 'myPhotoCtrl',
                    controllerUrl: 'modules/photo/myPhotoCtrl.js',
                    templateUrl: 'modules/photo/myphoto.tpl.html'
                })
                .when('/school/:schoolId/parent/:parentId/photo', {
                    controller: 'myPhotoCtrl',
                    controllerUrl: 'modules/photo/myPhotoCtrl.js',
                    templateUrl: 'modules/photo/myphoto.tpl.html'
                });
            }
        ]);
        app.factory('PhotoService', function($rootScope, $http){
            return {
                getByUrl: function(url) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + url
                    }).then(function(res) {
                        return res.data || {};
                    }, function(err) {
                        throw err;
                    });
                },
                remove: function(schoolId, photoId) {
                    return $http({
                        method: 'DELETE',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/photo/' + photoId
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