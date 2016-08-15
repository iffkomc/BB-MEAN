/**********************************************************************
 * search directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('searchDtr', ['PhotoSvc', 'BrandSvc', 'UserSvc', '$state', '$rootScope', 'LocalizationSvc', '$http', function (PhotoSvc, BrandSvc, UserSvc, $state, $rootScope, LocalizationSvc, $http) {
        return {
            templateUrl: 'views/popupSearch.html',
            controller: function ($scope) {
                var self = this;
                $scope.brandsArray = [];
                $scope.addBrand = function ( $index) {
                    //
                    // todo issue can't use splice get error #1
                    //
                    $scope.brandsArray.push($scope.brands[$index]);
                    console.log($scope.brands);

                    setTimeout(function(){
                        $scope.$apply(function(){
                            $scope.brands.splice($index, 1);
                        });
                    }, 0);

                }
                $scope.deleteBrand = function(index){
                    //
                    // todo issue can't use splice get error #2
                    //
                    $scope.brands.push($scope.brandsArray[index]);
                    setTimeout(function(){
                        $scope.$apply(function(){
                            $scope.brandsArray.splice(index, 1);
                        });
                    }, 0);


                    //var tmp = [];
                    //$scope.brandsArray.forEach(function(item, i){
                    //   if(index != i){
                    //       tmp.push(item);
                    //   }
                    //});
                    //
                    //$scope.brandsArray = tmp;
                }

                //setTimeout(function(){
                //    alert(1);
                //    $scope.deleteBrand(0);
                //    console.log($scope.brandsArray);
                //}, 5000);

                $scope.removeBrand = function(elemName){
                    self.brandsArray.forEach(function(item, index){
                       if(item.name == elemName){
                           self.brandsArray.splice(index, 1);
                       }
                    });
                }
                $scope.findUserById = function(id){
                    //console.log($scope.users);
                    var returnValue;
                    $scope.users.forEach(function(item){
                        //console.log('-----');
                        //console.log(id);
                        //console.log(item._id);
                        //console.log('!!!!!');

                        if(item._id == id){
                            //console.error('совпадение');
                            //console.error(item);
                            returnValue = item;
                            return item;
                        }
                    });
                    return returnValue;
                }
                var meepo = new Meepo();
                meepo.push(undefined, 2);
                meepo.callback(function(){
                    console.log($scope.users);
                    console.log($scope.photos);
                    $scope.photos.forEach(function(photo, index){
                        var localTmpTest = $scope.findUserById(photo.ownerId);
                        $scope.photos[index].user = localTmpTest;
                        console.info(localTmpTest);
                    });
                });
                LocalizationSvc.get($rootScope.lang, $scope);
                var disableFollowing = false;
                $scope.follow = function(user){
                    if(!disableFollowing){
                        disableFollowing=true;
                        $http.put('/follows?username='+user.username).then(function (response) {
                            user.followers = response.data.followers;
                            disableFollowing=false;
                        }, function(err){
                            console.error(err);
                            disableFollowing=false;
                        });
                    }
                }
                BrandSvc.get().then(function(response){
                    $scope.brands = response.data;
                }, function(err){
                    console.error(err);
                });
                UserSvc.get('mine').then(function (response) {
                    $scope.userOwner = response.data;
                }, function(err){
                    console.error(err);
                });
                PhotoSvc.get('all').then(function (response) {
                    $scope.photos = response.data;
                    meepo.itemComplete();
                }, function(err){
                    console.error(err);
                });

                $scope.getObj =  function(item){
                    var key;
                    var value;
                    var counterHelps = 0;
                    for(var i in item){
                        if(counterHelps == 0){
                            key = i;
                            value = item[i];
                            counterHelps++;
                        }
                    }
                    return {
                        key: key,
                        value: value
                    }
                }
                UserSvc.get('all').then(function(response){
                    $scope.users = response.data;
                    meepo.itemComplete();
                    //console.error($scope.users);
                }, function(err){
                    console.error(err);
                })
            },
            controllerAs: 'searchCtrl',
            link: function (scope, elem, attrs) {
                elem.click(function (e) {
                    if(!angular.element(e.target).closest('.popup-box').length){
                        scope.close();
                    }
                });
                scope.close = function(){
                    var state = $state.current.name.toString();
                    var parentState = state.replace(".search", "");
                    console.error(parentState);
                    $state.go(parentState);
                }
                angular.element('.popup-box').click(function(e){
                   if(!angular.element(e.target).closest('.search-dropdown-brand').length){
                       angular.element('.search-dropdown-brand ul').hide();
                   }
                });
                angular.element('.search-dropdown-brand input').click(function () {
                    angular.element('.search-dropdown-brand ul').show();
                });
            }
        }
    }]);