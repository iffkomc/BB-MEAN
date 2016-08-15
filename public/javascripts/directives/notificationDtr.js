/**********************************************************************
 * Notifications directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('blurHide', function($window){
        return {
            link: function(scope, elem){
                angular.element($window).click(function (e) {
                    if(!angular.element(e.target).closest('.profile-settings').length){
                        elem.find('.main-popup').hide();
                    }
                    else{
                        elem.find('.main-popup').show();
                    }
                });
            }
        }
    })
    .directive('notify', ['$http', '$compile', 'UserSvc', 'PhotoSvc', 'CommentSvc', function ($http, $compile, UserSvc, PhotoSvc, CommentSvc) {
        return {
            restrict: 'A',
            scope: {
                notify: '='
            },
            controller: function ($scope) {
                $scope.reject = function () {
                    alert('delete');
                    return $http.delete('/create-photo?id=' + $scope.notify.itemId).then(function (response) {
                        alert('deleted');
                    }, function (err) {
                        console.error(err);
                    });
                };


            },
            link: function (scope, elem, attrs) {
                var notify = scope.notify;
                console.log('notify');
                console.log(notify);

                UserSvc.get('id', notify.idUser).then(function(response){
                    scope.user = response.data;
                }, function(err){
                    console.error(err);
                });

                if(notify.type == 'followSocial'){


                    var disableFollowing = false;
                    scope.follow = function(username){
                        if(!disableFollowing){
                            disableFollowing=true;
                            $http.put('/follows?username='+username).then(function (response) {
                                console.error(response.data);
                                scope.user = response.data;
                                disableFollowing=false;
                            }, function(err){
                                console.error(err);
                                disableFollowing=false;
                            });
                        }
                    }
                    UserSvc.get('id', notify.idOwner).then(function(response){
                        scope.userOwner = response.data;
                    }, function(err){
                        console.error(err);
                    });

                    elem.addClass('notifications__item_follow').addClass('notifications__item_center');
                    $http.get('/views/notifyFollowSocial.html').then(function (response) {
                        var html = response.data;
                        var template = angular.element(html);
                        var linkFn = $compile(template);
                        var element = linkFn(scope);
                        elem.append(element);
                    }, function (err) {
                        console.error(err);
                    });
                }
                if(notify.type == 'comment'){
                    UserSvc.get('id', notify.idUser).then(function(response){
                        scope.user  = response.data;
                        console.info(scope.comment);
                    }, function(err){
                        console.error(err);
                    });
                    CommentSvc.get('id', notify.itemId).then(function(response){
                        scope.comment = response.data;
                        console.info(scope.comment);
                    }, function(err){
                        console.error(err);
                    });
                    CommentSvc.get('photoId', notify.status).then(function(response){

                        console.info(scope.comment);
                    }, function(err){
                        console.error(err);
                    });
                    scope.likeComment = function(){
                        return CommentSvc.put('id', notify.itemId).then(function(response){
                            console.log(response.data);
                            return scope.comment = response.data;
                        }, function(err){
                            console.error(err);
                        });
                    };
                    (function(){
                        var date1 = new Date(scope.notify.date).getTime();
                        var date2 = new Date().getTime();
                        console.log(date1);
                        console.log(date2);
                        var tmp = Math.ceil((date2 - date1) / (1000 * 60));
                        console.log(tmp);
                        var hours = Math.floor(tmp / 60);
                        var minutes = tmp % 60;
                        scope.timeDifference = {
                            hours: hours,
                            minutes: minutes
                        };
                    })();
                    elem.addClass('notifications__item_comment');
                    $http.get('/views/notifyComment.html').then(function (response) {
                        var html = response.data;
                        var template = angular.element(html);
                        var linkFn = $compile(template);
                        var element = linkFn(scope);
                        elem.append(element);
                    }, function (err) {
                        console.error(err);
                    });
                }
                if(notify.type == 'vote'){
                    PhotoSvc.get('id', notify.itemId).then(function(response){
                        scope.photo = response.data;
                        console.info(scope.photo);
                    }, function(err){
                        console.error(err);
                    });
                    UserSvc.get('id', notify.idUser).then(function(response){
                        scope.user = response.data;
                    }, function(err){
                        console.error(err);
                    });
                    elem.addClass('notifications__item_voted').addClass('notifications__item_center');
                    $http.get('/views/notifyVote.html').then(function (response) {
                        var html = response.data;
                        var template = angular.element(html);
                        var linkFn = $compile(template);
                        var element = linkFn(scope);
                        elem.append(element);
                    }, function (err) {
                        console.error(err);
                    });
                }
                if (notify.type == 'followingBattleStarted') {
                    elem.addClass('notifications__item_voted').addClass('notifications__item_center');
                    $http.get('/views/notifyFollowingBattleStarted.html').then(function (response) {
                        var html = response.data;
                        var template = angular.element(html);
                        var linkFn = $compile(template);
                        var element = linkFn(scope);
                        elem.append(element);
                    }, function (err) {
                        console.error(err);
                    });
                }
                if (notify.type == 'userBattleStarted') {
                    elem.addClass('notifications__item_followed').addClass('notifications__item_center');
                    $http.get('../views/notifyUserBattleStarted.html').then(function (response) {
                        var html = response.data;
                        var template = angular.element(html);
                        var linkFn = $compile(template);
                        var element = linkFn(scope);
                        elem.append(element);
                    }, function (err) {
                        console.error(err);
                    });
                }
                if (notify.type == 'like') {
                    elem.addClass('notifications__item_followed').addClass('notifications__item_center');
                    $http.get('../views/notifyLike.html').then(function (response) {
                        var html = response.data;
                        var template = angular.element(html);
                        var linkFn = $compile(template);
                        var element = linkFn(scope);
                        elem.append(element);
                    }, function (err) {
                        console.error(err);
                    });
                }
                if (notify.type == 'following') {
                    elem.addClass('notifications__item_like').addClass('notifications__item_center');
                    $http.get('../views/notifyFollowing.html').then(function (response) {
                        var html = response.data;
                        var template = angular.element(html);
                        var linkFn = $compile(template);
                        var element = linkFn(scope);
                        elem.append(element);
                    }, function (err) {
                        console.error(err);
                    });
                }
                if (notify.type == 'request') {
                    elem.addClass('notifications__item_request');
                    $http.get('../views/notifyRequest.html').then(function (response) {
                        var html = response.data;
                        var template = angular.element(html);
                        var linkFn = $compile(template);
                        var element = linkFn(scope);
                        elem.append(element);
                    }, function (err) {
                        console.error(err);
                    });
                }
                if (notify.type == 'reject') {
                    elem.addClass('notifications__item_request');
                    $http.get('../views/notifyRejected.html').then(function (response) {
                        var html = response.data;
                        var template = angular.element(html);
                        var linkFn = $compile(template);
                        var element = linkFn(scope);
                        elem.append(element);
                    }, function (err) {
                        console.error(err);
                    });
                }
            }
        }
    }]);
