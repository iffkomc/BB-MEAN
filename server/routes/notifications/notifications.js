var Meepo = require('./../../middleware/meepo');
var User = require('./../../models/user');
var Notification = require('./../../models/notifications');

module.exports = function (router, passport, auth, nconf, mode) {

// notifications GET
    router.get('/notifications', auth, function (req, res) {
        Notification.find({idOwner: req.user._id}, function (err, notifications) {
            var asyncParallel = new Meepo();
            if (err) {
                console.log(err);
                return res.send(err);
            }
            if (notifications.length) {
                asyncParallel.push(undefined, notifications.length);
                notifications.forEach(function (item) {
                    Notification.findById(item._id, function (err, notification) {
                        if (err) {
                            return res.send(err);
                        }
                        notification.viewed = true;
                        notification.save(asyncParallel.itemComplete);
                    });
                });
                asyncParallel.callback(function () {
                    console.log('all notifications is getted!');
                    res.send(notifications);
                });
            }
            else {
                res.send(notifications);
            }

        });
    });
// notification counter get
    router.get('/notifications/counter', auth, function (req, res) {
        Notification.find({idOwner: req.user._id, viewed: false}, function (err, notifications) {
            if (err) {
                console.error('notifications counter error');
                console.error(err);
                res.sendStatus(500);
                return res.send(err);
            }
            if (notifications) {
                return res.send((notifications.length).toString());
            }
        });
    });
}