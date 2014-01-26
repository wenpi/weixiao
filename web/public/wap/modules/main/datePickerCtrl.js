/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
	    //Step6: use `app.register` to register controller/service/directive/filter
	    app.controller('datePickerCtrl', ['$scope', '$routeParams', '$location', '$http',
	        function($scope, $routeParams, $location, $http) {
	        	var title = '请选择日期';

	            $scope.common.datePicker = {};
	            $scope.common.datePicker.valid = true;

	            $scope.common.datePicker.ydate;
	            $scope.common.datePicker.mdate;
	            $scope.common.datePicker.ddate;

	            function hide() {
	            	$("#wx-date-picker").hide();
	            }
	            $scope.common.datePicker.hide = hide;

	            $scope.common.datePicker.show = function(opts) {
	            	var opts = opts || {};
	            	$scope.common.datePicker.ydate = opts.date || new Date();
	            	$scope.common.datePicker.mdate = $scope.common.datePicker.ydate.clone();
	            	$scope.common.datePicker.ddate = $scope.common.datePicker.ydate.clone();
	            	$scope.common.datePicker.title = opts.title || title;
	            	$scope.common.datePicker.description = opts.description || '';
	            	$scope.common.datePicker.onSelect = opts.onSelect || function() {};
	            	$("#wx-date-picker").show();
	            };
	            $scope.common.datePicker.confirm = function(opts) {
	            	try {
	            		/*
	            		if (!Date.validateDay(
	            				$scope.common.datePicker.ddate.toFormat("DD"), 
	            				$scope.common.datePicker.ydate.toFormat("YYYY"),
	            				$scope.common.datePicker.mdate.toFormat("MM")
	            			)) {
	            			alert("无效日期。");
	            			return;
	            		}*/
	            		var dateStr = 
		            		$scope.common.datePicker.ydate.toFormat("YYYY") + '-' +
		            		$scope.common.datePicker.mdate.toFormat("MM") + '-' +
		            		$scope.common.datePicker.ddate.toFormat("DD");
	            		var date = new Date(dateStr);
						$scope.common.datePicker.onSelect(date);
	            		hide();
	            	} catch(e) {
						alert("非法日期。");            		
	            	}
	            };
	        }]
	    );
    }
});