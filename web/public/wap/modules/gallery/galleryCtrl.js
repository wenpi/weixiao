/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('galleryCtrl', 
        ['$scope', '$routeParams', '$location', '$http', 
         'GalleryService', 'StudentService', 'UserService',
        function($scope, $routeParams, $location, $http, GalleryService, StudentService, UserService){
            $scope.gallery = {};
            $scope.gallery.view = '';
            $scope.gallery.title = '';
            $scope.gallery.returnType = "home";
            $scope.gallery.records = null;

            var uri;

            function refresh() {
                $scope.gallery.records = null;

                GalleryService.getGallerysByUri(uri)
                .then(function(records) {
                    $scope.gallery.records = records;
                });
            }

            $scope.gallery.remove = function(record) {
                if (confirm("确认删除该条班级圈？")) {
                    GalleryService.remove(record)
                    .then(function() {
                        //alert('删除成功！');
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

                if (path.indexOf('class') >= 0 && path.indexOf('teacher') < 0) {
                    var classId = $scope.gallery.classId = $routeParams.classId;
                    uri += '/class/' + classId + '/gallery';

                    if ($scope.session.user.isTeacher()) {
                        $($scope.session.user.wexClasses).each(function(i, wexClass) {
                            if (wexClass.id == classId) {
                                $scope.gallery.title = wexClass.name + '的班级圈';
                            }
                        });    
                    } else {
                        $scope.gallery.title = '班级圈';
                        $scope.gallery.studentId = $scope.session.user.students[0].id;
                    }
                    
                } else if (path.indexOf('student') >= 0) {
                    var studentId = $scope.gallery.studentId = $routeParams.studentId;
                    uri += '/student/' + studentId + '/gallery';
                    if ($scope.session.user.isTeacher()) {
                        $scope.gallery.returnType = "class";
                    }
                    StudentService.get($scope.session.user.schoolId, studentId).then(function(student) {
                        $scope.gallery.title = student.name + '的班级圈';
                    });
                    $scope.gallery.returnType = "class";
                } else if (path.indexOf('teacher') >= 0) {
                    var classId = $scope.gallery.classId = $routeParams.classId;
                    var teacherId = $scope.gallery.teacherId = $routeParams.teacherId;
                    uri = '/api/class/' + classId + '/teacher/' + teacherId + '/gallery';
                    $scope.gallery.returnType = "class";
                    UserService.get(teacherId).then(function(user) {
                        $scope.gallery.title = user.name + '的班级圈';
                    });
                } else if (path.indexOf('school') >= 0) {
                    var schoolId = $routeParams.schoolId;
                    uri += '/school/' + schoolId + '/gallery';
                    return; //not support yet
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