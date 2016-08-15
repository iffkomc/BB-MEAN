'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('Notification',{
    type: String,
    idOwner: String,
    idUser: String,
    date: Date,
    itemId: String,
    viewed: Boolean,
    status: String
});