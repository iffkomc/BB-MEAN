/**********************************************************************
 * searchPopupSvc service
 **********************************************************************/
'use strict';

angular.module('app')
    .factory('searchPopupSvc', function(){
        var invoke;
        return {
            set : function(func){
                invoke = func;
            },
            run : function (type, list, ownerProfile) {
                return invoke ? invoke(type, list, ownerProfile) : false;
            }
        }
    });