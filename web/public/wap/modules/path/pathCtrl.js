/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('pathCtrl', ['$scope', '$routeParams', '$location', '$http', 'PathService', 'StudentService',
        function($scope, $routeParams, $location, $http, PathService, StudentService){
            $scope.path = {};
        	$scope.path.view = '';
        	$scope.path.title = '';
            $scope.path.returnType = "home";
        	$scope.path.records = null; // top record

        	var uri;

        	function refresh() {
        		$scope.path.records = null; // top record

        		PathService.getPathsByUri(uri)
				.then(function(records) {
					$scope.path.records = records;
				});
        	}

        	$scope.path.remove = function(record) {
        		if (confirm("确认删除该条成长记录？")) {
        			PathService.remove(record)
        			.then(function() {
        				//alert('删除成功！');
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
        			var classId = $scope.path.classId = $routeParams.classId;
        			uri += '/class/' + classId + '/path';
        			$($scope.session.user.wexClasses).each(function(i, wexClass) {
        				if (wexClass.id == classId) {
        					$scope.path.title = wexClass.name + '的成长记录';
        				}
        			});
        		} else if (path.indexOf('student') >= 0) {
                    var studentId = $scope.path.studentId = $routeParams.studentId;
                    uri += '/student/' + studentId + '/path';
                    if ($scope.session.user.isTeacher()) {
                        $scope.path.returnType = "class";
                    }
                    StudentService.get($scope.session.user.schoolId, studentId).then(function(student) {
                        $scope.path.title = student.name + '的成长记录';
                    });
                } else if (path.indexOf('teacher') >= 0) {
        			return; // not support yet
        			var teacherId = $routeParams.teacherId;
        			uri += '/teacher/' + teacherId + '/path';
        		} else if (path.indexOf('school') >= 0) {
        			var schoolId = $routeParams.schoolId;
        			uri += '/school/' + schoolId + '/path';
        			return; //not support yet
        		} else {
        		    alert("未支持的功能.");
        			return;
        		}

    			refresh();
        	});
        }]
    );
    }
});