/**********************************************************************
 * DataDiff service
 **********************************************************************/
'use strict';

angular.module('app')
    .service('DataDiffSvc', function(){
        return function (date1, date2) {
            var diff = date2.getTime() - date1.getTime();
            var minutes = Math.ceil( diff / ( 1000 * 60 ) );

            if(minutes < 60){
                return minutes + ' minutes';
            }

            var hours = Math.ceil( minutes / 60 );

            if(hours < 24){
                return hours + ' hours';
            }

            var days = Math.floor( hours / 24 );

            return days + ' days';
        }
    });