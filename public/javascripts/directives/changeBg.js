/**********************************************************************
 * changeBg directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('changeBg', ['$compile', function ($compile) {
        return {
            scope: {
                changeBg: "=changeBg"
            },
            link: function(scope, elem){
                scope.changeBg = function (url) {
                   // elem.css('background-image', 'url("/uploads/' + url + '.jpg")');
                    scope.url = url;
                    var html = "<style>@media only screen and (max-width: 989px){ .profile .header {background-image: url({{'/uploads/' + url + '.jpg'}})!important; background-repeat: no-repeat; background-position: center center; background-size: cover; }} @media only screen and (min-width: 990px){.profile-container.container{background-image: url({{'/uploads/' + url + '.jpg'}})}}</style>";
                    var template = angular.element(html);
                    var linkFn = $compile(template);
                    var element = linkFn(scope);
                    elem.after(element);
                };

            }
        }
    }]);
