/**********************************************************************
 * Signup controller
 **********************************************************************/
'use strict';

angular.module('app')
    .controller('SignupCtrl', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
        $scope.user = {};
        $scope.message = '';
        $scope.signup = function () {
            $http.post('/signup', {
                username: $scope.user.username,
                email: $scope.user.email,
                password: $scope.user.password
            })
                .success(function (user) {
                    // No error: authentication OK
                    console.log('Authentication successful!');
                    console.log(user.username);
                    //$rootScope.message = 'Authentication successful!';
                    $location.url('/' + $scope.user.username);
                })
                .error(function (error) {
                    // Error: authentication failed
                    console.error('error');
                    console.error(error);
                    $scope.message = error;
                    //$location.url('/login');
                })
        }
    }]);