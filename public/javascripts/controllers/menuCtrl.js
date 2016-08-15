/**********************************************************************
 * MenuCtrl controller
 **********************************************************************/
'use strict';

angular.module('app')
    .controller('MenuCtrl', ['activeBattlesSvc', '$state', '$scope', '$location', '$http', 'searchPopupSvc', 'isLogged', function(activeBattlesSvc, $state, $scope, $location, $http, searchPopupSvc, isLogged){
        console.log('you are in menuCtrl');

        var self = this;
        self.goUpload = goUpload;
        $scope.notificationsCounter = 0;
        var uploadFlag = false;
        self.isForbidded = true;




        function goUpload() {
            if(uploadFlag){
                $state.go('upload');
            }
            else{
                alert("Вы не можете добавлять батл, пока не закончился предыдущий");
            }
        }
        var displayMenu = function(){
            var localFlag = false;
            var currentLocation = $location.path();
            var forbidConfig = [
                '/login',
                '/recovery',
                '/forgot',
                '/about',
                '/signup'
            ];
            console.log(currentLocation);

            forbidConfig.forEach(function(item, index){
                if(currentLocation === item){
                    localFlag = true;
                }
            });
            //console.error(localFlag);
            if(localFlag){
                self.isForbidded = true;
            }
            else{
                //console.log('here');
                self.isForbidded = false;
                uploadFlag = false;
                activeBattlesSvc.get().then(function (response) {
                    console.log(response.data);
                    console.log(response.error);
                    if(response.data){
                        uploadFlag = false;
                    }
                    else{
                        uploadFlag = true;
                    }
                }, function (err) {
                    uploadFlag = true;
                });
                getNotificationsCounter();
                getHeaderMenuData();
            }
        };
        var getHeaderMenuData = function(){
            isLogged(true).then(function(response){
                console.log('this is static');
                self.user = response.data;
            }, function (err) {
                console.error(err);
            });
        };

        var getNotificationsCounter = function () {
            setTimeout(function(){
                $http.get('/notifications/counter').then(function(response){
                    console.error(response.data);
                    $scope.notificationsCounter = response.data;
                }, function(err){
                    console.error(err);
                });
            }, 200);
        };

        $scope.openSearch = function(){
            searchPopupSvc.run('search');
        };
        $scope.$on('$locationChangeSuccess', function(e, newUrl){

            var tmpUrl = $location.path().toString();
            var isSearch = tmpUrl.indexOf("search") >= 0;
            if(!isSearch){
                $scope.currentLocation = tmpUrl;
            }
            displayMenu();
        });
    }]);