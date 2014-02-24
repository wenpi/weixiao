/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
	    //Step6: use `app.register` to register controller/service/directive/filter
	    app.controller('userPickerCtrl', ['$scope', '$routeParams', '$location', '$http',
	        function($scope, $routeParams, $location, $http){
	            $scope.common.userPicker = {};
	            $scope.common.userPicker.title = '请选择';
	            $scope.common.userPicker.multi = false;
	            $scope.common.userPicker.users = [];

	            function hide() {
	            	$($scope.common.userPicker.users).each(function(i, user) {
	            		delete user.picked;
	            	});
	            	$scope.common.userPicker.users = [];
	            	$("#wx-user-picker").hide();
	            }
	            $scope.common.userPicker.hide = hide;

	            $scope.common.userPicker.show = function(opts) {
	            	var opts = $.extend({value: ''}, opts || {});
	            	$scope.common.userPicker.title = opts.title || '请选择';
	            	$scope.common.userPicker.users = opts.users || [];
	            	$scope.common.userPicker.multi = opts.multi;
	            	$scope.common.userPicker.onSelect = opts.onSelect || function() {};
	            	console.info(opts.value);
	            	$($scope.common.userPicker.users).each(function(i, user) {
	            		if (opts.value.indexOf(user.id) >= 0) {
	            			user.picked = true;
	            		}
	            	});
	            	$("#wx-user-picker").show();
	            };
	            $scope.common.userPicker.confirm = function(opts) {
	            	var selecteds = [];
	            	$($scope.common.userPicker.users).each(function(i, user) {
	            		if (user.picked) {
	            			selecteds.push(user);
	            		}
	            	});
	            	$scope.common.userPicker.onSelect(selecteds);
	            	hide();
	            };

	            $scope.common.userPicker.pick = function(user) {
	            	user.picked = true;
	            	if (!$scope.common.userPicker.multi) {
	            		$scope.common.userPicker.onSelect([user]);
	            		hide();
	            	}
	            }
	        }]
	    );
    }
});