/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('noticeCtrl', ['$scope', '$routeParams', '$location', '$http', 'MessageService',
        function($scope, $routeParams, $location, $http, MessageService){
            $scope.notice = {};
        	$scope.notice.view = '';
        	$scope.notice.title = '';
        	$scope.notice.tRecords = null; // top record
        	$scope.notice.utRecords = null; // untop record

        	var uri;

        	function refresh() {
        		$scope.notice.tRecords = null; // top record
        		$scope.notice.utRecords = null; // untop record

        		MessageService.getMessagesByUri(uri + '&top=1')
				.then(function(records) {
					$scope.notice.tRecords = records.sort(function(a, b) { return a.updatedTime > b.updatedTime ? -1 : 1; });
				});
				MessageService.getMessagesByUri(uri + '&top=0')
				.then(function(records) {
					$scope.notice.utRecords = records;
				});
        	}

        	$scope.notice.remove = function(record) {
        		if (confirm("确认删除该条通知？")) {
        			MessageService.remove(record)
        			.then(function() {
        				alert('删除成功！');
        				refresh();
        			}, function() {
        				alert('删除失败！');
        			});
        		}
        	};

        	$scope.notice.top = function(record, top) {
        		record.top = top;
        		record.updatedBy = $scope.session.user.id;
    			MessageService.save(record)
    			.then(function() {
    				alert('操作成功！');
    				refresh();
    			}, function() {
    				alert('操作失败！');
    			});
        	};

        	$scope.$watch("session.user", function() {
        		if (!$scope.session.user) {
        			return;
        		}

        		var path = $location.path();

        		uri = '/api/school/' + $scope.session.user.schoolId;

        		if (path.indexOf('class') >= 0) {
        			var classId = $scope.notice.classId = $routeParams.classId;
        			uri += '/class/' + classId + '/message?type=1';
        			$($scope.session.user.wexClasses).each(function(i, wexClass) {
        				if (wexClass.id == classId) {
        					$scope.notice.title = wexClass.name;
        				}
        			});
        		} else if (path.indexOf('teacher') >= 0) {
        			return; // not support yet
        			var teacherId = $routeParams.teacherId;
        			uri += '/teacher/' + teacherId + '/message';
        		} else if (path.indexOf('school') >= 0) {
        			var schoolId = $routeParams.schoolId;
        			uri += '/school/' + schoolId + '/notice';
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