/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('mainCtrl', ['$scope', '$routeParams', '$location', '$http',
        function($scope, $routeParams, $location, $http) {
            $scope.main = {};
            $scope.main.inited = true;
            
            $scope.$watch("session.user", function() {
                if (!$scope.session.user) {
                    return;
                }
                var user = $scope.session.user;
                if (user.isTeacher() && user.hasWexClasses()) { // 管理员/老师身份
                    var wexClass = user.wexClasses[0]
                    $scope.main.noticeUrl = '#/class/' + wexClass.id + '/notice';
                    
                    $scope.main.messageUrl = '#/class/' + wexClass.id + '/message';
                    $scope.main.messageLabel = '班级留言';
                    
                    $scope.main.myPhotoUrl = '#/school/' + user.schoolId + '/teacher/' + user.id + '/photo';

                    $scope.main.leaveUrl = '#/class/' + wexClass.id + '/leave';
                    $scope.main.leaveLabel = '请假考勤';

                    $scope.main.studentUrl = '#/class/' + wexClass.id + '/student';
                    $scope.main.studentLabel = '学生资料';

                    $scope.main.pathUrl = '#/class/' + wexClass.id + '/path';

                    $scope.main.galleryUrl = '#/class/' + wexClass.id + '/gallery';
                } else if (user.isParent() && user.hasStudents()) { // 家长身份
                    var student = $scope.session.user.students[0];
                    $scope.main.noticeUrl = '#/class/' + student.classId + '/notice';

                    $scope.main.messageUrl = '#/student/' + student.id + '/message';
                    $scope.main.messageLabel = '我的留言';

                    $scope.main.myPhotoUrl = '#/school/' + user.schoolId + '/parent/' + user.id + '/photo';

                    $scope.main.leaveUrl = '#/student/' + student.id + '/leave';
                    $scope.main.leaveLabel = '我的请假';

                    $scope.main.studentUrl = '#/class/' + student.classId + '/student/' + student.id;
                    $scope.main.studentLabel = '家庭资料';

                    $scope.main.pathUrl = '#/student/' + student.id + '/path';

                    $scope.main.galleryUrl = '#/class/' + student.classId + '/gallery';
                } else {
                    alert("当前用户数据异常，无法初始化导航页面。");
                    $scope.main.inited = false;
                }
            });
        }]
    );
    }
});