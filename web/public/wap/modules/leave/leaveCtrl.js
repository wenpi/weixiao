/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

	    app.register.controller('leaveCtrl', ['$scope', '$routeParams', '$location', '$http', 'UserService', 'LeaveService',
	        function($scope, $routeParams, $location, $http, UserService, LeaveService) {
	        	$scope.leave = {};
	        	$scope.leave.view = '';
	        	$scope.leave.title = '';
	        	$scope.leave.records = null;

	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}

	        		var path = $location.path(), uri = '/api/school/' + $scope.session.user.schoolId;

	        		if (path.indexOf('class') >= 0) {
	        			var classId = $routeParams.classId;
	        			uri += '/class/' + classId + '/leave';
	        			if ($scope.session.user.type === '1') {
	        				$scope.leave.view = 'tvc'; // teacher view class
	        			}
	        			$($scope.session.user.wexClasses).each(function(i, wexClass) {
	        				if (wexClass.id == classId) {
	        					$scope.leave.title = wexClass.name;
	        				}
	        			});
	        		} else if (path.indexOf('student') >= 0) {
	        			var studentId = $routeParams.studentId;
	        			uri += '/student/' + studentId + '/leave';
	        			if ($scope.session.user.type === '1') {
	        				$scope.leave.view = 'tvs'; // teacher view student
	        			} else if ($scope.session.user.type === '0') {
	        				$scope.leave.view = 'pvs'; // teacher view student
	        			}
	        			$($scope.session.user.wexClasses).each(function(i, wexClass) {
        					$(wexClass.students).each(function(j, student) {
		        				if (student.id == studentId) {
		        					$scope.leave.title = student.name;
		        				}
		        			});
	        			});
	        			
	        		} else if (path.indexOf('school') >= 0) {
	        			var schoolId = $routeParams.schoolId;
	        			uri += '/school/' + schoolId + '/leave';
	        			return; //not support yet
	        		} else {
	        			if ($scope.session.user.type === '1' && 
		        			$scope.session.user.wexClasses &&
		        			$scope.session.user.wexClasses.length > 0) {
	        				$location.path("class/" + $scope.session.user.wexClasses[0].id + '/leave');
	        			} else if ($scope.session.user.type === '0') {
	        				$location.path("student/" + 1 + '/leave');
	        			} else {
	        				alert('没有可以请假数据可查看');
	        			}
	        			return;
	        		}

        			LeaveService.getLeavesByUri(uri)
    				.then(function(records) {
    					$scope.leave.records = records.sort(function(a, b) { return a.startDate > b.startDate ? -1 : 1;});
    				});
	        	});

	        	$scope.leave.showStudents = function() {
	        		
	        	}
	        }]
	    );
    }
});