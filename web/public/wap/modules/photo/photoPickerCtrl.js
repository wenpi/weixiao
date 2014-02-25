/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //Step6: use `app.register` to register controller/service/directive/filter
        app.controller('photoPickerCtrl', ['$scope', '$routeParams', '$location', '$http', 'PhotoService',
            function($scope, $routeParams, $location, $http, PhotoService){
                $scope.common.photoPicker = {};
                $scope.common.photoPicker.title = '请选择';
                $scope.common.photoPicker.multi = false;
                $scope.common.photoPicker.selecteds = [];
                $scope.common.photoPicker.photos = null;

                function refresh() {
                    var uri = '', user = $scope.session.user;
                    if (!user) { return; }
                    if ($scope.common.photoPicker.photos != null) { return; }

                    if (user.isTeacher()) {
                        uri = '/api/school/' + user.schoolId + '/teacher/' + user.id + '/photo';
                    } else {
                        uri = '/api/school/' + user.schoolId + '/parent/' + user.id + '/photo';
                    }

                    $scope.common.photoPicker.photos = null;
                    PhotoService.getByUrl(uri)
                    .then(function(records) {
                        $scope.common.photoPicker.photos = records;
                    });
                }

                function hide() {
                    $("#wx-photo-picker").hide();
                }
                $scope.common.photoPicker.hide = hide;

                $scope.common.photoPicker.show = function(opts) {
                    var opts = $.extend({value: ''}, opts || {});
                    $scope.common.photoPicker.title = opts.title || '请选择';
                    $scope.common.photoPicker.multi = opts.multi;
                    $scope.common.photoPicker.onSelect = opts.onSelect || function() {};
                    $("#wx-photo-picker").show();
                    if (opts.refresh) {
                        $scope.common.photoPicker.selecteds = [];
                        $scope.common.photoPicker.photos = null;
                    }
                    refresh();
                };

                $scope.common.photoPicker.confirm = function(opts) {
                    var photos = [];
                    $($scope.common.photoPicker.selecteds).each(function(i, item) {
                        photos.push({id: item.id, path: item.path});
                    });
                    $scope.common.photoPicker.onSelect(photos);
                    hide();
                };

                $scope.common.photoPicker.pick = function(photo) {
                    if ($scope.common.photoPicker.selecteds.length == 9) { return; }
                    if (photo.picked) {
                        return;
                    }
                    photo.picked = true;
                    $scope.common.photoPicker.selecteds.push(photo);
                }
        
                $scope.common.photoPicker.remove = function(photo) {
                    if ($scope.common.photoPicker.selecteds.length == 0) { return; }
                    photo.picked = false;
                    var idx = -1;
                    $($scope.common.photoPicker.selecteds).each(function(i, item) {
                        if (photo.id === item.id) {
                            idx = i;
                        }
                    });
                    if (idx >= 0) {
                        $scope.common.photoPicker.selecteds.splice(idx, 1);
                    }
                }
            }]
        );
    }
});