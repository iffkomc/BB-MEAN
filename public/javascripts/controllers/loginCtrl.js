/**********************************************************************
 * Login controller
 **********************************************************************/
 'use strict';
 
angular.module('app')
  .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
      var returnUrl = '/login';
  $scope.user = {};

  $scope.fb = function(){
    $http({
        method: 'GET',
        url: '/auth/facebook'
      }).then(function(response){
      console.log(response.data);
      $scope.username = response.data.username;
      $scope.password = response.data.password;
      $scope.email = response.data.email;
      $scope.name = response.data.name;
      $scope.city = response.data.city;
      $scope.about = response.data.about;
      // No error: authentication OK
      console.log('Authentication successful!');
      console.log(user);
      $location.url('/' + $scope.user.username);
    }, function(err){
      console.err(err);
    })
  };

  // Register the login() function
  $scope.login = function(){
    console.log('Try to log in...');
    $http.post('/login', {
      username: $scope.user.username,
      password: $scope.user.password
    }).then(function(response){
      // No error: authentication OK
      console.log('Authentication successful!');
      //console.log(response);
      var user = response.data;
      $location.url('/' + user.username);
    },function(err){
      // Error: authentication failed
      console.error(err);
      $scope.message = 'Authentication failed.';
      //$location.url(returnUrl);
    });
  };
}]);