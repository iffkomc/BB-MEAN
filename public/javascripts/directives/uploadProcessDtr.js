/**********************************************************************
 * Upload Process directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('uploadingProgress', function () {
        return {
            templateUrl: "../../views/uploadProcess.html",
            restrict: 'E',
            replace: true,
            scope: {
                progress: "=uploadingProgress"
            },
            // scope : {
            // 	dataBlProgress : '=uploadProcessDtr'
            // },
            link: function (scope, elem, attrs) {
                function getAngle(percentage, elem) {
                    var angle = percentage * 3.6;
                    angle = angle.toFixed(0);
                    //console.log(angle);
                    var leftside = elem.find('.left-side');
                    if (angle <= 180) {
                        leftside.css('transform', 'rotate(' + angle + 'deg)');
                    }
                    else {
                        if (elem.hasClass('progress-30')) {
                            elem.removeClass('progress-30');
//				    		alert('pr30 deleeted!');
                        }
                        if (!elem.hasClass('progress-60')) {
                            elem.addClass('progress-60');
                            //alert('pr60 added!');
                        }
                        elem.addClass('progress-60').removeClass('progress-30');
                        leftside.css('transform', 'rotate(' + angle + 'deg)');

                    }

                }

                angular.element('body').on('mouseenter', '.profile-avatar', function () {
                    var width = angular.element(window).width();
                    if (width > 970)
                        angular.element('.profile-avatar__add-new').fadeIn(100);
                });
                angular.element('body').on('mouseleave', '.profile-avatar', function () {
                    var width = $(window).width();
                    if (width > 970) {
                        angular.element('.profile-avatar__add-new').fadeOut(70);
                    }
                });
                //console.log('/////////////////////////////////////////');
                //console.log(elem);
                //console.log(scope.progress);
                //console.log('/////////////////////////////////////////');
                //console.log(elem.find('.left-side').css('clip', 'rect(auto, auto, auto, auto)'));


                getAngle(scope.progress, elem);
                scope.$watch('progress', function (newValue, oldValue) {
                    //console.log('Value changed!');
                    //console.log(oldValue);
                    //console.log(newValue);
                    getAngle(scope.progress, elem);
                });
                // FIXME what is the reason here must scroll to top? This may cause confusing if using scrolling to implement pagination.
                // $element.find('.scrollArea').scrollTop(0);


            }
        };
    });