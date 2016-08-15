var User = require('./../../models/user');
var Meepo = require('./../../middleware/meepo');

module.exports = function (router, passport, auth, nconf, mode) {

    router.get('/regenerate-passwords', function (req, res) {
        if (!req.query.pass || req.query.pass != 'burbl4ever') return res.send('err');
        User.find(function (err, users) {
            if (err || !users.length) {
                res.sendStatus(500);
            }
            if (users.length) {
                var async = new Meepo();
                async.push(undefined, users.length);
                async.callback(function () {
                    res.sendStatus(200);
                });
                console.log('start async');
                users.forEach(function (user, index) {
                    user.password = '0';
                    user.save(function (err) {
                        if (err) {
                            async.itemComplete();
                            console.log(err);
                            return 0;
                        }
                        console.log('complete ' + index);
                        async.itemComplete();
                    });
                });
            }
        })
    });

    // route to test if the user is logged in or not
    router.get('/loggedin', function (req, res) {
        console.log('---------------------------------------');
        console.log(req.user);
        console.log(req.session);
        console.log('---------------------------------------');
        if (req.isAuthenticated()) {
            console.log('Авторизован...');
            console.log(req.user);
            var sendUser;
            User.findOne({'username': req.user.username}, function (err, user) {
                res.send(user);
            });
        } else {
            res.status(401).send('0');
        }
    });

    // route to log in
    router.post('/login', passport.authenticate('local'), function (req, res) {
        console.log('req.user');
        console.log(req.user);
        res.send(req.user);
    });


    //fb
    router.get("/auth/facebook", passport.authenticate("facebook"));

    router.get("/auth/facebook/callback",
        passport.authenticate("facebook", {
            successRedirect: '/#/',
            failureRedirect: '/#/signup'
        }),
        function (req, res) {
            res.send(req.user);
        },
        function (err, req, res, next) {
            // You could put your own behavior in here, fx: you could force auth again...
            // res.redirect('/auth/facebook/');
            if (err) {
                res.status(400);
                res.render('error', {message: err.message});
            }
        }
    );

    //inst
    router.get("/auth/instagram", passport.authenticate("instagram"));

    router.get("/auth/instagram/callback",
        passport.authenticate("instagram", {
            successRedirect: '/#/',
            failureRedirect: '/#/signup'
        }),
        function (req, res) {
            res.send(req.user);
        }
    );

    //twitter
    router.get('/auth/twitter', passport.authenticate('twitter'));

    router.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/#/',
            failureRedirect: '/#/signup'
        }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.send(req.user);
        });

    //VKontakte
    router.get('/auth/vkontakte', passport.authenticate('vkontakte'));

    router.get('/auth/vkontakte/callback',
        passport.authenticate('vkontakte', {
            successRedirect: '/#/',
            failureRedirect: '/#/signup'
        }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.send(req.user);
        });


    // route to log out
    router.post('/logout', function (req, res) {
        req.logOut();
        res.send(200);
    });

    // route to sign up
    router.post('/signup', passport.authenticate('signup', { failWithError: true }),
        function (req, res) {
            res.send(req.user);
        },
        function(err, req, res) {
            // handle error
            res.send(err);
        }
    );
}