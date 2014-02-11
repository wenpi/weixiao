/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

	    app.register.controller('messageSaveCtrl', ['$scope', '$routeParams', '$location', '$http', 'MessageService',
	        function($scope, $routeParams, $location, $http, MessageService) {
	        	$scope.message = {};
	        	$scope.message.record = null;

	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}

        			$scope.message.record = {top: 0, type: 0, sendsms: 0};
        			$scope.message.record.createdBy = $scope.session.user.id;
        			if ($scope.session.user.type === '0' &&
                        $scope.session.user.students &&
                        $scope.session.user.students.length > 0) {
                        var student = $scope.session.user.students[0];
                    	$scope.message.record.classId = student.classId;
                    	$scope.message.record.studentId = student.id;
                    	$scope.message.record.studentName = student.name
                    }
	        	});

	        	$scope.message.saveRecord = function() {
	        		var record = $scope.message.record;
	        		MessageService.save(record)
	        		.then(function() {
	        			alert("操作成功！");
	        			$location.path("message");
	        		}, function() {
	        			alert('抱歉，操作失败！');
	        		});
	        	};
	        }]
	    );
    }
});