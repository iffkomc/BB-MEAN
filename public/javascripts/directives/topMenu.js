/**********************************************************************
 * topMenu directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('topMenu', ['isLogged', function (isLogged) {
        return {
            restrict: 'E',
            link: function () {

            },
            // resove: {
            //     loggedin : function($q, $http, $location, $rootScope){
            //       // Initialize a new promise
            //       var deferred = $q.defer();

            //       // Make an AJAX call to check if the user is logged in
            //       $http.get('/loggedin').success(function(user){
            //         // Authenticated
            //         if (user !== '0')
            //           $timeout(deferred.resolve, 0);
            //           deferred.resolve(user);

            //         // Not Authenticated
            //         else {
            //           //$timeout(function(){deferred.reject();}, 0);
            //           deferred.reject();
            //           $location.url('/login');
            //         }
            //       });

            //       return deferred.promise;
            //     }
            // },
            controller: function (isLogged) {
                console.log('loggedin');


                console.log(isLogged);
                isLogged().then(function (response) {
                    console.log('--------------');
                    console.log(response.data);
                    console.log('--------------');
                });


                console.log('loggedin');
            }
        }
    }]);