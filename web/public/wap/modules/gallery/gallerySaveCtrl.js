/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

        app.register.controller('gallerySaveCtrl', ['$scope', '$q', '$routeParams', '$location', '$http', 'GalleryService',
            function($scope, $q, $routeParams, $location, $http, GalleryService) {
                $scope.gallery = {};
                $scope.gallery.record = null;
                $scope.gallery.studentLabel = '孩子姓名';
                $scope.gallery.refreshPhotos = true;

                $scope.$watch("session.user", function() {
                    if (!$scope.session.user) {
                        return;
                    }

                    $scope.gallery.record = {};
                    $scope.gallery.record.schoolId = $scope.session.user.schoolId;
                    $scope.gallery.record.createdBy = $scope.session.user.id;
                    
                    if ($scope.session.user.isParent() && $scope.session.user.hasStudents()) {
                        var student = $scope.session.user.students[0];
                        $scope.gallery.record.classId = student.classId;
                        $scope.gallery.record.studentId = student.id;
                        $scope.gallery.record.studentName = student.name
                    } else if ($scope.session.user.isTeacher()) {
                        //$scope.gallery.studentLabel = "学生姓名";
                        $scope.gallery.record.classId = $scope.session.user.wexClasses[0].id;
                    }
                });

                $scope.gallery.pickStudent = function() {
                    if ($scope.session.user.isParent()) { return; }
                    if ($scope.session.user.wexClasses.length == 0) {
                        alert('没有班级可选');
                        return;
                    }
                    if ($scope.gallery.record.id) { return; }

                    $scope.common.userPicker.show({
                        title: "选择多名学生",
                        users: $scope.session.user.wexClasses[0].students,
                        multi: true,
                        value: $scope.gallery.record.studentIds || "",
                        onSelect: function(students) {
                            if (students.length > 9) {
                                alert("选择的孩子总数过多。");
                                return;
                            }
                            var names = [], ids = [];
                            $(students).each(function(i, student) {
                                names.push(student.name);
                                ids.push(student.id);
                            });
                            $scope.gallery.record.studentNames = names.join();
                            $scope.gallery.record.studentIds = ids.join();
                            $scope.gallery.record.students = students;
                        }
                    });
                };

                $scope.gallery.pickPhotos = function() {
                    $scope.common.photoPicker.show({
                        title: "选择图片(最多9张)",
                        multi: true,
                        user: $scope.session.user,
                        refresh: $scope.gallery.refreshPhotos,
                        onSelect: function(photos) {
                            $scope.gallery.record.photos = photos;
                        }
                    });
                    if ($scope.gallery.refreshPhotos) {
                        $scope.gallery.refreshPhotos = false;
                    }
                };

                $scope.gallery.saveRecord = function() {
                    var promises = [],
                        record = $.extend({}, $scope.gallery.record), photosIds = [];

                    $(record.photos).each(function(i, photo) {
                        photosIds.push(photo.id);
                    });
                    record.photos = photosIds;

                    promises.push(GalleryService.save(record));

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