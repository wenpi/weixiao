/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('noticeCtrl', ['$scope', '$routeParams', '$location', '$http',
        function($scope, $routeParams, $location, $http){
            
        }]
    );
    }
});