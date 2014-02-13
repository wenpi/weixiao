/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('messageCtrl', ['$scope', '$routeParams', '$location', '$http', 'MessageService',
        function($scope, $routeParams, $location, $http, MessageService){
            $scope.message = {};
        	$scope.message.view = '';
        	$scope.message.title = '';
        	$scope.message.records = null; // top record

        	var uri;

        	function refresh() {
        		$scope.message.records = null; // top record

        		MessageService.getMessagesByUri(uri)
				.then(function(records) {
					$scope.message.records = records;
				});
        	}

        	$scope.message.remove = function(record) {
        		if (confirm("确认删除该条留言？")) {
        			MessageService.remove(record)
        			.then(function() {
        				//alert('删除成功！');
        				refresh();
        			}, function() {
        				alert('删除失败！');
        			});
        		}
        	};

            $scope.message.reply = function(record) {
                MessageService.reply(record, $scope.session.user.id)
                .then(function() {
                    //alert('回复成功！');
                    refresh();
                }, function() {
                    alert('回复失败！');
                });
            };

            $scope.message.removeReply = function(message, reply) {
                if (confirm("确认删除该条回复？")) {
                    MessageService.removeReply(message, reply)
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
        			var classId = $scope.message.classId = $routeParams.classId;
        			uri += '/class/' + classId + '/message?type=0';
        			$($scope.session.user.wexClasses).each(function(i, wexClass) {
        				if (wexClass.id == classId) {
        					$scope.message.title = wexClass.name + '的家长留言';
        				}
        			});
        		} else if (path.indexOf('student') >= 0) {
                    var studentId = $routeParams.studentId;
                    uri += '/student/' + studentId + '/message?type=0';
                    $scope.message.title = "我的留言";
                } else if (path.indexOf('teacher') >= 0) {
        			return; // not support yet
        			var teacherId = $routeParams.teacherId;
        			uri += '/teacher/' + teacherId + '/message';
        		} else if (path.indexOf('school') >= 0) {
        			var schoolId = $routeParams.schoolId;
        			uri += '/school/' + schoolId + '/message';
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