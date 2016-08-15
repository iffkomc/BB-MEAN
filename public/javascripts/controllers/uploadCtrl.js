/**********************************************************************
 * UploadCtrl controller
 **********************************************************************/
'use strict';

angular.module('app')
    .controller('UploadCtrl', ['$http', '$scope', 'Upload', '$stateParams', '$location', 'loggedin', '$timeout', '$interval', '$state', function( $http, $scope, Upload, $stateParams, $location, loggedin, getUser, $timeout, $interval, $state) {
        console.log('you are in: UserCtrl.js');

        var self = this;
        $scope.form = {};
        self.battleForm = {};
        self.isSuccess = false;

        function setProfile(data, ctrl) {
            var profile = angular.copy(data);
            return ctrl.profile = profile;
        }
        var profile = this.profile;



        console.log(profile);
        setProfile(loggedin, self);

        $scope.submit = function() {
            if ($scope.form.file.$valid && $scope.file) {
                $scope.upload($scope.file);
            }
        };
        $scope.upload = function(file) {
            $scope.uploadProgress = 1 + '%';
            Upload.upload({
                url: '/upload',
                data: { file: file, 'username': $scope.username }
            }).then(function(resp) {
                $scope.form.image = resp.data;
                console.log('Success uploaded. Name: ' + resp.data);
                $scope.isAddedPhoto = true;
                $scope.isVisibleAvatar = true;
                $scope.uploadProgress = null;
                $scope.avatar = $scope.file;
            }, function(resp) {
                console.log('Error status: ' + resp.status);
            }, function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name + angular.element('.upload-progress-ready'));
                $scope.uploadProgress = progressPercentage;
                angular.element('.upload-progress-ready').width(progressPercentage + '%');
                //if (progressPercentage == 100) {
                //    progressPercentage = null;
                //} else {
                //    $scope.uploadProgress = progressPercentage;
                //}
            });
        };

        $scope.sendForm = function() {

            if (!self.battleForm.type || self.battleForm.type == '')
                self.battleForm.type = 'random';
            // else
            //     self.battleForm.type = 'friend';
            if (!self.battleForm.photo || self.battleForm.photo == '')
                self.battleForm.photo = $scope.form.image;
            if (!self.battleForm.photo || self.battleForm.photo == '')
                return alert('Upload your photo, please.');


            // check if this is ACCEPTING then send another request
            var queryBattleId = $location.search().id;
            if(queryBattleId){
                return $http.put('/create-photo?id=' + queryBattleId, {
                    battleForm: self.battleForm,
                    idPhoto2: self.battleForm.photo
                }).then(function(response){
                    console.log(response.data);
                    console.error($state);
                    $location.url('/battles');
                    //$state.go('battles');
                });
            }

            if (self.battleForm.photo && self.battleForm.photo != '') {
                console.log(self.battleForm);
                $http.post('/create-photo', {battleForm: self.battleForm}).then(function(response){
                    console.error(response.data);
                    console.error($state);
                    $location.url('/battles');
                    //$state.go('battles');
                }, function (err) {
                    console.error(err);
                });
            }
        }
    }]);
