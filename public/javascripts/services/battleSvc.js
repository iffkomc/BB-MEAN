/**********************************************************************
 * Battle service
 **********************************************************************/
'use strict';
angular.module('app')
    .factory('activeBattlesSvc', function($http){
        return {
            get : function(){
                return $http.get('/battles?type=active');
            }
        }
    });
angular.module('app')
    .factory('BattleSvc', ['$http', function ($http) {
        var base = '/battles';
        return {

            get : function (type, value) {
                return $http.get(base + '?' + type + '=' + value)
            },
            post : function () {

            }
        }
    }]);