
var Meepo = require('./../../middleware/meepo');
var User = require('./../../models/user');

module.exports = function(router, passport, auth, nconf, mode){

    router.get('/users', auth, function (req, res) {
        if (req.query.username) {
            var username = req.query.username;
            console.log(username);
            User.findOne({'username': username}, function (err, user) {
                if (err) {
                    res.sendStatus(400);
                    return res.send(err);
                }
                if (user) {
                    return res.send(user);
                }
                if (!user) {
                    return res.sendStatus(400);
                }
            });
        }
        //
        //  find user by id QUERY
        //
        else if (req.query.id) {
            if(req.query.secure == true){
                User.findById(req.query.id).select('+password').exec(function (err, user) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    if (user) {
                        res.send(user);
                    } else {
                        console.log('user ' + req.query.id + ' is not found');
                        res.sendStatus(400);
                    }
                });
            }
            User.findById(req.query.id, function (err, user) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                if (user) {
                    res.send(user);
                } else {
                    console.log('user ' + req.query.id + ' is not found');
                    res.sendStatus(400);
                }
            });
        }
        else if (req.query.type) {
            if (req.query.type == 'followings') {
                var tmpUsers = [];
                var followingsList = req.user.followings;
                var limit = req.query.limit;
                var quontityOfUsers = limit && limit < followingsList.length ? limit : followingsList.length;
                var meepo = new Meepo();

                meepo.push(undefined, quontityOfUsers);
                for (var i = 0; i < quontityOfUsers; i++) {
                    User.findOne({username: followingsList[i]}, function (err, user) {
                        if (err || !user) {
                            meepo.itemComplete();
                            console.log('failed to find');
                        }
                        if (user) {
                            tmpUsers.push(user);
                            meepo.itemComplete();
                        }
                    });
                }
                meepo.callback(function () {
                    console.log(tmpUsers);
                    return res.send(tmpUsers);
                });
            }
            else {
                return res.sendStatus(500);
            }
        }
        else {
            return User.find({}, function(err, users){
                if(err || !users.length){
                    return res.send(err || 'no users');
                }
                res.send(users);
            })
        }
    });


    router.get('/users/:username', auth, function (req, res) {
        //
        //  find user by username PARAMS
        //
        if (req.params.username) {
            console.log('SEARCH by username');
            User.findOne({'username': req.params.username}, function (err, user) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                if (user) {
                    res.send(user);
                } else {
                    console.log('user ' + req.params.username + ' is not found');
                    res.sendStatus(403);
                }
            });
        }
        else {
            res.send(500);
        }
    });
};