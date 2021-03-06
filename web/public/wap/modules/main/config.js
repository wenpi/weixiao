/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        require('./datePickerCtrl.js')(app);
        require('./classPickerCtrl.js')(app);

        //配置期
        app.config(['$routeProvider', function($routeProvider) {    
            //Step4: add `controllerUrl` to your route item config
            $routeProvider
                .when('/help/:type', {
                    controller: 'helpCtrl',
                    controllerUrl: 'modules/main/helpCtrl.js',
                    templateUrl: 'modules/main/help.tpl.html'
                });
            }
        ]);

        app.directive("wxDatePicker", [ '$location', function($location) {
            return {
                restrict : 'A',
                replace : true,
                controller: 'datePickerCtrl',
                templateUrl: 'modules/main/date.picker.tpl.html',
                link : function($scope, $element, $attrs) {
                }
            };
        }]);
        
        app.directive("wxClassPicker", [ '$location', function($location) {
            return {
                restrict : 'A',
                replace : true,
                controller: 'classPickerCtrl',
                templateUrl: 'modules/main/class.picker.tpl.html',
                link : function($scope, $element, $attrs) {
                }
            };
        }]);
    }
});