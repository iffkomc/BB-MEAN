/**********************************************************************
 * processBtnActive directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('processBtnActive', ['$location', function ($location) {
        return {
            scope: {
                user: '=processBtnActive'
            },
            link: function(scope, elem, attrs){

                scope.$on('$locationChangeSuccess', function(){
                    if(scope.user) {
                        var config = [
                            {
                                link: '/' + scope.user.username,
                                class: 'footer-nav-item_avatar'
                            },
                            {
                                link: '/notifications',
                                class: 'footer-nav-item_notification'
                            },
                            {
                                link: '/upload',
                                class: 'footer-nav-item_photo'
                            },
                            {
                                link: '/battles',
                                class: 'footer-nav-item_home'
                            }
                        ];
                        var currentUrl = $location.path();
                        //console.error(currentUrl);
                        //console.error('/' + scope.user.username);
                        config.forEach(function(item){
                            if(item.link == currentUrl) {
                                elem.find('.active').removeClass('active');
                                elem.find('.' + item.class).addClass('active')
                            }
                        });
                    }
                });
            }
        }
    }]);