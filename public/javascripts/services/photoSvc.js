/**********************************************************************
 * Photo service
 **********************************************************************/
'use strict';

angular.module('app')
    .factory('BrandSvc', ['$http', function($http){
        return {
            get: function(type, value){
                if(type && value){
                    return $http.get('/brands?' + type + '=' + value);
                }
                return $http.get('/brands');
            }
        }
    }])
    .factory('PhotoSvc', ['$http', function ($http) {
        var base = '/photos';
        return {

            get : function (type, value) {
                if(type == 'all'){
                    return $http.get(base);
                }
                return $http.get(base + '?' + type + '=' + value)
            },
            post : function () {

            }
        }
    }]);