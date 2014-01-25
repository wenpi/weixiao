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
	        			$scope.leave.record = {};
	        		}
	        	});

	        	setTimeout(function() {
					$('#start_date').intimidatetime({
						format: 'yyyy-MM-dd',
						previewFormat: 'yyyy-MM-dd'
					});
	        	}, 0);
	        }]
	    );
    }
});