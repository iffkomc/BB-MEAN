var Photo = require('./../../models/photo');
var findIndexOfKey = require('./../../middleware/findIndexOfKey');

module.exports = function (router, passport, auth, nconf, mode) {
    router.put('/comments', auth, function (req, res) {
        var id = req.query.id;

        if (id) {
            return Photo.findOne({'comments._id': id}, function (err, photo) {
                if (err || !photo) {
                    console.error('comments/get');
                    return res.sendStatus(500);
                }
                if (photo) {
                    var flag = false;
                    var i;
                    photo.comments.forEach(function (item, index) {
                        if (id == item._id) {
                            flag = true;
                            i = index;
                        }
                    });
                    if (!flag) {
                        return res.sendStatus(400);
                    }
                    if (flag) {
                        var index = findIndexOfKey(req.user._id, photo.comments[i].likes);
                        if (index + 1) {
                            photo.comments[i].likes.splice(index, 1);
                        }
                        else {
                            photo.comments[i].likes.push(req.user._id);
                        }
                        photo.save(function (err) {
                            if (err) {
                                console.error(err);
                                return res.sendStatus(500);
                            }
                            return res.send(photo.comments[i]);
                        });
                    }
                }
            });
        }
    });
}