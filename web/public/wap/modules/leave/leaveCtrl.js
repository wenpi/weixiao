/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

	    app.register.controller('leaveCtrl', ['$scope', '$routeParams', '$location', '$http', 'UserService', 'LeaveService',
	        function($scope, $routeParams, $location, $http, UserService, LeaveService) {
	        	$scope.leave = {};
	        	$scope.leave.wexClasses = null;
	        	$scope.leave.wexClassName = '';
	        	$scope.leave.records = null;

	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}
	        		UserService.getClassesByTeacher($scope.session.user)
	        		.then(function(wexClasses) {
	        			if (wexClasses && wexClasses.length > 0) {
	        				$scope.leave.className = wexClasses[0].name;
	        				LeaveService.getLeavesByClass($scope.session.user.school_id, wexClasses[0])
	        				.then(function(records) {
	        					$scope.leave.records = records;
	        					console.info($scope.leave.records);
	        				});
	        			}
	        		});
	        	});


	        }]
	    );
    }
});