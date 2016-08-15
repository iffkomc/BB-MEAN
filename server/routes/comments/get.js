var Photo = require('./../../models/photo');

module.exports = function (router, passport, auth, nconf, mode) {
    router.get('/comments', auth, function (req, res) {
        var photoId = req.query.photoId;
        var id = req.query.id;

        if (id) {
            return Photo.findOne({'comments._id': id}, function (err, photo) {
                if (err || !photo) {
                    console.error('comments/get');
                    return res.sendStatus(500);
                }
                if (photo) {
                    var flag = false;
                    photo.comments.forEach(function (item, index) {
                        if (id == item._id) {
                            flag = true;
                            return res.send(item);
                        }
                    });
                    if (!flag) {
                        return res.sendStatus(400);
                    }
                }
            });
        }
        if (photoId) {
            return Photo.findById(photoId, function (err, photo) {
                if (err || !photo) {
                    console.error('comments/get');
                    return res.sendStatus(500);
                }
                if (photo) {
                    return res.send(photo.comments);
                }
            });
        }
    });
}