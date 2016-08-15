/**********************************************************************
 * SettingsCtrl controller
 **********************************************************************/
'use strict';

angular.module('app')
    .controller('SettingsCtrl', ['LocalizationSvc', '$rootScope', '$scope', '$http', '$location', 'loggedin', function (LocalizationSvc, $rootScope, $scope, $http, $location, loggedin) {
        $scope.isEdit = false;
        $http.get('/users?id='+loggedin._id+'&secure=true').then(function (response) {
            $scope.secureUser = response.data;
        });
        LocalizationSvc.get($rootScope.lang, $scope);
        console.log('loggedin:');
        console.log(loggedin);
        $scope.lang = loggedin.lang || $rootScope.lang;
        $scope.username = loggedin.username;
        var tmpPassword = $scope.password = '*******';
        $scope.email = loggedin.email;
        $scope.name = loggedin.name;
        $scope.city = loggedin.city;
        $scope.about = loggedin.about;

        var bday = loggedin.birth;
        if (bday == "" || bday == undefined)
            bday = '__.__.__';

        $scope.birth = {};
        var bdayArr = bday.split('.');
        $scope.birth.day = bdayArr[0];
        $scope.birth.month = bdayArr[1];
        $scope.birth.year = bdayArr[2];
        function getBirth() {
            return $scope.birth.day + '.' + $scope.birth.month + '.' + $scope.birth.year;
        }


        console.log($scope.name);
        console.log($scope.username);
        console.log($scope.email);
        console.log($scope.password);
        console.log($scope.city);
        console.log($scope.birth);
        console.log($scope.about);
        console.log($scope.lang);

        $scope.logout = function (flag) {
            var result = true;
            if (!flag) {
                result = confirm('Do you want log out?');
            }
            if (result) {
                console.log('logouting...');
                $http.post('/logout').then(function () {
                    $location.path('/login');
                    console.log('successful logouted!');
                });
            }
        }
        $scope.delete = function () {
            var result = confirm('Delete profile?');
            if (result)
                $http.delete('/users/' + loggedin.username)
                    .then(function () {
                        console.log('User deleted!');
                        $location.path('/login');
                    }, function (err) {
                        console.log('# iffkomc Error: ' + err);
                        console.error(err);
                    });

        };
        $scope.changeLang = function(lg){
            $rootScope.lang = lg;
            LocalizationSvc.get($rootScope.lang, $scope);
        }
        var checkUserData = function (user) {
            if (user.username == '_______') {
                return alert('Wrong username. Choose another one.');
            }
            if (user.password == '' || user.password == '*******') {
                user.password = '';
            }
            if (user.email == '_______') {
                alert('Your email field is empty.');
                user.email = '';
            }
            if (user.lang == '') {
                user.lang = 'RU';
            }
            if (user.name == '_______') {
                alert('Your name field is empty.');
                user.name = '';
            }
            if (user.city == '_______') {
                alert('Your city field is empty.');
                user.city = '';
            }
            if (user.about == '_______') {
                alert('Your about field is empty.');
                user.about = '';
            }
            if (user.birth == '__.__.__') {
                alert('Your birth field is empty.');
                user.birth = '';
            }
            return user;
        };
        $scope.save = function () {
            var user = {
                username: $scope.username,
                password: $scope.password,
                email: $scope.email,
                name: $scope.name,
                city: $scope.city,
                about: $scope.about,
                lang: $scope.lang,
                birth: getBirth()
            };
            console.log(user);
            user = checkUserData(user);

            $http.put('/users/' + loggedin.username, {user: user})
                .then(function (response) {
                    if ($scope.username != loggedin.username || $scope.password != tmpPassword) {
                        return $scope.logout(true);
                    }
                    console.log('User\'s new data successfuly saved!');
                    console.log(response.data);

                    $scope.username = response.data.username;
                    $scope.password = '*******';
                    $scope.email = response.data.email;
                    $scope.name = response.data.name;
                    $scope.city = response.data.city;
                    $scope.about = response.data.about;

                    var bday = response.data.birth;
                    if (bday == "" || bday == undefined)
                        bday = '__.__.__';
                    var bdayArr = bday.split('.');
                    $scope.birth.day = bdayArr[0];
                    $scope.birth.month = bdayArr[1];
                    $scope.birth.year = bdayArr[2];

                    if ($scope.username == '' || $scope.username == undefined)
                        $scope.username = '_______';
                    if ($scope.password == '' || $scope.password == undefined)
                        $scope.password = '*******';
                    if ($scope.email == '' || $scope.email == undefined)
                        $scope.email = '_______';
                    if ($scope.name == '' || $scope.name == undefined)
                        $scope.name = '_______';
                    if ($scope.city == '' || $scope.city == undefined)
                        $scope.city = '_______';
                    if ($scope.birth == '' || $scope.birth == undefined)
                        $scope.birth = '__.__.__';
                    if ($scope.about == '' || $scope.about == undefined)
                        $scope.about = '_______';


                    $scope.isEdit = !$scope.isEdit;
                });
        }
        $scope.fb = function () {
            $http.get('/auth/facebook').then(function (response) {
                console.log(response.data);
                $scope.username = response.data.username;
                $scope.password = response.data.password;
                $scope.email = response.data.email;
                $scope.name = response.data.name;
                $scope.city = response.data.city;
                $scope.about = response.data.about;
            }, function (err) {
                console.err(err);
            })
        }
        $scope.inst = function () {
            $http.get('/auth/instagram').then(function (response) {
                console.log(response.data);
                $scope.username = response.data.username;
                $scope.password = response.data.password;
                $scope.email = response.data.email;
                $scope.name = response.data.name;
                $scope.city = response.data.city;
                $scope.about = response.data.about;
            }, function (err) {
                console.err(err);
            })
        }


        if ($scope.username == '' || $scope.username == undefined)
            $scope.username = '_______';
        if ($scope.password == '' || $scope.password == undefined)
            $scope.password = '*******';
        if ($scope.email == '' || $scope.email == undefined)
            $scope.email = '_______';
        if ($scope.name == '' || $scope.name == undefined)
            $scope.name = '_______';
        if ($scope.city == '' || $scope.city == undefined)
            $scope.city = '_______';
        if ($scope.birth == '' || $scope.birth == undefined)
            $scope.birth = '__.__.__';
        if ($scope.about == '' || $scope.about == undefined)
            $scope.about = '_______';


    }]);
