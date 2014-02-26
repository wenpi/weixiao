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
                .when('/class/:classId/gallery', {
                    controller: 'galleryCtrl',
                    controllerUrl: 'modules/gallery/galleryCtrl.js',
                    templateUrl: 'modules/gallery/gallery.tpl.html'
                })
                .when('/class/:classId/gallery/new', {
                    controller: 'gallerySaveCtrl',
                    controllerUrl: 'modules/gallery/gallerySaveCtrl.js',
                    templateUrl: 'modules/gallery/gallery.save.tpl.html'
                })
                .when('/student/:studentId/gallery', {
                    controller: 'galleryCtrl',
                    controllerUrl: 'modules/gallery/galleryCtrl.js',
                    templateUrl: 'modules/gallery/gallery.tpl.html'
                })
                .when('/student/:studentId/gallery/new', {
                    controller: 'gallerySaveCtrl',
                    controllerUrl: 'modules/gallery/gallerySaveCtrl.js',
                    templateUrl: 'modules/gallery/gallery.save.tpl.html'
                })
                .when('/class/:classId/teacher/:teacherId/gallery', {
                    controller: 'galleryCtrl',
                    controllerUrl: 'modules/gallery/galleryCtrl.js',
                    templateUrl: 'modules/gallery/gallery.tpl.html'
                });
            }
        ]);

        app.factory('GalleryService', function($rootScope, $http){
            return {
                save: function(record) {
                    var successCode = 201, method = 'POST', uri;
                    var schoolId = record.schoolId,
                        classId = record.classId,
                        studentId = record.studentId;

                    if (studentId) {
                        uri =  WEXPATH + '/api/school/' + schoolId + '/student/' + studentId + '/gallery';
                    } else {
                        uri =  WEXPATH + '/api/school/' + schoolId + '/class/' + classId + '/gallery';
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
                    var galleryId = record.id;
                    return $http({
                        method: 'DELETE',
                        cache: false,
                        url: WEXPATH + '/api/school/' + schoolId + '/gallery/' + galleryId
                    }).then(function(res) {
                        return true;
                    }, function(err) {
                        throw err;
                    });
                },
                getGallerysByUri: function(uri) {
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