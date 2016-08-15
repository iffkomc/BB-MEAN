/**********************************************************************
 * Forgot controller
 **********************************************************************/
'use strict';

angular.module('app')
    .controller('ForgotCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
        $scope.message = '';
        $scope.errorMessage = '';
        console.log('You are in ForgotCtrl');
        $scope.sendForgot = function () {
            $http.post('/forgot', {
                email: $scope.email
            }).then(function (response) {
                $scope.message = 'Now check your email';
                //$location.url('/');
            }, function(err){
                $scope.errorMessage = 'User with such email is not registered.';
                console.error(err);
            });
        }
    }]);