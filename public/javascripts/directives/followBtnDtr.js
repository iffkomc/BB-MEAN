/**********************************************************************
 * FollowBtnDtr directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('followBtnDtr', ['$http', function($http) {
        return {
            restrict: 'A',
            scope: {
                linkA: '@reqA',
                linkD: '@reqD',
                owner: '=owner',
                id: '=id'
            },
            link: function(scope, elem, attrs) {
                var isFollowed = false;
                console.log('scope.owner');
                console.log(scope.owner);
                if(scope.owner.username == scope.id){
                    return true;
                }
                scope.owner.followings.forEach(function (item) {
                    console.log('!!!!!!!!!!!!');
                    console.log(item);
                    console.log(scope.id);
                   if(item == scope.id) {
                       isFollowed = true;
                   }
                });


                function sendRequest() {
                    var link;
                    if(isFollowed){
                        link = scope.linkD;
                    }
                    else{
                        link = scope.linkA;
                    }
                    console.error(link);
                    $http.put(link).then(function(response) {
                        isFollowed = !isFollowed;
                        elem.html('');
                        if(isFollowed){
                            elem.append('<span class="btn btn-green btn-active">unfollow</span>');
                        }
                        else{
                            elem.append('<span class="btn btn-green">follow</span>');
                        }

                        scope.owner = response.data;

                    }, function(err) {
                        console.log(err);
                        elem.removeClass('disabled');
                    });

                    elem.addClass('disabled');
                }

                if(isFollowed){
                    elem.append('<span class="btn btn-green btn-active">unfollow</span>');
                }
                else{
                    elem.append('<span class="btn btn-green">follow</span>');
                }

                elem.click(sendRequest);
            }
        }
    }]);