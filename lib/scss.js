var gulp = require('gulp');
var concatCSS = require('gulp-concat-css');
var cssnano = require('gulp-cssnano');
var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");
var connect = require("gulp-connect");
var sass = require("gulp-sass");
var wiredep = require('gulp-wiredep');
var jade = require('gulp-jade');
var browserSync = require('browser-sync').create();
var prettify = require('gulp-html-prettify');

var scss = function(src, dest){
	return function () {
		gulp.src(src)
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest(dest))
			.pipe(autoprefixer({
				browsers: ['last 40 versions']
			}))
			.pipe(browserSync.stream());
	}
}

module.exports = scss;