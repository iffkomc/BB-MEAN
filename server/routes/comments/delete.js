var Photo = require('./../../models/photo');
var findIndexOfKey = require('./../../middleware/findIndexOfKey');

module.exports = function (router, passport, auth, nconf, mode) {
    router.delete('/comments', auth, function (req, res) {
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
                            photo.comments.splice(index, 1);
                        }
                    });
                    photo.save(function (err) {
                        if (err) {
                            console.error(err);
                            return res.sendStatus(500);
                        }
                        return res.send(photo.comments);
                    })
                }
            });
        }
    });
}