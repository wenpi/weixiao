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
	            $scope.common.userPicker.hide = function() {
	            	$("#wx-user-picker").hide();
	            };
	            $scope.common.userPicker.show = function(opts) {
	            	$scope.common.userPicker.title = opts.title || '请选择';
	            	$("#wx-user-picker").show();
	            };
	            $scope.common.userPicker.confirm = function(opts) {
	            	$("#wx-user-picker").hide();
	            };
	        }]
	    );
    }
});