'use strict';
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');


var nconf = require('nconf');

nconf.argv()
       .env()
       .file({ file: path.join(__dirname + '/config.json') });

//nconf.set('database:host', '127.0.0.1');
//nconf.set('database:port', 5984);
//console.log(nconf.get('database:host'));
var mode = nconf.get('mode');

var routesInit = require('./routes/index');

//====================================================================
//                            D A T A B A S E           
//====================================================================
// connecting to DB
console.log(nconf.get(mode + ':dbUrl'));
var dbConfig = nconf.get(mode + ':dbUrl');
mongoose.connect(dbConfig);

var User = require('./models/user');

//====================================================================
//                  P A S S P O R T   S T R A T E G I E S
//====================================================================
var initPassport = require('./passport/init');
initPassport(passport, nconf, mode);



//====================================================================
//                  E X P R E S S   A P P 
//====================================================================
var app = express();
app.set('env', mode);
app.set('port', process.env.PORT || nconf.get(mode + ':port'));

//=====================
// M I D D L E W A R E
//=====================
var middleware = require('./middleware/index')(app, passport);
var auth = middleware.auth;

//=====================
//     S T A T I C
//=====================
app.use(express.static(path.join(__dirname + '/../public')));
app.use('/bower_components', express.static(path.join(__dirname + '/../bower_components')));

//=====================
//     R O U T E S
//=====================
var routes = routesInit(app, passport, auth, nconf, mode);



//app.set('env', 'production');
console.log(app.get('env'));

//==================================================================
app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});