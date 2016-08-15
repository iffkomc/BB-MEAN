'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('Photo',{
    ownerId: String,
    name: String,
    comment: String,
    comments: [{
        id: String,
        userId: String,
        replyTo: String,
        text: String,
        date: Date,
        likes: [String]
    }],
    likes: [String],
    brands: Array,
    price: String,
    startDate: Date,
    battleType: String,
    isFinished: Boolean,
    viewsIds: [String]
});
