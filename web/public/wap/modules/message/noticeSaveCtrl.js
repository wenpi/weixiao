/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

	    app.register.controller('noticeSaveCtrl', ['$scope', '$routeParams', '$location', '$http', 'MessageService',
	        function($scope, $routeParams, $location, $http, MessageService) {
	        	$scope.notice = {};
	        	$scope.notice.record = null;

	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}

        			$scope.notice.record = {top: 0, type: 1, sendsms: 0};
        			$scope.notice.record.createdBy = $scope.session.user.id;
	        	});

	        	$scope.notice.saveRecord = function() {
	        		var record = $scope.notice.record;
	        		record.classId = $routeParams.classId;
	        		record.teacherId = record.createdBy = $scope.session.user.id;
	        		MessageService.save(record)
	        		.then(function() {
	        			alert("操作成功！");
	        			window.history.go(-1);
	        		}, function() {
	        			alert('抱歉，操作失败！');
	        		});
	        	};
	        }]
	    );
    }
});