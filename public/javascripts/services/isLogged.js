/**********************************************************************
 * isLogged service
 **********************************************************************/
'use strict';

angular.module('app')
    .service('isLogged', ['$http', '$q', function ($http, $q) {
        console.log('isLogged');
        var staticDataUser;
        return function(isStaticDataNeed){
            var deferred = $q.defer();
            if(isStaticDataNeed && staticDataUser){
                console.log('Someone try to get static data');
                deferred.resolve(staticDataUser);
            }
            else {
                $http({
                    method: 'GET',
                    url: '/loggedin'
                }).then(function (response) {
                    staticDataUser = response;
                    deferred.resolve(response);
                }, function (err) {
                    deferred.reject(err);
                });
            }
            return deferred.promise;
        }
    }]);