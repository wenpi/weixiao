/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
        //Step6: use `app.register` to register controller/service/directive/filter
        app.controller('classPickerCtrl', ['$scope', '$routeParams', '$location', '$http',
            function($scope, $routeParams, $location, $http) {
                $scope.common.classPicker = {};
                $scope.common.classPicker.items = [];
                $scope.common.classPicker.isShow = false;

                function hide() {
                    $scope.common.classPicker.isShow = false;
                    $(".wx-class-picker").hide();
                }
                $scope.common.classPicker.hide = hide;

                $scope.common.classPicker.show = function(opts) {
                    $scope.common.classPicker.isShow = true;
                    $scope.common.classPicker.items = opts.items || [];
                    $scope.common.classPicker.selected = null;
                    if (opts.selected) {
                        $(opts.items).each(function(i, item) {
                            if (item.id === opts.selected) {
                                $scope.common.classPicker.selected = item;
                            }
                        });
                    }
                    $scope.common.classPicker.onSelect = opts.onSelect || function() {};
                    $(".wx-class-picker").show();
                };

                $scope.common.classPicker.pick = function(item) {
                    try {
                        $scope.common.classPicker.onSelect(item);
                        hide();
                    } catch(e) {
                        alert("操作失败。");                    
                    }
                };
            }]
        );
    }
});