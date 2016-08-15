/**********************************************************************
 * Localization service
 **********************************************************************/
'use strict';

angular.module('app')
    .factory('LocalizationSvc', ['$http', function ($http) {
        var tmpLangName,
            tmpLangCollection;

        return {
            get : function (lang, scope) {
                if(!tmpLangName || tmpLangName != lang){
                    $http.get('./../../locales/locale_' + lang + '.json').then(function (response) {
                        scope.locale = response.data;
                    }, function (err) {
                        console.error(err);
                    });
                }
                else{
                    scope.locale = tmpLangCollection;
                }
            }
        }
    }]);