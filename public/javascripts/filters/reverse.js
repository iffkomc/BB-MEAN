/**********************************************************************
 * reverse directive
 **********************************************************************/
'use strict';

angular.module('app')
    .filter('filterBrand', function () {
        return function (items, brandsArr) {
            var tmp = [];
            //console.log(brandsArr);
            if (!brandsArr.length) {
                return items;
            }
            //console.log('Year: ' + currentYear);
            items.forEach(function (item) {
                console.log(item);
                brandsArr.forEach(function (brand) {
                    brand.photosId.forEach(function (photoId) {
                        if (photoId == item._id) {
                            tmp.push(item);
                        }
                    });
                });
            });
            return tmp;
        }
    })
    .filter('filterAge', function () {
        return function (items, age) {
            var age = parseInt(age);
            var currentYear = (new Date).getFullYear();
            var tmp = [];
            if (!age) {
                return items;
            }
            //console.log('Year: ' + currentYear);
            items.forEach(function (item) {
                //console.log('------');
                if (item.birth) {
                    var birth = item.birth.split('.');
                    if (birth.length == 3) {
                        var year = birth[2];
                        year = parseInt(year);
                        //console.log('birthYear: ' + year);
                        if (Math.abs(year + age - currentYear) < 2) {
                            tmp.push(item);
                        }
                    }
                }
                //console.log('!!!!!');
            });
            return tmp;
        }
    })
    .filter('filterCity', function () {
        return function (items, city) {
            var tmp = [];
            if (!city) {
                return items;
            }
            else {

                items.forEach(function (item) {
                    console.log('-------');
                    console.log(city);
                    console.log(item.city);
                    if (item.city) {
                        console.log('city exists');
                        if (item.city == city) {
                            tmp.push(item);
                        }
                    }
                });
                return tmp;
            }
        }
    })
    .filter('findInByQuery', function () {
        return function (items, query, custom) {
            //console.log(items);
            //console.log(query);
            if (custom) {
                var tmp = [];
                if (!query) {
                    return items;
                }
                else {
                    items.forEach(function (item) {
                        var isAdded = false;
                        if (item.user.name) {
                            //console.log('finded');
                            if (item.user) {
                                if (item.user.name.toLowerCase().search(query) + 1 > 0) {
                                    tmp.push(item);
                                    isAdded = true;
                                }
                            }
                            if (item.user.username != '' && !isAdded) {
                                //console.log(item.user.username);
                                //console.log('search status:');
                                //console.log(item.user.username.toLowerCase().search(query));
                                if (item.user.username.toLowerCase().search(query) + 1 > 0) {
                                    tmp.push(item);
                                    isAdded = true;
                                }
                            }
                        }

                    });
                    return tmp;
                }
            }
            else {
                var tmp = [];
                if (!query) {
                    return items;
                }
                else {
                    items.forEach(function (item) {
                        var isAdded = false;
                        if (item.name) {
                            if (item.name.toLowerCase().search(query) + 1 > 0) {
                                tmp.push(item);
                                isAdded = true;
                            }
                        }
                        if (item.username && !isAdded) {
                            if (item.username.toLowerCase().search(query) + 1 > 0) {
                                tmp.push(item);
                                isAdded = true;
                            }
                        }

                    });
                    return tmp;
                }
            }

        }
    })
    .filter('reverse', function () {
        return function (items) {
            if (items)
                return items.slice().reverse();
        };
    })