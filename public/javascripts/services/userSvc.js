/**********************************************************************
 * User service
 **********************************************************************/
'use strict';

angular.module('app')
    .factory('UserSvc', ['$http', function ($http) {
        var base = '/users';
        return {
            get : function (type, value) {
                console.log('userSvcCall');
                if(type == 'all'){
                    return $http.get(base);
                }
                if(type == 'mine'){
                    return $http.get('/loggedin');
                }
                return $http.get(base + '?' + type + '=' + value)
            },
            post : function (type, value, data) {
                return $http.post(base + '?' + type + '=' + value, data)
            },
            put : function (type, value, data) {
                return $http.put(base + '?' + type + '=' + value, data)
            },
            delete : function (type, value) {
                return $http.delete(base + '?' + type + '=' + value)
            }
        }
    }]);