var gulp = require('gulp');
var browserSync = require('browser-sync');

var connect = function(src){
	return function () {
		browserSync({
			server: src
		});
	}
}

module.exports = connect;