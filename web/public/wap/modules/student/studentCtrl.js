/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

        app.register.controller('studentCtrl', ['$scope', '$routeParams', '$location', '$http', 'UserService', 'StudentService',
            function($scope, $routeParams, $location, $http, UserService, StudentService) {
                $scope.student = {};
                $scope.student.view = '';
                $scope.student.title = '';
                $scope.student.records = null;

                var uri;

                function refresh() {
                    StudentService.getStudentsByUri(uri)
                    .then(function(records) {
                        $scope.student.records = records.sort(function(a, b) { return a.startDate > b.startDate ? -1 : 1;});
                    });
                }

                $scope.student.remove = function(record) {
                    if (confirm("确认删除" + record.name + "账号？")) {
                        StudentService.remove(record.id)
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

                    uri = '/api/school/' + $scope.session.user.schoolId;

                    if (path.indexOf('class') >= 0) {
                        var classId = $scope.student.classId = $routeParams.classId;
                        uri += '/class/' + classId + '/student';
                        $($scope.session.user.wexClasses).each(function(i, wexClass) {
                            if (wexClass.id == classId) {
                                $scope.student.title = wexClass.name;
                            }
                        });
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