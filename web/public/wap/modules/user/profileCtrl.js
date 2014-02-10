/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

	    app.register.controller('profileCtrl', ['$scope', '$routeParams', '$location', '$http', 'UserService', 'StudentService',
	        function($scope, $routeParams, $location, $http, UserService, StudentService) {
	        	$scope.user = {};
	        	$scope.user.record = null;
	        	$scope.user.tab = 'basic';

	        	var userId = $routeParams.id;

	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}
        			UserService.get(userId).then(function(record) {
        				$scope.user.record = record;
        				$scope.user.record.updatedBy = $scope.session.user.id;
        			}, function(err) {
        				alert('抱歉，该学生资料不存在。');
        			});
	        	});

	        	$scope.user.saveRecord = function() {
	        		UserService.save(userId, $scope.user.record).then(function() {
	        			alert("保存成功。");
	        		}, function() {
	        			alert('抱歉，操作失败！');
	        		});
	        	};

	        	$scope.user.savePassword = function() {
	        		UserService.save(userId, {
	        			oldPassword: $scope.user.record.oldpassword,
	        			password: $scope.user.record.newpassword,
	        			updatedBy: $scope.user.record.updatedBy
	        		}).then(function() {
	        			alert("修改密码成功。");
	        		}, function() {
	        			alert('抱歉，操作失败！');
	        		});
	        	};
	        }]
	    );
    }
});