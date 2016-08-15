/**********************************************************************
 * Share directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('shareDtr', ['$state', function ($state) {
        return {
            templateUrl: 'views/popupShare.html',
            link: function (scope, elem) {
                elem.click(function (e) {
                    if(!angular.element(e.target).closest('.share-box').length){
                        scope.close();
                    }
                });
                scope.close = function(){
                    $state.go('user');
                }
            }
        }
    }]);