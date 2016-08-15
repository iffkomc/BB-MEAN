var gulp = require('gulp');
var concatCSS = require('gulp-concat-css');
var cssnano = require('gulp-cssnano');
var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");
var gulp = require("gulp");
var sass = require("gulp-sass");
var jade = require('gulp-jade');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var sync = function(src, dest){
	return function () {
		var YOUR_LOCALS = {};

		gulp.src(src)
			.pipe(jade({
				locals: YOUR_LOCALS
			}))
			.pipe(gulp.dest(dest))
			.pipe(reload({stream: true}));
	}
}


module.exports = sync;