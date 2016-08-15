/**********************************************************************
 * Recovery controller
 **********************************************************************/
'use strict';

angular.module('app')
    .controller('RecoveryCtrl', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
        $scope.message = '';
        console.log($stateParams);
        $scope.sendRecovery = function () {
            $scope.message = '';
            if($scope.password != $scope.passwordRepeat){
                return $scope.message = 'Passwords do not match.';
            }
            $http.post('/forgot/'+ $stateParams.token, {
                password: $scope.password
            }).then(function (response) {
                $scope.message = '';
                console.log(response.data);
                $scope.message = 'Now go to main page and login with your new password';
            }, function (err) {
                console.error(err);
            });


        }
    }]);