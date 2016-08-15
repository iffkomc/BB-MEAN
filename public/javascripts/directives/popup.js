/**********************************************************************
 * popup directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('popup', ['$http', '$timeout', '$compile', 'searchPopupSvc', function ($http, $timeout, $compile, searchPopupSvc) {
        return {
            scope: {
                list: '=popup',
                openPopup: '=openPopup',
                friend: '=friend',
                username: '='
            },
            link: function (scope, elem, attrs) {
                elem.click(function (e) {
                    if (!angular.element(e.target).closest('.popup-box').length) {
                        scope.closePopup();
                    }
                })
            },
            controller: function ($http, $compile, $element, $scope) {
                $scope.isVisiblePopup = false;
                console.log('You are in popupDtr');
                var friendList = $scope.list;
                $scope.friends = [];
                $scope.setFriend = function (username) {
                    $scope.friend = username;
                    $scope.closePopup();
                };
                $scope.closePopup = function () {
                    $scope.searchQuery = '';
                    $element.find('.popup').remove();
                };


                $scope.openPopup = function (type, list, ownerProfile) {
                    $scope.closePopup();
                    if (type == 'openPhoto') {
                        $http.get('/views/popupOpenPhoto.html').then(function (response) {
                            var html = response.data;
                            var template = angular.element(html);
                            var linkFn = $compile(template);
                            var element = linkFn($scope);
                            $element.append(element);
                            $scope.isVisiblePopup = true;
                        }, function (err) {
                            console.log(err);
                        });
                    }
                    if (type == 'search') {
                        $http.get('/views/popupSearch.html').then(function (response) {
                            var html = response.data;
                            var template = angular.element(html);
                            var linkFn = $compile(template);
                            var element = linkFn($scope);
                            $element.append(element);
                            $scope.isVisiblePopup = true;
                        }, function (err) {
                            console.log(err);
                        });

                        $scope.doPayment = function () {
                            alert('Sorry we have not set payment services yet.')
                        }
                    }
                    if (type == 'donate') {
                        $http.get('/views/popupDonate.html').then(function (response) {
                            var html = response.data;
                            var template = angular.element(html);
                            var linkFn = $compile(template);
                            var element = linkFn($scope);
                            $element.append(element);
                            $scope.isVisiblePopup = true;
                        }, function (err) {
                            console.log(err);
                        });

                        $scope.doPayment = function () {
                            alert('Sorry we have not set payment services yet.')
                        }
                    }
                    if (type == 'upload') {
                        $scope.friends = [];
                        $http.get('/views/popupUpload.html').then(function (response) {
                            var html = response.data;
                            var template = angular.element(html);
                            var linkFn = $compile(template);
                            var element = linkFn($scope);
                            $element.append(element);
                            $scope.isVisiblePopup = true;
                        }, function (err) {
                            console.log(err);
                        });

                        for (var i = 0; i < friendList.length; i++) {
                            console.log(i);
                            $http.get('/users?username=' + friendList[i]).then(function (response) {
                                console.log(response.data);
                                $scope.friends.push(response.data);
                            }, function (err) {
                                console.log(err.data);
                            })
                        }
                    }
                    if (type == 'share') {

                        $http.get('/views/popupShare.html').then(function (response) {
                            var html = response.data;
                            var template = angular.element(html);
                            var linkFn = $compile(template);
                            var element = linkFn($scope);
                            $element.append(element);
                            $scope.isVisiblePopup = true;
                        }, function (err) {
                            console.log(err);
                        });
                    }
                    if (type == 'likes') {
                        $scope.owner = ownerProfile;
                        $scope.isFriend = function (username) {
                            var k = false;
                            ownerProfile.followings.forEach(function (item) {
                                if (item == username) {
                                    return k = true;
                                }
                            });
                            return k;
                        };
                        if (!list.length) {
                            return true;
                        }
                        $scope.usersList = [];
                        console.error(list);

                        $http.get('/views/popupLike.html').then(function (response) {
                            var html = response.data;
                            var template = angular.element(html);
                            var linkFn = $compile(template);
                            var element = linkFn($scope);
                            $element.append(element);
                            $scope.isVisiblePopup = true;
                        }, function (err) {
                            console.log(err);
                        });


                        for (var i = 0; i < list.length; i++) {
                            console.log(i);
                            $http.get('/users?username=' + list[i]).then(function (response) {
                                console.log(response.data);
                                $scope.usersList.push(response.data);
                            }, function (err) {
                                console.log(err.data);
                            })
                        }
                    }
                }

                searchPopupSvc.set($scope.openPopup);
            }
        }
    }]);