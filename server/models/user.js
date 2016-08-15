'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
var matchUsername = /^([a-zA-Z0-9\.]){4,}$/;
var matchPassword = /.{4,}$/;
//var matchEmail = /^\w+@[a-zA-Z_]{2,}\.[a-zA-Z]{2,}$/;
var matchEmail = /.{1,}/;

var UserSchema = new Schema({
    id: String,
    username: {
        type: String,
        match: matchUsername
    },
    password: {
        type: String,
        select: false,
        match: matchPassword
    },
    email: {
        type: String,
        match: matchEmail
    },
    name: String,
    city: String,
    about: String,
    birth: String,
    lang: String,
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

    avatarName: String,
    isBg: Boolean,

    resetPasswordToken: String,
    resetPasswordExpires: Date
});


UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    //if (user.isModified('username')){
    //    var err = 'username';
    //    var validateLogin = user.username.match();
    //    console.log(validateLogin);
    //    if(!validateLogin){
    //        return next(err);
    //    }
    //    if(validateLogin[0] != user.username){
    //        return next(err);
    //    }
    //}
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    console.log('this.password');
    console.log(this.password);
    console.log('candidatePassword');
    console.log(candidatePassword);
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        console.log('err: ' + err);
        console.log('isMatch: ' + isMatch);
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);