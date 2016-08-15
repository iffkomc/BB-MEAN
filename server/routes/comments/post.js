var User = require('./../../models/user');
var Photo = require('./../../models/photo');
var Notification = require('./../../models/notifications');

module.exports = function (router, passport, auth, nconf, mode) {
    router.post('/comments', auth, function (req, res) {
        var photoId = req.query.photoId;
        var comment = req.body.comment;
        console.log(req.body);
        if (!comment) {
            return res.sendStatus(500);
        }
        //
        //id: String,
        //    userId: String,
        //    replyTo: String,
        //    date: Date,
        //    likes: [String]
        var newComment = {
            userId: req.user._id,
            replyTo: comment.replyTo, // todo iffkomc # need to check if exist comment or not
            text: comment.text,
            date: new Date(),
            likes: []
        };
        Photo.findById(photoId, function (err, photo) {
            if (err || !photo) {
                console.error('comments/post error');
                return res.sendStatus(500);
            }
            if (photo) {
                if (!photo.comments || !photo.comments.length) {
                    photo.comments = [];
                }
                photo.comments.push(newComment);
                photo.save(function (err) {
                    if (err) {
                        console.error('comments/post error');
                        return res.sendStatus(500);
                    }
                    //idOwner
                    //idUser
                    //date
                    //type
                    //itemId комментарий айди
                    //status фотография айди
                    //    viewed: Boolean,
                    var notify = new Notification();
                    notify.idOwner = photo.ownerId;
                    notify.idUser = req.user._id;
                    notify.date = new Date();
                    notify.type = 'comment';
                    notify.itemId = photo.comments[photo.comments.length-1]._id;
                    notify.status = photo._id;
                    notify.viewed = false;

                    notify.save(function(err){
                        if(err){
                            console.error(err);
                            return res.sendStatus(500);
                        }
                        return res.send(photo);
                    });
                })
            }
        });
    });
};