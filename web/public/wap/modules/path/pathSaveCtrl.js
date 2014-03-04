/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

        app.register.controller('pathSaveCtrl', ['$scope', '$q', '$routeParams', '$location', '$http', 'PathService',
            function($scope, $q, $routeParams, $location, $http, PathService) {
                $scope.path = {};
                $scope.path.record = null;
                $scope.path.studentLabel = '孩子姓名';
                $scope.path.refreshPhotos = true;

                $scope.$watch("session.user", function() {
                    if (!$scope.session.user) {
                        return;
                    }

                    $scope.path.record = {};
                    $scope.path.record.schoolId = $scope.session.user.schoolId;
                    $scope.path.record.createdBy = $scope.session.user.id;
                    if ($scope.session.user.hasStudents()) {
                        var student = $scope.session.user.students[0];
                        $scope.path.record.classId = student.classId;
                        $scope.path.record.studentId = student.id;
                        $scope.path.record.studentName = student.name
                    } else if ($scope.session.user.isTeacher()) {
                        $scope.path.studentLabel = "学生姓名";
                    }
                });

                $scope.path.pickStudent = function() {
                    if ($scope.session.user.isParent()) { return; }
                    if ($scope.session.user.wexClasses.length == 0) {
                        alert('没有班级可选');
                        return;
                    }
                    if ($scope.path.record.id) { return; }

                    $scope.common.userPicker.show({
                        title: "选择多名学生",
                        users: $scope.session.user.wexClasses[0].students,
                        multi: true,
                        value: $scope.path.record.studentIds || "",
                        onSelect: function(students) {
                            if (students.length > 9) {
                                alert("选择的孩子总数过多，建议在【班级圈】中发表。");
                                return;
                            }
                            var names = [], ids = [];
                            $(students).each(function(i, student) {
                                names.push(student.name);
                                ids.push(student.id);
                            });
                            $scope.path.record.studentNames = names.join();
                            $scope.path.record.studentIds = ids.join();
                            $scope.path.record.students = students;
                        }
                    });
                };

                $scope.path.pickPhotos = function() {
                    $scope.common.photoPicker.show({
                        title: "选择图片(最多9张)",
                        multi: true,
                        user: $scope.session.user,
                        refresh: $scope.path.refreshPhotos,
                        onSelect: function(photos) {
                            $scope.path.record.photos = photos;
                        }
                    });
                    if ($scope.path.refreshPhotos) {
                        $scope.path.refreshPhotos = false;
                    }
                };

                $scope.path.saveRecord = function() {
                    var promises = [];
                    if ($scope.path.record.students) {
                        $($scope.path.record.students).each(function(i, student) {
                            var record = $.extend({}, $scope.path.record), photosIds = [];
                            record.studentId = student.id;
                            $(record.photos).each(function(i, photo) {
                                photosIds.push(photo.id);
                            });
                            record.photos = photosIds;

                            promises.push(PathService.save(record));
                        });
                    } else {
                        var record = $.extend({}, $scope.path.record), photosIds = [];
                        $(record.photos).each(function(i, photo) {
                            photosIds.push(photo.id);
                        });
                        record.photos = photosIds;

                        promises.push(PathService.save(record));
                    }
                    $q.all(promises).then(function(results) {
                        var allDone = true, failed = 0;
                        $(results).each(function(i, result) {
                            if (result !== true) {
                                allDone = false;
                                failed++;
                            }
                        });
                        if (failed === results.length) {
                            alert("操作失败");
                            return;
                        }
                        if (allDone) {
                            alert('操作成功！');
                        } else {
                            alert("部分操作失败!");
                        }
                        window.history.go(-1);
                    });
                };
            }]
        );
    }
});