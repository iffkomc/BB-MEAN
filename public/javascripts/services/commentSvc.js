/**********************************************************************
 * Comment service
 **********************************************************************/
'use strict';

angular.module('app')
    .factory('CommentSvc', ['$http', function ($http) {
        var base = '/comments';
        return {
            get : function (type, value) {
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