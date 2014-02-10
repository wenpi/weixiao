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
                        if ($scope.session.user.type === '1') {
                            $scope.student.view = 'tvs'; // teacher view student
                        }
                        $($scope.session.user.wexClasses).each(function(i, wexClass) {
                            if (wexClass.id == classId) {
                                $scope.student.title = wexClass.name;
                            }
                        });
                    } else {
                        if ($scope.session.user.type === '1' && 
                            $scope.session.user.wexClasses &&
                            $scope.session.user.wexClasses.length > 0) {
                            $location.path("class/" + $scope.session.user.wexClasses[0].id + '/student');
                        } else if ($scope.session.user.type === '0' &&
                            $scope.session.user.students &&
                            $scope.session.user.students.length > 0) {
                            var student = $scope.session.user.students[0], classId = student.classId;
                            $location.path("class/" + classId + '/student/' + student.id);
                        } else {
                            alert('没有可以请假数据可查看');
                        }
                        return;
                    }

                    refresh();
                });
            }]
        );
    }
});