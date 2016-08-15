var User = require('./../../models/user');

module.exports = function (router, passport, auth, nconf, mode) {
    router.put('/users/:username', auth, function (req, res) {
        var newData = req.body.user;

        console.log(newData);
        User.findById(req.user._id).select('+password').exec(function (err, user) {
            if (err || !user) {
                console.log('Error: ' + err);
                res.send(err);
                return err;
            }
            if (user) {
                if(newData.password) {
                    user.password = newData.password;
                }
                user.username = newData.username;
                user.email = newData.email;
                user.name = newData.name;
                user.city = newData.city;
                user.about = newData.about;
                user.birth = newData.birth;
                user.lang = newData.lang;
                return user.save(function (err) {
                    if(err){
                        console.error(err);
                        return res.status(500).send(err);
                    }
                    else{
                        return res.send(user);
                    }
                });
            }
        });
    });
}