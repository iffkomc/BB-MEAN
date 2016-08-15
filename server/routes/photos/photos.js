var Meepo = require('./../../middleware/meepo');
var User = require('./../../models/user');
var Photo = require('./../../models/photo');

module.exports = function (router, passport, auth, nconf, mode) {

    router.get('/photos', auth, function (req, res) {
        if (req.query.id) {
            return Photo.findById(req.query.id, function (err, photo) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                if (photo) {
                    res.send(photo);
                }
                if (!photo) {
                    res.sendStatus(400);
                }
            });
        }
        else if (req.query.username) {
            return User.findOne({username: req.query.username}, function (err, user) {
                if (err || !user) {
                    console.log('Failed to find user');
                    return res.sendStatus(400);
                }
                if (user) {
                    console.log(req.query);
                    console.log(req.query.type);
                    if (req.query.type == 'finished') {
                        return Photo.find({ownerId: user._id, isFinished: true}, function (err, photos) {
                            if (err) {
                                console.log('Failed to find photos');
                                return res.sendStatus(400);
                            }
                            if (!photos.length) {
                                console.error('no photos finded');
                                return res.sendStatus(400);
                            }
                            if (photos) {
                                return res.send(photos);
                            }
                        });
                    }
                    return Photo.find({ownerId: user._id}, function (err, photos) {
                        if (err || !photos.length) {
                            console.log('Failed to find photos');
                            return res.sendStatus(400);
                        }
                        if (photos) {
                            return res.send(photos);
                        }
                    });
                }
            })
        }
        else {
            return Photo.find({isFinished: true}, function (err, photos) {
                if (err || !photos.length) {
                    console.log(err);
                    return res.send(500);
                }
                else {
                    console.log(photos);
                    res.send(photos);
                }
            });
        }
    });
}