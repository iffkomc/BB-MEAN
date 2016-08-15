'use strict';
var async = require('async');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");

var randomString = require('./../../middleware/random-string');
var User = require('./../../models/user');

module.exports = function(router, passport, auth, nconf, mode) {
    router.post('/forgot', function(req, res){
        async.waterfall([
            function(done){
                var token = randomString(30);
                console.log('func #2.-1');
                console.log(req.body);
                User.findOne({email: req.body.email}, function(err, user){
                    if(err || !user){
                        console.log('func #2.0');
                        console.log('no such email (or error) for sending mail');
                        return res.sendStatus(400);
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                    console.log('func #2.1');

                    user.save(function (err) {
                        console.log('func #2.2');
                        done(err, token, user);
                    })
                })
            },
            function(token, user, done){
                console.log('Ready for sending...');
                console.log(token);
                console.log(user);
                var transport = nodemailer.createTransport(smtpTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secureConnection : false,
                    //port: 465,
                    //secure: true, // use SSL
                    auth: {
                        user: 'burbl.co@gmail.com',
                        pass: 'burbl1234'
                    }
                }));
                var mailOptions = {
                    to: req.body.email,
                    //to: 'iffkomc@gmail.com',
                    from: 'burbl.co@gmail.com',
                    subject: 'Burbl.co Password Recovery',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    nconf.get(mode + ':localUrl') + '#/recovery?token=' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                }
                transport.sendMail(mailOptions, function(err){
                    if(err){
                        console.error('err');
                        console.error(err);
                    }
                    console.error('user.email');
                    console.log(user.email);
                    res.send(user.email);
                })
            }
        ], function(err){
            if(err){
                return next(err);
            }
            res.send('last func');
        });
    });
    router.post('/forgot/:token', function(req, res){
       User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}).select('+password').exec(function (err, user) {
           if(!user || err){
               console.error('token not found or some error happens');
               return res.sendStatus(400);
           }
           else{
               user.password = req.body.password;
               user.resetPasswordExpires = undefined;
               user.resetPasswordToken = undefined;

               user.save(function(err){
                  console.log('new user:');
                   res.send(user);

                   //
                   // todo iffkomc # here you should send email to user with notification of changed password
                   //
               });
           }
       })
    });
}