'use strict';

var mongoose = require('mongoose');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;

var request = require('request');
var Meepo = require('./../middleware/meepo');
var User = require('./../models/user');
var Notification = require('./../models/notifications');

module.exports = function (passport, nconf, mode) {

    passport.use(new LocalStrategy(
        function (username, password, done) {
            if (!username || !password) {
                return res.sendStatus(500);
            }
            console.log(username);
            User.findOne({"username": username}).select('+password').exec(function (err, user) {
                if (err) {
                    console.log('User is not found');
                    return res.send(500);
                }
                else if (user) {
                    console.log('authed');
                    user.comparePassword(password, function (err, isMatch) {
                        console.log('username');
                        console.log(username);
                        console.log('password');
                        console.log(password);
                        console.log('done');
                        console.log(done);
                        if (err) {
                            console.log(err);
                            console.log('errrrror');
                            return done(err);
                        }
                        if (isMatch) {
                            console.log('isMatch');
                            return done(null, user);
                        }
                        else{
                            console.log('Password is not correct.');
                            err = 'Password is not correct.';
                            return done(err);
                        }
                    });
                }
                else {
                    return done(null, false, {message: 'Incorrect username.'});
                }
            });
        }
    ));

    // Define the strategy to be used by PassportJS signup
    passport.use('signup', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            var findOneOrCreateUser = function () {
                User.findOne({'username': username}, function (err, user) {
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    if (user) {
                        err = 'User already exists with username: ' + username;
                        console.log(err);
                        console.log('req');
                        //console.log(req);
                        console.log('username');
                        console.log(username);
                        console.log('password');
                        console.log(password);
                        console.log('done');
                        console.log(done);
                        return done(err);
                    }
                    else {
                        var forbid = nconf.get(mode + ':forbid');
                        var forbidFlag = false;
                        forbid.forEach(function (item) {
                            if(item == username){
                                forbidFlag = true;
                            }
                        });
                        if(forbidFlag){
                            console.log('forbidded');
                            return done(null, false);
                        }
                        User.findOne({'email': req.body.email}, function(err, user){
                            if(err){
                                console.log('Error in SignUp: ' + err);
                                return done(err);
                            }
                            if(user){
                                err = 'User already exists with email: ' + req.body.email;
                                console.log(err);
                                return done(err);
                            }
                            else{
                                var newUser = new User();

                                newUser.username = username;
                                newUser.password = password;
                                newUser.email = req.body.email;

                                newUser.save(function (err) {
                                    if (err) {
                                        err = 'Password must contain at least 4 characters';
                                        console.log(err);
                                        return done(err);
                                    }
                                    console.log('User Registration successful');
                                    console.log('username: ' + newUser.username);
                                    console.log('email: ' + newUser.email);
                                    console.log('password: ' + newUser.password);
                                    return done(null, newUser);
                                });
                            }
                        });
                    }
                });
            }
            process.nextTick(findOneOrCreateUser);
        }
    ));

    // Twitter strategy
    passport.use(new TwitterStrategy({
            consumerKey: nconf.get(mode + ':twitKey'),
            consumerSecret: nconf.get(mode + ':twitSecret'),
            callbackURL: nconf.get(mode + ':baseUrl') + "auth/twitter/callback",
            passReqToCallback: true
        },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                console.log('This is request:');
                console.log(req);
                console.log('This is token:');
                console.log(token);
                console.log('This is refreshToken:');
                console.log(refreshToken);
                console.log('This is profile:');
                console.log(profile);
                console.log('This is done:');
                console.log(done);
                User.findOne({'twitId': profile.id}, function (err, oldUser) {
                    if (oldUser) {
                        done(null, oldUser);
                    }
                    else {
                        if (req.user) {
                            User.findOneAndUpdate({'username': req.user.username}, {
                                twitId: profile.id,
                                twUsername: profile.username,
                                twitToken: token,
                                //fbName : profile.displayName,
                                //fbEmail : profile.emails[0].value
                            }, function (err, user) {
                                done(null, user);
                            })
                        }
                        else {
                            done(null, false);
                        }
                    }
                });
            });
        }
    ));

    // Instagram strategy
    passport.use(new InstagramStrategy({
            clientID: nconf.get(mode + ':instKey'),
            clientSecret: nconf.get(mode + ':instSecret'),
            callbackURL: nconf.get(mode + ':localUrl') + "auth/instagram/callback",
            passReqToCallback: true
        },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                console.log('This is request:');
                console.log(req);
                console.log('This is token:');
                console.log(token);
                console.log('This is refreshToken:');
                console.log(refreshToken);
                console.log('This is profile:');
                console.log(profile);
                console.log('This is done:');
                console.log(done);
                User.findOne({'instId': profile.id}, function (err, oldUser) {
                    if (oldUser) {
                        done(null, oldUser);
                    }
                    else {
                        if (req.user) {
                            User.findOneAndUpdate({'username': req.user.username}, {
                                instId: profile.id,
                                instToken: token,
                                //fbName : profile.displayName,
                                //fbEmail : profile.emails[0].value
                            }, function (err, user) {
                                done(null, user);
                            })
                        }
                        else {
                            done(null, false);
                        }
                    }
                });
            });
        }
    ));

    // Facebook strategy
    passport.use(new FacebookStrategy({
            clientID: nconf.get(mode + ':fbKey'),
            clientSecret: nconf.get(mode + ':fbSecret'),
            callbackURL: nconf.get(mode + ':localUrl') + "auth/facebook/callback",
            passReqToCallback: true
        },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                console.log('This is request:');
                console.log(req);
                console.log('This is token:');
                console.log(token);
                console.log('This is refreshToken:');
                console.log(refreshToken);
                console.log('This is profile:');
                console.log(profile);
                console.log('This is done:');
                console.log(done);
                User.findOne({'fbId': profile.id}, function (err, oldUser) {
                    if (oldUser) {
                        done(null, oldUser);
                    }
                    else {
                        if (req.user) {
                            User.findOneAndUpdate({'username': req.user.username}, {
                                fbId: profile.id,
                                fbToken: token,
                                //fbName : profile.displayName,
                                //fbEmail : profile.emails[0].value
                            }, function (err, user) {
                                done(null, user);
                            })
                        }
                        else {
                            done(null, false);
                        }
                    }
                });
            });
        }
    ));

    // Vkontakte
    passport.use(new VKontakteStrategy({
            clientID: nconf.get(mode + ':vkKey'),
            clientSecret: nconf.get(mode + ':vkSecret'),
            callbackURL: nconf.get(mode + ':localUrl') + "auth/vkontakte/callback",
            passReqToCallback: true
        },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                console.log('This is request:');
                console.log(req);
                console.log('This is token:');
                console.log(token);
                console.log('This is refreshToken:');
                console.log(refreshToken);
                console.log('This is profile:');
                console.log(profile);
                console.log('This is done:');
                console.log(done);
                User.findOne({'vkId': profile.id}, function (err, oldUser) {
                    if (oldUser) {
                        done(null, oldUser);
                    }
                    else {
                        if (req.user) {
                            User.findOneAndUpdate({'username': req.user.username}, {
                                vkId: profile.id,
                                vkToken: token,
                                vkUrl: profile.profileUrl
                                //fbName : profile.displayName,
                                //fbEmail : profile.emails[0].value
                            }, function (err, user) {
                                function getVkListFriends(vkId, cb){
                                    var reqUrl = 'https://api.vk.com/method/friends.get?uid=' + vkId;
                                    request(reqUrl, function (error, response, body) {
                                        console.log('send the VK request...');
                                        if (!error && response.statusCode == 200) {
                                            console.log("--------body--------") // Show the HTML for the Google homepage.
                                            console.log(body) // Show the HTML for the Google homepage.
                                            var data = JSON.parse(body);
                                            console.log(data);
                                            if(data.error){
                                                console.error(data.error);
                                                cb(data.error);
                                            }
                                            if(data.response){
                                                console.error(data.response);
                                                cb(null, data.response);
                                            }
                                        }
                                        else{
                                            console.log('error');
                                            console.log(error);
                                            cb(error);
                                        }
                                    });
                                }
                                function createNotification(idOwner, idUser, cb){
                                    console.log('creating notification');
                                    var notify = new Notification();
                                    notify.type = 'followSocial';
                                    notify.idOwner = idOwner;
                                    notify.idUser = idUser;
                                    notify.date = new Date();
                                    notify.viewed = false;
                                    notify.status = 'VK';

                                    notify.save(function(err){
                                        if(err){
                                            cb(err);
                                        }
                                        else{
                                            cb(null, notify);
                                        }
                                    })
                                }
                                function notifyVkFriends(vkId, cb){
                                    getVkListFriends(vkId, function(err, friendList){
                                        if(err){
                                             console.log(err);
                                            return cb(err);
                                        }
                                        var async = new Meepo();
                                        async.push(undefined, friendList.length);
                                        async.callback(function () {
                                            return cb;
                                        });
                                        friendList.forEach(function(item){
                                            item = item.toString();
                                            User.findOne({vkId: item}, function (err, user) {
                                                if(err || !user){
                                                    console.log('user not found');
                                                    return async.itemComplete();
                                                }
                                                if(user){
                                                    console.log('found user!');
                                                    console.log(user);
                                                    return createNotification(user._id, req.user._id, function(err, notify){
                                                        if(err || !notify){
                                                            return async.itemComplete();
                                                        }
                                                        if(notify){
                                                            return async.itemComplete();
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    });
                                }
                                notifyVkFriends(profile.id, function (err) {
                                    if(err){
                                        return console.log(err);
                                    }
                                    return done(null, user);
                                });
                            });
                        }
                        else {
                            return done(null, false);
                        }
                    }
                });
            });
        }
    ));


    // Serialized and deserialized methods when got from session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}