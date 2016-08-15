'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('Battle',{
	id1: String,
	id2: String, 

    idPhoto1: String,
    idPhoto2: String,

    rateIdsPhoto1: [String],
    rateIdsPhoto2: [String],

    winner: String,
    category: String,
    viewsIds: [String],
    type: String,
    date: Date
});