/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

        app.register.controller('myPhotoCtrl', ['$scope', '$routeParams', '$location', '$http', 'PhotoService',
            function($scope, $routeParams, $location, $http, PhotoService) {
                $scope.photo = {};
                $scope.photo.records = null;

                var uri;

                function refresh() {
                    PhotoService.getByUrl(uri)
                    .then(function(records) {
                        //records = [{path: 111}, {path: 222}];
                        $scope.photo.records = records.sort(function(a, b) { return a.startDate > b.startDate ? -1 : 1;});
                    });
                }

                $scope.photo.remove = function(record) {
                    if (confirm("确认删除该批图片？")) {
                        PhotoService.remove(record.id)
                        .then(function() {
                            alert('删除成功！');
                            refresh();
                        }, function() {
                            alert('删除失败！');
                        });
                    }
                };
                $scope.$watch("session.user", function() {
                    if (!$scope.session.user) {
                        return;
                    }

                    var path = $location.path();

                    var schoolId = $routeParams.schoolId;
                    if (path.indexOf('teacher') >= 0) {
                        var teacherId = $scope.photo.teacherId = $routeParams.teacherId;
                        uri = '/api/school/' + schoolId + '/teacher/' + teacherId + '/photo';
                    } else if (path.indexOf('parent') >= 0) {
                        var parentId = $scope.photo.parentId = $routeParams.parentId;
                        uri = '/api/school/' + schoolId + '/parent/' + parentId + '/photo';
                    } else {
                        alert("未支持的功能.");
                        return;
                    }

                    refresh();
                });
            }]
        );
    }
});