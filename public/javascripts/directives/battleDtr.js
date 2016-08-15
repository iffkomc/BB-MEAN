/**********************************************************************
 * battleDtr directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('welcome', ['$state', function ($state) {
        return {
            templateUrl: './../../views/welcomeTemplate.html',
            controller: function ($scope) {
                $scope.closePopup = function () {
                    $state.go('^');
                };
            },
            link: function (scope, elem, attrs) {
                elem.click(function (e) {
                    if (!angular.element(e.target).closest('.popup-box').length) {
                        scope.closePopup();
                    }
                })
            }
        }
    }])
    .directive('battleDtr', ['$timeout', '$http', '$compile', '$q', '$state', 'isLogged', 'UserSvc', 'BrandSvc', function ($timeout, $http, $compile, $q, $state, isLogged, UserSvc, BrandSvc) {
        return {
            restrict: 'A',
            templateUrl: '../views/battleTemplate.html',
            scope: {
                battle: '=battleDtr'
            },
            link: function (scope, elem, attrs) {
                angular.element('.battle-photo').hover(function () {
                    angular.element(this).toggleClass('active');
                });
                scope.currentState = $state.current.name.toString().split('.')[0];
                console.error(scope.currentState);
                var brandsGenerator = function (photo, elem) {
                    var tmp = [];
                    var isAdded = false;
                    photo.brands.forEach(function (item) {
                        isAdded = false;
                        tmp.forEach(function (tmpItem) {
                            if (tmpItem.brandId == item.brandId) {
                                isAdded = true;
                            }
                        });
                        if (!isAdded) {
                            tmp.push(item);
                        }
                    });
                    //angular.element('.battle-photo-item-box__price').click(function () {
                    //    angular.element(this).siblings('.photo-inner-brands').toggleClass('hide');
                    //})
                    $timeout(function(){
                        console.info(elem.find('.battle-photo-link-item img')[0]);
                        var imageH = elem.find('.battle-photo-link-item img').height();
                        var imageW = elem.find('.battle-photo-link-item img').width();
                        tmp.forEach(function (item) {
                            BrandSvc.get('id', item.brandId).then(function (response) {
                                var receivedBrand = response.data;
                                console.error(receivedBrand);
                                var elementBrand = angular.element('<span>' + receivedBrand.name + '</span>');
                                var brandsContainer = elem.find('.photo-inner-brands');
                                console.info(imageW);
                                console.info(imageH);
                                elementBrand.appendTo(brandsContainer).css({
                                    left: item.position.x * 100 + '%',
                                    top: item.position.y * 100 + '%'
                                });
                            }, function (err) {
                                console.error(err);
                            });
                        })
                    }, 200);

                }
                scope.$watch('battle', function (newValue) {
                    if (newValue !== undefined) {
                        scope.isVoted = false;
                        scope.isFinished = false;
                        UserSvc.get('id', scope.battle.id1).then(function (response) {
                            scope.battle.user1 = response.data;
                        }, function (err) {
                            console.error(err);
                        })
                        UserSvc.get('id', scope.battle.id2).then(function (response) {
                            scope.battle.user2 = response.data;
                        }, function (err) {
                            console.error(err);
                        })
                        var setBattleStatus = function (v1, v2) {
                            if (v1 || v2) {
                                scope.battleStatus = true;
                            }
                            else {
                                scope.battleStatus = false;
                            }
                        }
                        setBattleStatus(scope.isVoted, scope.isFinished);
                        scope.vote = function (voteTo) {
                            $http.put('/battles?id=' + scope.battle._id + '&vote=' + voteTo).then(function (response) {
                                var btl = response.data;
                                scope.battle.rateIdsPhoto1 = btl.rateIdsPhoto1;
                                scope.battle.rateIdsPhoto2 = btl.rateIdsPhoto2;
                                scope.isVoted = true;
                                setBattleStatus(scope.isVoted, scope.isFinished);

                                setElemWidth(
                                    scope.battle.rateIdsPhoto1.length,
                                    scope.battle.rateIdsPhoto2.length,
                                    elem.find('.battle-result__first'),
                                    elem.find('.battle-result__second')
                                );
                            }, function (err) {
                                console.error(err);
                            });
                        };
                        var setElemWidth = function (num1, num2, elem1, elem2) {
                            var w = angular.element(elem1).parent().parent().width();
                            console.log(w);
                            if (num1 == num2) {
                                angular.element(elem1).each(function () {
                                    console.log(this);
                                    angular.element(this).css('width', '50%');
                                });
                                angular.element(elem2).each(function () {
                                    console.log(this);
                                    angular.element(this).css('width', '50%');
                                });
                            }

                            var w1 = Math.floor(100 * num1 / ( num1 + num2 ));
                            console.log(w1);
                            if (w1 < 10) {
                                w1 = 10;
                            }
                            if (w1 > 90) {
                                w1 = 90;
                            }
                            var w2 = 100 - w1;

                            console.log(w1);
                            console.log(w2);
                            console.log(w);
                            angular.element(elem1).each(function () {
                                console.log(this);
                                angular.element(this).css('width', w1 + '%');
                            });
                            angular.element(elem2).each(function () {
                                console.log(this);
                                angular.element(this).css('width', w2 + '%');
                            });
                        };
                        setElemWidth(
                            scope.battle.rateIdsPhoto1.length,
                            scope.battle.rateIdsPhoto2.length,
                            elem.find('.battle-result__first'),
                            elem.find('.battle-result__second')
                        );
                        (scope.setAdditionProperties = function (btl) {
                            isLogged().then(function (response) {
                                var currentUser = response.data;

                                //
                                //  try to find userId in battleRates
                                //
                                scope.battle.rateIdsPhoto1.forEach(function (item, index) {
                                    if (item == currentUser._id) {
                                        btl.isVoted = true;
                                        setBattleStatus(scope.isVoted, scope.isFinished);
                                    }
                                });
                                scope.battle.rateIdsPhoto2.forEach(function (item, index) {
                                    if (item == currentUser._id) {
                                        btl.isVoted = true;
                                        setBattleStatus(scope.isVoted, scope.isFinished);
                                    }
                                });
                                //
                                //  set isFinished
                                //
                                if (btl.winner != '' && btl.winner) {
                                    console.log('btl.winner');
                                    console.log(btl.winner);
                                    btl.isFinished = true;
                                    setBattleStatus(scope.isVoted, scope.isFinished);
                                }
                            });
                        })(scope);

                        getPhotosInfo().then(function (data) {
                            var date1 = new Date(scope.battle.date).getTime();
                            var date2 = new Date().getTime();
                            console.log(date1);
                            console.log(date2);
                            var delay = 24 * 60;
                            var tmp = delay - Math.ceil((date2 - date1) / (1000 * 60));
                            console.log(tmp);
                            var hours = Math.floor(tmp / 60);
                            var minutes = tmp % 60;
                            scope.timeDifference = {
                                hours: hours,
                                minutes: minutes
                            };
                            //$http.get('../views/battleTemplate.html').then(function(response){
                            //    var html = response.data;
                            //    var template = angular.element(html);
                            //    var linkFn = $compile(template);
                            //    var element = linkFn(scope);
                            //    elem.append(element);
                            //}, function(err){
                            //    console.error(err);
                            //});
                        });
                    }
                });

                function getPhotosInfo() {
                    var promise = $q.defer();


                    var asyncParallel = new Meepo();
                    asyncParallel.push(undefined, 2);
                    asyncParallel.callback(function () {
                        promise.resolve('done');
                    });
                    $http.get('/photos?id=' + scope.battle.idPhoto1).then(function (response) {
                        scope.photo1 = response.data;
                        brandsGenerator(scope.photo1, angular.element('.battle-photo_first'));
                        asyncParallel.itemComplete();
                        console.log('scope.photo1');
                        console.log(scope.photo1);
                    }, function (err) {
                        console.error(err);
                        asyncParallel.itemComplete();
                    });
                    $http.get('/photos?id=' + scope.battle.idPhoto2).then(function (response) {
                        scope.photo2 = response.data;
                        brandsGenerator(scope.photo2, angular.element('.battle-photo_second'));
                        asyncParallel.itemComplete();
                        console.log('scope.photo2');
                        console.log(scope.photo2);
                    }, function (err) {
                        console.error(err);
                        asyncParallel.itemComplete();
                    });

                    return promise.promise;
                }
            }
        }
    }]);