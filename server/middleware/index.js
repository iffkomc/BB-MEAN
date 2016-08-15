'use strict';
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var errorHandler = require('errorhandler');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var multipart = require('connect-multiparty');

module.exports = function(app, passport){
	//app.use(express.json());
	// all environments
	app.use(favicon(path.join(__dirname + '/../../public/favicon.ico')));
	app.use(logger('dev'));

	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: true })); 
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(session({ 
	  secret: 'securedsession',
	  cookie: { maxAge: 3600000 },
	  rolling: true,
	  resave: true,
	  saveUninitialized: true
	}));
	app.use(passport.initialize()); // Add passport initialization
	app.use(passport.session());    // Add passport initialization

	//app.use(multipart());
	// development only
	if ('development' == app.get('env')) {
	  app.use(errorHandler());
	}
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');


	// Define a middleware function to be used for every secured routes
	var auth = function(req, res, next){
	  if (!req.isAuthenticated()) 
	  	res.send(401);
	  else
	  	next();
	};
	
	return {
		auth : auth
	}
}