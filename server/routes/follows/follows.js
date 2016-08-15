var User = require('./../../models/user');
var Notification = require('./../../models/notifications');

module.exports = function(router, passport, auth, nconf, mode){

    //follows
    // todo # disallow ability to like or follow yourself
    // todo # handle difference in 2 profiles [if followers and followings has difference]
    router.put('/follows', auth, function (req, res) {
        if (req.query.username == '') {
            return res.send(req.user);
        }
        if (req.query.username == req.user.username) {
            return res.send(req.user);
        }
        User.findOne({'username': req.query.username}, function (err, user) {
            function findIndexOfKey(key, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == key) return i;
                }
                return -1;
            }

            if (err) {
                console.log(err);
                return res.send(err);
            }
            if (user) {

                console.log(user);
                var index = findIndexOfKey(req.user.username, user.followers);
                if (index + 1) {
                    //
                    // remove folower
                    //
                    user.followers.splice(index, 1);
                    var profile = user;
                    user.save(function () {
                        console.log('deleted!');
                        User.findOne({'username': req.user.username}, function (err, user) {
                            if (err) {
                                console.log(err);
                                return res.send(err);
                            }
                            if (user) {
                                //
                                // remove folowing
                                //
                                var index = findIndexOfKey(req.query.username, user.followings);
                                if (index + 1) {
                                    user.followings.splice(index, 1);
                                }
                                user.save(function () {
                                    console.log('user ' + req.user.username + ' is not follows ' + req.query.username + ' yet!');
                                    return res.send(profile);
                                });
                            } else {
                                return res.send('not found or error');
                            }
                        });
                    });
                } else {
                    //
                    // adding follower
                    //
                    user.followers.push(req.user.username);
                    var profile = user;
                    user.save(function () {
                        User.findOne({'username': req.user.username}, function (err, user) {
                            if (err) {
                                console.log(err);
                                return res.send(err);
                            }
                            if (user) {
                                //
                                // adding following
                                //
                                user.followings.push(req.query.username);
                                user.save(function () {
                                    console.log('user ' + req.user.username + ' follows ' + req.query.username + '!');

                                    var notify = new Notification();
                                    notify.idOwner = profile._id;
                                    notify.idUser = user._id;
                                    notify.type = 'following';
                                    notify.date = new Date();
                                    notify.viewed = false;

                                    notify.save(function (err) {
                                        if (err) {
                                            res.sendStatus(500);
                                        }
                                        console.log('added!');

                                        return res.send(profile);
                                    });
                                });
                            } else {
                                return res.send('not found or error');
                            }
                        });
                        //return res.send(user);
                    });
                }

                //return res.send(user);
            } else {
                console.log('Error 2');
                return res.sendStatus(500);
            }
        });
    });

}