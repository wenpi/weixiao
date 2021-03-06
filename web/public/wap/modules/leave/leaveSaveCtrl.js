/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

	    app.register.controller('leaveSaveCtrl', ['$scope', '$routeParams', '$location', '$http', 'UserService', 'LeaveService',
	        function($scope, $routeParams, $location, $http, UserService, LeaveService) {
	        	$scope.leave = {};
	        	$scope.leave.record = null;
	        	$scope.leave.title = '添加请假记录';
	        	$scope.leave.studentLabel = '孩子姓名';

	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}
	        		if ($routeParams.id) {
	        			$scope.leave.title = '修改请假记录';
	        			LeaveService.get($routeParams.id).then(function(record) {
	        				$scope.leave.record = record;
	        				if (record.days > 5) {
	        					$scope.leave.dayType = 'self';
	        				}
	        				$scope.leave.record.updatedBy = $scope.session.user.id;
	        			}, function(err) {
	        				alert('抱歉，该请假记录不存在。');
	        			});
	        		} else {
	        			$scope.leave.record = {type: '1', days: '1', startDate: (new Date()).toYMD()};
	        			$scope.leave.record.createdBy = $scope.session.user.id;
	        			if ($scope.session.user.hasStudents()) {
	        				var student = $scope.session.user.students[0];
	        				$scope.leave.record.studentName = student.name;
	        				$scope.leave.record.studentId = student.id;
	        			} else if ($scope.session.user.isTeacher()) {
	        				$scope.leave.studentLabel = "学生姓名";
	        			}
	        		}
	        	});

	        	$scope.leave.pickStudent = function() {
	        		if ($scope.session.user.isParent()) { return; }
	        		if ($scope.session.user.wexClasses.length == 0) {
	        			alert('没有班级可选');
	        			return;
	        		}
	        		if ($scope.leave.record.id) { return; }
	        		$scope.common.userPicker.show({
	        			title: "请选择一名学生",
	        			users: $scope.session.user.wexClasses[0].students,
	        			onSelect: function(students) {
	        				var student = students[0];
	        				$scope.leave.record.studentName = student.name;
	        				$scope.leave.record.studentId = student.id;
	        			}
	        		});
	        	};

	        	$scope.leave.pickDate = function() {
	        		$scope.common.datePicker.show({
	        			title: "请选择开始日期",
	        			date: new Date($scope.leave.record.startDate),
	        			//description: "请选择非公众假日",
	        			onSelect: function(date) {
	        				$scope.leave.record.startDate = date.toYMD();
	        			}
	        		});
	        	};

	        	$scope.leave.saveRecord = function() {
	        		if ($scope.leave.record.days <= 0) {
	        			alert("输入无效天数");
	        			return;
	        		}
	        		$scope.leave.record.days = parseInt($scope.leave.record.days, 10);
	        		
	        		var endDate = new Date($scope.leave.record.startDate);
	        		endDate.addDays($scope.leave.record.days - 1);
	        		$scope.leave.record.endDate = endDate.toYMD();

	        		var message = $scope.leave.record.id ? '编辑请假记录成功！' : '新增请假记录成功！';
	        		LeaveService.save($scope.session.user.schoolId, $scope.leave.record).then(function() {
	        			alert(message);
	        			window.history.go(-1);
	        		}, function() {
	        			alert('操作失败，可能该段时间已经有请假记录。');
	        		});
	        	};
	        }]
	    );
    }
});