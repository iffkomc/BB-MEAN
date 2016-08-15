/**********************************************************************
 * MainCtrl controller
 **********************************************************************/
'use strict';

angular.module('app')
    .controller('MainCtrl', ['$scope', 'isLogged', '$location', '$http', function ($scope, isLogged, $location, $http) {
        console.log('you are in MainCtrl');
        var self = this;
        $scope.friendBattles = [];
        var limitFollowings = 5;
        $scope.loadFriendsBattles = function () {
            $http.get('/battles?type=all').then(function (response) {
                $scope.friendBattles = response.data;
                console.error(response.data);
            }, function (err) {
                console.error(err);
            });
        }
        $scope.loadRandomFollowings = function () {
            $http.get('/users?type=followings&limit=' + limitFollowings).then(function (response) {
                self.randomFollowings = response.data;
            }, function (err) {
                console.error(err);
            });
        }
    }]);