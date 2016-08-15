/**********************************************************************
 * bbChangeText directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('bbChangeText', ['$location', function($location){
        return {
            link: function(scope, elem, attrs){
                var id = $location.search().id;
                var replaceText = 'Aplying request...';
                if(id){
                    elem.html('<p class="upload-fields__text">' + replaceText + '</p>');
                }
            }
        }
    }]);