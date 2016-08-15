/**********************************************************************
 * ButtonDtr directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('button', ['$http', function($http) {
        return {
            restrict: 'A',
            scope: {
                link: '@req',
                replaceText: '@text',
                profile: '=profile',
                owner: '=owner'
            },
            link: function(scope, elem, attrs) {
                function sendRequest() {
                    $http.put(scope.link).then(function(response) {
                        //isActive = !isActive;
                        elem.removeClass('disabled');
                        scope.profile.followings = response.data.followings;
                        scope.profile.followers = response.data.followers;
                        scope.profile.likes = response.data.likes;
                    }, function(err) {
                        console.log(err);
                        elem.removeClass('disabled');
                    });

                    elem.addClass('disabled');
                }

                elem.click(sendRequest);
            }
        }
    }]);