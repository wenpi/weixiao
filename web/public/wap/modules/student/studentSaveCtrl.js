/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

	    app.register.controller('studentSaveCtrl', ['$scope', '$routeParams', '$location', '$http', 'UserService', 'StudentService',
	        function($scope, $routeParams, $location, $http, UserService, StudentService) {
	        	$scope.student = {};
	        	$scope.student.record = null;
	        	$scope.student.title = '添加学生';

	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}
	        		if ($routeParams.classId && $routeParams.id) {
	        			$scope.student.title = '修改学生基本信息';
	        			StudentService.get($scope.session.user.schoolId, $routeParams.id).then(function(record) {
	        				$scope.student.record = record;
	        				$scope.student.record.updatedBy = $scope.session.user.id;
	        			}, function(err) {
	        				alert('抱歉，该学生资料不存在。');
	        			});
	        		} else {
	        			$scope.student.record = {gender: 1};
	        			$scope.student.record.createdBy = $scope.session.user.id;
	        		}
	        	});

	        	$scope.student.pickDate = function() {
	        		$scope.common.datePicker.show({
	        			title: "请选择学生生日",
	        			date: new Date($scope.student.record.birthday),
	        			//description: "请选择非公众假日",
	        			onSelect: function(date) {
	        				$scope.student.record.birthday = date.toYMD();
	        			}
	        		});
	        	};

	        	$scope.student.saveRecord = function() {
	        		var message = $scope.student.record.id ? '编辑学生基本信息成功！' : '新增学生成功！';
	        		StudentService.save($scope.session.user.schoolId, $routeParams.classId, $scope.student.record).then(function() {
	        			alert(message);
	        			$location.path("student");
	        		}, function() {
	        			alert('操作失败，可能该段时间已经有学生资料。');
	        		});
	        	};
	        }]
	    );
    }
});