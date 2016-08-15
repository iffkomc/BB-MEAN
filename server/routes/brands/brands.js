'use strict';
var Brand = require('./../../models/brand');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");

var randomString = require('./../../middleware/random-string');
var User = require('./../../models/user');

module.exports = function(router, passport, auth, nconf, mode) {
    router.get('/brands', auth, function(req, res){
        if(req.query.id){
            return Brand.findById(req.query.id, function(err, brand){
               if(err || !brand){
                   console.log(err);
                   return res.send(err);
               }
                return res.send(brand);
            });
        }
        Brand.find({}, function(err, brands){
            if(err || !brands.length){
                console.error(err);
                return res.send(500);
            }
            else{
                console.log(brands);
                res.send(brands);
            }
        })
    });
}