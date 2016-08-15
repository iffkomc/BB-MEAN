'use strict';

var express = require('express');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var randomString = require('./../middleware/random-string');
var _ = require('underscore-node');

var User = require('./../models/user');
var Brand = require('./../models/brand');
var Photo = require('./../models/photo');
var Battle = require('./../models/battle');
var Notification = require('./../models/notifications');

var bcrypt = require('bcryptjs');

var SALT_WORK_FACTOR = 10;

var Meepo = require('./../middleware/meepo');
module.exports = function (router, passport, auth, nconf, mode) {

    router.get('/cleanerToolIffkomcProd', auth, function(req, res){
        User.find({}, function(err, users){
           if(err || !users.length){
               return res.send(500);
           }
            var counter = 1;
           for(var i = 0; i < users.length; i++){
               for(var index1 = 0; index1 < users[i].followers.length; index1++){

                   users[i].followers = _.uniq(users[i].followers);
               }
               for(var index1 = 0; index1 < users[i].followings.length; index1++){
                   users[i].followings = _.uniq(users[i].followings);
               }
               for(var index1 = 0; index1 < users[i].likes.length; index1++){
                   users[i].likes = _.uniq(users[i].likes);
               }
               console.log(users[i]);

               users[i].save(function(err){
                   if(!err){
                       if(counter == users.length){
                           return res.sendStatus(200);
                       }
                       else{
                           counter++;
                       }
                   }
                   else{
                       counter++;
                   }
               });

           }
        });
    });

    var usersGet = require('./users/get');
    usersGet(router, passport, auth, nconf, mode);

    var usersPut = require('./users/put');
    usersPut(router, passport, auth, nconf, mode);

    var usersDelete = require('./users/delete');
    usersDelete(router, passport, auth, nconf, mode);

    var uploadRotes = require('./upload/upload');
    uploadRotes(router, passport, auth, nconf, mode);

    var authRoutes = require('./auth/auth');
    authRoutes(router, passport, auth, nconf, mode);

    var forgotRoutes = require('./auth/forgot');
    forgotRoutes(router, passport, auth, nconf, mode);

    var likes = require('./likes/likes');
    likes(router, passport, auth, nconf, mode);

    var battles = require('./battles/battles');
    battles(router, passport, auth, nconf, mode);

    var notifications = require('./notifications/notifications');
    notifications(router, passport, auth, nconf, mode);

    var photos = require('./photos/photos');
    photos(router, passport, auth, nconf, mode);

    var follows = require('./follows/follows');
    follows(router, passport, auth, nconf, mode);

    var commentsGet = require('./comments/get');
    commentsGet(router, passport, auth, nconf, mode);

    var commentsPost = require('./comments/post');
    commentsPost(router, passport, auth, nconf, mode);

    var commentsPut = require('./comments/put');
    commentsPut(router, passport, auth, nconf, mode);

    var commentsDelete = require('./comments/delete');
    commentsDelete(router, passport, auth, nconf, mode);

    var brandsRoutes = require('./brands/brands');
    brandsRoutes(router, passport, auth, nconf, mode);


    // V  route '/' is no need V
    router.get('/', function (req, res) {
        res.sendFile('html/index.html', {root: path.join(__dirname + '/../../public')});
    });



    return router;
}
