/**********************************************************************
 * Notification controller
 **********************************************************************/
'use strict';

angular.module('app')
    .controller('NotificationCtrl', ['$scope', '$http', 'loggedin', function($scope, $http, loggedin){
        $scope.type;
        $scope.getNotifies = function() {
           return $http.get('/notifications');
        };
        $scope.notifications = [];

        $scope.getNotifies().then(function(response){
            $scope.notifications = response.data;
        }, function(err){
            console.error(err);
        })
    }]);
