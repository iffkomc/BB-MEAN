/**********************************************************************
 * Angular Application
 **********************************************************************/
'use strict';

angular.module('app', [
    'ngResource',
    //'ngRoute',
    'ngFileUpload',
    'ui.router'
])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function ($q, $http, $location, $rootScope, isLogged) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            isLogged().then(function (response) {
                // Authenticated
                console.log(response);
                var user = response.data;
                if (user !== '0') {
                    /*$timeout(deferred.resolve, 0);*/
                    $rootScope.lang = user.lang || "RU";
                    deferred.resolve(user);
                }

                // Not Authenticated
                else {
                    console.log('You need to log in.');
                    $rootScope.message = 'You need to log in.';
                    //$timeout(function(){deferred.reject();}, 0);
                    deferred.reject();
                }
            }, function (err) {
                console.log('You need to log in.2');
                deferred.reject();
            });

            return deferred.promise;
        };


        var findUser = function ($q, $http, $stateParams, $location, $state) {
            console.log('findUser');
            var q = $q.defer();
            console.error($stateParams);

            if ($stateParams.user) {
                var url = '/users/' + $stateParams.user;
            }
            else {
                console.log('empty value: $route.current.params.user');
                q.reject();
            }
            $http.get(url).then(function (response) {
                var user = response.data;
                console.log(user);
                console.log(url);
                q.resolve(user);
            }, function (error) {
                console.error(error);
                if(error.status === 403){
                    console.log('user');
                    $state.go('battles');
                }
                q.reject();
            });

            return q.promise;
        };
        //================================================

        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.interceptors.push(function ($q, $location, $injector) {
            return {
                response: function (response) {
                        //$injector.get('$state').go('battles');
                    // do something on success
                    return response;
                },
                responseError: function (response) {
                    if (response.status === 401)
                        $location.url('/login');
                    if(response.status === 404)
                        $location.url('/battles');
                        //$injector.get('$state').go('battles');
                    return $q.reject(response);
                }
            };
        });
        //================================================

        //================================================
        // Define all the routes
        //================================================
        $urlRouterProvider.when('', '/battles');
        $urlRouterProvider.when('/', '/battles');
        $stateProvider
            .state('battles', {
                url: '/battles',
                templateUrl: 'html/mainPage.html',
                controller: 'MainCtrl',
                controllerAs: 'mainCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('battles.donate', {
                url: '/donate',
                template: '<donate-dtr></donate-dtr>'
            })
            .state('battles.search', {
                url: '/search',
                template: '<search-dtr></search-dtr>'
            })
            .state('battles.openPhoto', {
                url: '/:photoId',
                template: '<open-photo-dtr></open-photo-dtr>'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'html/login.html',
                controller: 'LoginCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'html/registration.html',
                controller: 'SignupCtrl'
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'html/forgot.html',
                controller: 'ForgotCtrl'
            })
            .state('recovery', {
                url: '/recovery?token',
                templateUrl: 'html/restore.html',
                controller: 'RecoveryCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'html/about.html'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'views/admin.html',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('upload', {
                url: '/upload',
                templateUrl: 'html/uploadPhoto.html',
                controller: 'UploadCtrl',
                controllerAs: 'uploadCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('upload.search', {
                url: '/search',
                template: '<search-dtr></search-dtr>'
            })
            //.state('upload.list', {
            //    url: '/list',
            //    templateUrl: 'views/popupLike.html'
            //})
            .state('notifications', {
                url: '/notifications',
                templateUrl: 'html/notifications.html',
                controller: 'NotificationCtrl',
                controllerAs: 'notifyCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('notifications.search', {
                url: '/search',
                template: '<search-dtr></search-dtr>'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'html/settings.html',
                controller: 'SettingsCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('settings.search', {
                url: '/search',
                template: '<search-dtr></search-dtr>'
            })
            .state('user', {
                url: '/:user',
                templateUrl: 'html/profileEmpty.html',
                controller: 'UserCtrl',
                controllerAs: 'user',
                resolve: {
                    loggedin: checkLoggedin,
                    getUser: findUser
                }
            })
            .state('user.welcome', {
                url: '/welcome',
                template: '<welcome></welcome>'
            })
            .state('user.share', {
                url: '/share',
                template: '<share-dtr></share-dtr>'
            })
            .state('user.search', {
                url: '/search',
                template: '<search-dtr></search-dtr>'
            })
            .state('user.openPhoto', {
                url: '/:photoId',
                template: '<open-photo-dtr></open-photo-dtr>'
            });
            //.state('user.likes', {
            //    url: '/likes',
            //    templateUrl: 'views/popupLike.html'
            //})
            //.state('user.followers', {
            //    url: '/followers',
            //    templateUrl: 'views/popupLike.html'
            //})
            //.state('user.followings', {
            //    url: '/followings',
            //    templateUrl: 'views/popupLike.html'
            //});
            //.otherwise({
            //    redirectTo: '/'
            //});
        //$locationProvider.html5Mode(true);
        //================================================

    }]) // end of config()
    .run(['$rootScope', '$http', '$state', function ($rootScope, $http, $state) {


        $rootScope.message = '';

        // Logout function is available in any pages
        $rootScope.logout = function () {
            $rootScope.message = 'Logged out.';
            $http.post('/logout');
        };
    }]);











