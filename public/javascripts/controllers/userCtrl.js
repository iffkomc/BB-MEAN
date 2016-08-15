/**********************************************************************
 * UserCtrl controller
 **********************************************************************/
'use strict';

angular.module('app')
    .controller('UserCtrl', ['$rootScope', 'LocalizationSvc', '$http', '$scope', 'Upload', '$stateParams', '$location', 'loggedin', 'getUser', '$timeout', '$interval', 'searchPopupSvc', function($rootScope, LocalizationSvc, $http, $scope, Upload, $stateParams, $location, loggedin, getUser, $timeout, $interval, searchPopupSvc) {
        var self = this;
        console.log('you are in: UserCtrl.js');
        //$http.get('https://graph.facebook.com/v2.6/100007845697923/permissions?access_token=EAABeYKUdatEBAPGXvuhrxoXaviPF8sUxFeqUWIVaSdnEbqN2eX4qEDOx1gZARzZArw9xnrfyJjZCfBzqRco4mJDY9SzSbZAWXRNNOvBFk2IZCZCfOZAyS9IszObgcgj9pZC2zWAdz1WmAcXaLz1ZBOlJvIWxe8NVQHJYZD').then(function(response){
        //    console.error(response.data);
        //}, function (err) {
        //    console.error(err);
        //});
// can use 1 modified function instead both
        function setProfile(data, ctrl){
          var profile = angular.copy(data);
          return ctrl.profile = profile;
        }
        function setOwner(data, ctrl){
          var owner = angular.copy(data);
          return ctrl.owner = owner;
        }
        LocalizationSvc.get($rootScope.lang, $scope);

        //console.log(getUser);
        //console.log(loggedin);

        if (getUser.username == loggedin.username){
            $scope.isOwner = true;
            setOwner(loggedin, this);
            setProfile(getUser, this);
          }
        else{
            $scope.isOwner = false;
            setOwner(loggedin, this);
            setProfile(getUser, this);
          }
        var owner = this.owner;
        var profile = this.profile;
        // $scope.uploadProgress = 0;


        // var interval = $interval(function(){

        //   console.log('$scope.uploadProgress: ' + $scope.uploadProgress);
        //   $scope.uploadProgress++;
        //   if($scope.uploadProgress == 100) $interval.cancel(interval);
        // }, 50);


        this.sendComplain = function (username) {
            alert('Complain sended to '+ username +'!');
        }

        $scope.openSearch = function(){
            searchPopupSvc.run('openPhoto');
        };

        $scope.isVisibleAvatar = false;
        $scope.isAddedAvatar = false;
        if (profile.avatarName) {
            $scope.avatarName = profile.avatarName;
            $scope.isVisibleAvatar = true;
        } else {
            $scope.isAddedAvatar = true;
        }
        if(profile.isBg){
            profile.bg = profile.avatarName + '-bg';
        }
        else{
            profile.bg = undefined;
        }
        $scope.username = profile.username;
        $scope.name = profile.name;

        $http.get('/photos?username=' + profile.username + '&type=finished').then(function(response){
            console.log(response.data);
            self.profile.photos = response.data;
        }, function(err){
            console.log(err); 
        });
        $http.get('/battles?type=active&idUser=' + profile._id).then(function(response){
            console.error(response.data);
            $scope.currentBattle = response.data;
        }, function (err) {
            //
            // todo iffkomc # make disable button for viewing current battle
            //
            console.error(err);
        });
        $scope.currentBattle;
        // upload later on form submit or something similar 
        $scope.submit = function() {
            console.log('Submitted!!!');
            if ($scope.form.file.$valid && $scope.file) {
                $scope.upload($scope.file);
                console.log($scope.file);
            }
        };

        // upload on file select or drop 
        $scope.upload = function(file) {
            $scope.uploadProgress = 0;
            Upload.upload({
                url: '/avatar',
                data: { file: file, 'username': $scope.username }
            }).then(function(resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                console.log(resp);
                $scope.isAddedAvatar = true;
                $scope.isVisibleAvatar = true;
                $scope.uploadProgress = null;
                $scope.avatar = $scope.file;

                self.profile.bg = resp.data.avatarName + '-bg';
                self.setBg(self.profile.bg);
                console.log($scope.avatar);
                console.log(resp.data.avatarName);
            }, function(resp) {
                console.log('Error status: ' + resp.status);
            }, function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                if(progressPercentage==100){
                  progressPercentage = null;

                }
                else
                  $scope.uploadProgress = progressPercentage;

            });
        };

        $scope.follow = function(req, res){
          $http.put('/follows?username=' + self.profile.username).then(function(response){
            console.log('response.data');
            console.log(response.data);
          })
        };

    }]);
