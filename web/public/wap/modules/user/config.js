define(function (require, exports, module) {
    "use strict";

    module.exports = function(app){
        require('./userPickerCtrl.js')(app);

        app.factory('UserService', function($rootScope, $http){
            var uri = WEXPATH + '/api/user';
            var puri = WEXPATH + '/api/parent';
            var turi = WEXPATH + '/api/teacher';
            return {
                get: function(id) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: uri + '/' + id
                    }).then(function(res) {
                        return res.data;
                    }, function() {
                        return null;
                    });
                },
                getParent: function() {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: puri + '/' + id
                    }).then(function(res) {
                        return res.data;
                    }, function() {
                        return null;
                    });
                },
                getTeacher: function(id) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: turi + '/' + id
                    }).then(function(res) {
                        return res.data;
                    }, function() {
                        return null;
                    });
                },
                getClassesByTeacher: function(teacher) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/school/' + teacher.schoolId + '/teacher/' + teacher.id + '/class'
                    }).then(function(res) {
                        return res.data;
                    }, function() {
                        return null;
                    });
                },
                getStudentsByClass: function(wexClass) {
                    return $http({
                        method: 'GET',
                        cache: false,
                        url: WEXPATH + '/api/school/' + wexClass.school_id + '/class/' + wexClass.id + '/student'
                    }).then(function(res) {
                        return res.data;
                    }, function() {
                        return null;
                    });
                }
            }
        });

        app.directive("wxUserPicker", [ '$location', function($location) {
            return {
                restrict : 'A',
                replace : false,
                controller: 'userPickerCtrl',
                templateUrl: 'modules/user/user.picker.tpl.html',
                link : function($scope, $element, $attrs) {
                }
            };
        }]);
    }
});