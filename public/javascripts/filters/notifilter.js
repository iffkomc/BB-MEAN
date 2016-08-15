/**********************************************************************
 * notifilter directive
 **********************************************************************/
'use strict';

angular.module('app')
    .filter('notifilter', function () {
        return function (notifies, type) {
            if (notifies && type) {
                var notifiesTmp = [];
                console.log(type);

                if (type == "likes") {
                    console.log('I am in likes');
                    console.log(notifiesTmp);
                    notifies.forEach(function (item, index) {
                        if (item.type == "like") {
                            notifiesTmp.push(item);
                        }
                        else if (item.type == "vote") {
                            notifiesTmp.push(item);
                        }
                    });
                    return notifiesTmp;
                }
                if (type == "friends") {
                    console.log('I am in friends');
                    console.log(notifiesTmp);
                    notifies.forEach(function (item, index) {
                        if (item.type == "reject" || item.type == "request" || item.type == "userBattleStarted" || item.type == "followingBattleStarted") {
                            notifiesTmp.push(item);
                        }
                    });
                    return notifiesTmp;
                }
                if (type == "followers") {
                    console.log('I am in followers');
                    console.log(notifiesTmp);
                    notifies.forEach(function (item, index) {
                        if (item.type == "following") {
                            notifiesTmp.push(item);
                        }
                        else if (item.type == "followSocial") {
                            notifiesTmp.push(item);
                        }
                    });
                    return notifiesTmp;
                }
                if (type == "feedbacks") {
                    console.log('I am in feedbacks');
                    console.log(notifiesTmp);
                    notifies.forEach(function (item, index) {
                        if (item.type == "comment") {
                            notifiesTmp.push(item);
                        }
                    });
                    return notifiesTmp;
                }

                return notifiesTmp;
            }

            return notifies;
        }
    });