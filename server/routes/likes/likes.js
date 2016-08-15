
var Meepo = require('./../../middleware/meepo');
var findIndexOfKey = require('./../../middleware/findIndexOfKey');
var User = require('./../../models/user');
var Notification = require('./../../models/notifications');

module.exports = function(router, passport, auth, nconf, mode){

    // Likes
    router.put('/likes', auth, function (req, res) {

        if (req.query.username == req.user.username) {
            return res.send(req.user);
        }
        console.log('req.query.username');
        console.log(req.query.username);
        console.log('req.user');
        console.log(req.user);
        User.findOne({'username': req.query.username}, function (err, user) {


            if (err) {
                console.log(err);
                return res.send(err);
            }
            if (user) {

                console.log(user);
                var index = findIndexOfKey(req.user.username, user.likes)
                if (index + 1) {
                    user.likes.splice(index, 1);
                    user.save(function () {
                        console.log('deleted!');
                        return res.send(user);
                    });
                } else {
                    user.likes.push(req.user.username);
                    user.save(function () {
                        var notify = new Notification();
                        notify.idOwner = user._id;
                        notify.idUser = req.user._id;
                        notify.type = 'like';
                        notify.date = new Date();
                        notify.viewed = false;

                        notify.save(function (err) {
                            if (err) {
                                return res.sendStatus(500);
                            }
                            console.log('added!');
                            return res.send(user);
                        });
                    })
                }

                //return res.send(user);
            } else {
                console.log('Error 2');
                return res.sendStatus(500);
            }
        });
    });

}
