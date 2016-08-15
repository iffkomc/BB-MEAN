'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('Brand',{
    photosId: [String],
    name: String
});