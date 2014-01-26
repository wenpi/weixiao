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
	        	$scope.leave.action = '添加请假记录';

	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}
	        		if ($routeParams.id) {
	        			$scope.leave.action = '修改请假记录';
	        			LeaveService.get($routeParams.id).then(function(record) {
	        				$scope.leave.record = record;
	        			}, function(err) {
	        				alert('抱歉，该请假记录不存在。');
	        			});
	        		} else {
	        			$scope.leave.record = {type: '1', days: '1'};
	        		}
	        	});

	        	$scope.leave.showStudents = function() {
	        		$scope.common.userPicker.show({
	        			title: "请选择一名学生",
	        			data: [{id: 'id', name: '学生'}]
	        		});
	        	};
	        	$scope.leave.saveRecord = function() {
	        		var endDate = new Date($scope.leave.record.start_date);
	        		endDate.addDays($scope.leave.record.days - 1);
	        		$scope.leave.record.endDate = endDate.toYMD();
	        		console.info($scope.leave.record);
	        		LeaveService.save($scope.session.user.schoolId, $scope.leave.record).then(function() {
	        			alert('保存请假记录成功！');
	        		}, function() {
	        			alert('保存失败，可能该段时间已经有请假记录。');
	        		});
	        		//$scope.leave.record.end_date = 
	        	};
	        }]
	    );
    }
});