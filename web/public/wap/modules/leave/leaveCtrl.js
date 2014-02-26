/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){

	    app.register.controller('leaveCtrl', ['$scope', '$routeParams', '$location', '$http', 'LeaveService', 'StudentService',
	        function($scope, $routeParams, $location, $http, LeaveService, StudentService) {
	        	$scope.leave = {};
	        	$scope.leave.title = '';
	        	$scope.leave.returnType = "home";
	        	$scope.leave.records = null;

	        	var uri;

	        	function refresh() {
	        		LeaveService.getLeavesByUri(uri)
    				.then(function(records) {
    					$scope.leave.records = records.sort(function(a, b) { return a.startDate > b.startDate ? -1 : 1;});
    				});
	        	}

	        	$scope.leave.remove = function(record) {
	        		if (confirm("确认删除" + record.studentName + "的请假记录？")) {
	        			LeaveService.remove(record)
	        			.then(function() {
	        				alert('删除成功！');
	        				refresh();
	        			}, function() {
	        				alert('删除失败！');
	        			});
	        		}
	        	};
	        	$scope.$watch("session.user", function() {
	        		if (!$scope.session.user) {
	        			return;
	        		}

	        		var path = $location.path();

	        		uri = '/api/school/' + $scope.session.user.schoolId;

	        		if (path.indexOf('class') >= 0) {
	        			var classId = $routeParams.classId;
	        			uri += '/class/' + classId + '/leave';
	        			$($scope.session.user.wexClasses).each(function(i, wexClass) {
	        				if (wexClass.id == classId) {
	        					$scope.leave.title = wexClass.name;
	        				}
	        			});
	        		} else if (path.indexOf('student') >= 0) {
	        			var studentId = $routeParams.studentId;
	        			uri += '/student/' + studentId + '/leave';
	        			
	        			StudentService.get($scope.session.user.schoolId, studentId).then(function(student) {
	                        $scope.leave.title = student.name;
	                    });

	                    if ($scope.session.user.isTeacher()) {
	                    	$scope.leave.returnType = 'class';
	                    }
	        		} else if (path.indexOf('school') >= 0) {
	        			var schoolId = $routeParams.schoolId;
	        			uri += '/school/' + schoolId + '/leave';
	        			return; //not support yet
	        		} else {
	        			alert('尚未支持该功能。');
	        			return;
	        		}

        			refresh();
	        	});
	        	
	        	$scope.leave.selectClass = function() {
                    if (!$scope.session.user.isAdministrator()) {
                        return;
                    }
                    if (!$scope.common.classPicker.isShow) {
                        $scope.common.classPicker.show({
                            items: $scope.session.user.wexClasses,
                            selected: $routeParams.classId,
                            onSelect: function(wexClass) {
                                $location.path('class/' + wexClass.id + '/leave');
                            }
                        });
                    } else {
                        $scope.common.classPicker.hide();
                    }
                }
	        }]
	    );
    }
});