/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

	    app.register.controller('studentViewCtrl', ['$scope', '$routeParams', '$location', '$http', 'UserService', 'StudentService',
	        function($scope, $routeParams, $location, $http, UserService, StudentService) {
	        	$scope.student = {};
	        	$scope.student.record = {name: ''};
	        	$scope.student.tab = 'basic';

	        	var schoolId, classId, studentId;

	        	classId = $scope.student.classId = $routeParams.classId;
	        	studentId = $routeParams.id;

	        	function refreshParents() {
					StudentService.getParents(schoolId, studentId)
        			.then(function(parents) {
        				$scope.student.parents = parents;
        			}, function(err) {
        				alert('抱歉，无法获得该学生家长信息。');
        			});
	        	}

	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}
	        		if ($routeParams.classId && $routeParams.id) {
	        			schoolId = $scope.session.user.schoolId;
	        			StudentService.get(schoolId, studentId).then(function(record) {
	        				$scope.student.record = record;
	        				$scope.student.record.updatedBy = $scope.session.user.id;
	        			}, function(err) {
	        				alert('抱歉，无法获得该学生基本信息。');
	        			});
	        			// 获得家长列表
	        			refreshParents();
	        		} else {
	        			alert("抱歉，读取该名学生资料异常！");
	        			return;
	        		}
	        	});

	        	$scope.$watch("student.tab", function() {
	        		if (!$scope.student.tab) { return; }
	        		$.fn.cookie("student.view.tab", $scope.student.tab);
	        	});
	        	var cookieVal = $.fn.cookie("student.view.tab");
	        	if (cookieVal) {
	        		$scope.student.tab = cookieVal;
	        	}

	        	// 保存基本信息
	        	$scope.student.saveRecord = function() {
	        		var message = $scope.student.record.id ? '编辑基本信息成功！' : '新增学生成功！';
	        		StudentService.save(schoolId, classId, $scope.student.record).then(function() {
	        			alert(message);
	        			//$location.path("student");
	        		}, function() {
	        			alert('抱歉，操作失败。');
	        		});
	        	};

	        	// 删除某家长
	        	$scope.student.removeParent = function(parent) {
	        		if (confirm("请确认删除家长访问账号：" + parent.name + "。")) {
	        			StudentService.removeParent(schoolId, parent.id).then(function() {
		        			alert("删除该家长访问账号成功。");
		        			refreshParents();
		        		}, function() {
		        			alert('抱歉，操作失败。');
		        		});
	        		}
	        	}

	        	// 删除某学生
	        	$scope.student.remove = function() {
	        		var student = $scope.student.record;
	        		if (confirm("请确认删除学生：" + student.name + "。\n所有关联家长账号亦将同时删除！")) {
	        			StudentService.remove(schoolId, student.id).then(function() {
		        			alert("删除该名学生成功。");
		        			$location.path("class/" + classId + "/student");
		        		}, function() {
		        			alert('抱歉，操作失败。');
		        		});
	        		}
	        	}
	        }]
	    );
    }
});