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
	            	$scope.common.userPicker.users = [];
	            	$("#wx-user-picker").hide();
	            }
	            $scope.common.userPicker.hide = hide;

	            $scope.common.userPicker.show = function(opts) {
	            	var opts = opts || {};
	            	$scope.common.userPicker.title = opts.title || '请选择';
	            	$scope.common.userPicker.users = opts.users || [];
	            	$scope.common.userPicker.onSelect = opts.onSelect || function() {};
	            	$("#wx-user-picker").show();
	            };
	            $scope.common.userPicker.confirm = function(opts) {
	            	hide();
	            };

	            $scope.common.userPicker.pick = function(user) {
	            	$scope.common.userPicker.onSelect([user]);
	            	hide();
	            }
	        }]
	    );
    }
});