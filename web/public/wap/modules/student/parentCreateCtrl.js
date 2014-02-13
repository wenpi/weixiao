/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

	    app.register.controller('parentCreateCtrl', ['$scope', '$routeParams', '$location', '$http', 'UserService', 'StudentService',
	        function($scope, $routeParams, $location, $http, UserService, StudentService) {
	        	$scope.student = {};
	        	$scope.student.record = null;
	        	$scope.student.name = '';

	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}
	        		if ($routeParams.classId && $routeParams.studentId) {
	        			var schoolId = $scope.session.user.schoolId;
	        			StudentService.get(schoolId, $routeParams.studentId)
	        			.then(function(student) {
	        				$scope.student.name = student.name;
	        				$scope.student.record = {};
	        				$scope.student.record.createdBy = $scope.session.user.id;
	        			}, function(err) {
	        				alert('抱歉，无法获得该学生基本信息。');
	        			});
	        		} else {
	        			alert("抱歉，读取该名学生资料异常！");
	        			return;
	        		}
	        	});
	        	if ($scope.session.user) {
	        		$scope.student.record = {};
	        	}

	        	$scope.student.saveRecord = function() {
	        		var schoolId = $scope.session.user.schoolId;
	        		var classId = $routeParams.classId;
	        		var studentId = $routeParams.studentId;
	        		StudentService.saveParent(schoolId, studentId, $scope.student.record)
	        		.then(function() {
	        			alert('新增成功');
	        			window.history.go(-1);
	        		}, function() {
	        			alert('抱歉，操作失败！可能达到家长总数上限。');
	        		});
	        	};
	        }]
	    );
    }
});