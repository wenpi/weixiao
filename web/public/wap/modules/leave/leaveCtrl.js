/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
	    app.register.controller('leaveCtrl', ['$scope', '$routeParams', '$location', '$http',
	        function($scope, $routeParams, $location, $http) {
	        	var PATH = $scope.PATH, uri = '/api/school/d28eefe9-db3b-4db5-a469-424ac5d187d8/class/4fe2adba-e60f-4276-9ff1-5d49a6269e81/leave';
	            // 查询请假数据
	            function queryLeaves () {
			    	$http({
			            method: 'GET',
			            url: PATH + uri
			        }).then(function(res) {
			            console.info(res);
			        }, function(err) {
			        	console.info(err);
			        });
			    }
			    queryLeaves();
	        }]
	    );
    }
});