/**********************************************************************
 * touchInput directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('touchInput', function () {
        return {
            restrict: 'A',
            scope: {
                brands: '=brands'
            },
            link: function (scope, elem, attrs) {
                scope.brands = [];
                var old = {
                    position: {
                        x: 0,
                        y: 0
                    }
                };

                function setPositionElement(x, y, box, element) {
                    var $box = angular.element(box);
                    var $element = angular.element(element);
                    var elemSize = {
                        height: $element.height(),
                        width: $element.width()
                    }
                    var image = {
                        height: $box.height(),
                        width: $box.width()
                    }
                    if (x / image.width >= 0.5) {
                        $element.css({
                            position: 'absolute',
                            top: ( y - elemSize.height / 2 ) / image.height * 100 + '%',
                            right: (image.width - x) / image.width * 100 + '%'
                        });
                    }
                    else if (x / image.width < 0.5) {
                        $element.css({
                            position: 'absolute',
                            top: ( y - elemSize.height / 2 ) / image.height * 100 + '%',
                            left: x / image.width * 100 + '%'
                        });
                    }
                }
                var parent = elem.parent();
                var firstClick = true;
                elem.click(function (e) {
                    var image = {
                        height: elem.height(),
                        width: elem.width()
                    };
                    if (firstClick) {


                        var templateNewBrand = '<div class="brand-new"><input type="text"></div>';
                        var x = e.offsetX;
                        var y = e.offsetY;

                        parent.css({
                            position: 'relative'
                        });

                        parent.append(templateNewBrand);
                        var newBrand = parent.find('.brand-new');

                        old.position.x = x;
                        old.position.y = y;
                        setPositionElement(x, y, elem, newBrand);

                        firstClick = false;
                    }
                    else{

                        var oldNewBrand = parent.find('.brand-new');
                        if (oldNewBrand.length) {
                            old.value = oldNewBrand.find('input').val();
                            scope.brands.push({
                                value: old.value,
                                position: {
                                    x: old.position.x / image.width,
                                    y: old.position.y / image.height
                                }
                            });

                            var templateBrandLeft = '<span class="brandAdded newest"><i class="arrowLeft"></i><span>' + old.value + '</span></span>';
                            var templateBrandRight = '<span class="brandAdded newest"><span>' + old.value + '</span><i class="arrowRight"></i></span>';

                            if (old.position.x / image.width >= 0.5) {
                                //console.log('right');
                                //console.log(old.position.x);
                                var templateBrand = templateBrandRight;
                            }
                            else if (old.position.x / image.width < 0.5) {
                                //console.log('left');
                                //console.log(old.position.x);
                                var templateBrand = templateBrandLeft;
                            }
                            parent.append(templateBrand);
                            var brand = parent.find('.brandAdded.newest');
                            setPositionElement(old.position.x, old.position.y, elem, brand);
                            brand.removeClass('newest');
                            oldNewBrand.remove();
                        }

                        firstClick = true;
                    }
                });
            }
        }
    });