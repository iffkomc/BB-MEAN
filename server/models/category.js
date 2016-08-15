'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    id: String,
    username: String,
    password: String,
    email: String,
    name: String,
    city: String,
    about: String,
    birth: String, 
    followings: [String],
    followers: [String],
    likes: [String],

    fbId: String,
    fbToken: String,
    fbUrl: String,

    instId: String,
    instToken: String,
    instUrl: String,

    twitId: String,
    twitToken: String,
    twitUrl: String,

    vkId: String,
    vkToken: String,
    vkUrl : String,

    avatarName: String
});