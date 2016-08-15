/**********************************************************************
 * Donate directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('donateDtr', ['$state', function ($state) {
        return {
            templateUrl: 'views/popupDonate.html',
            link: function (scope, elem) {
                elem.click(function (e) {
                    if(!angular.element(e.target).closest('.donate-box').length){
                        scope.close();
                    }
                });
                scope.close = function(){
                    $state.go('battles');
                }
            }
        }
    }]);