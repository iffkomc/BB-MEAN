var gulp = require('gulp');
var concatCSS = require('gulp-concat-css');
var cssnano = require('gulp-cssnano');
var rename = require("gulp-rename");
var autoprefixer = require("gulp-autoprefixer");
var connect = require("gulp-connect");
var sass = require("gulp-sass");
var wiredep = require('gulp-wiredep');
var jade = require('gulp-jade');
var browserSync = require('browser-sync');
var prettify = require('gulp-html-prettify');

var config = {
	scss: [
		 './../src/scss/fonts.scss',
		 './../src/scss/basic.scss',
		 './../src/scss/icons/icons_desktop.scss',
		 './../src/scss/icons/icons_tablet.scss',
		 './../src/scss/icons/icons_mobile.scss',
		 './../src/scss/elements/header/header_desktop.scss',
		 './../src/scss/elements/header/header_tablet.scss',
		 './../src/scss/elements/header/header_mobile.scss',
		 './../src/scss/elements/menu-footer/menu-footer_desktop.scss',
		 './../src/scss/elements/menu-footer/menu-footer_tablet.scss',
		 './../src/scss/elements/menu-footer/menu-footer_mobile.scss',
		 './../src/scss/elements/main-header/main-header_desktop.scss',
		 './../src/scss/elements/main-header/main-header_tablet.scss',
		 './../src/scss/elements/main-header/main-header_mobile.scss',
		 './../src/scss/mainStyles/main_desktop.scss',
		 './../src/scss/mainStyles/main_tablet.scss',
		 './../src/scss/mainStyles/main_mobile.scss',
		 './../src/scss/notifications/notifications_desktop.scss',
		 './../src/scss/notifications/notifications_tablet.scss',
		 './../src/scss/notifications/notifications_mobile.scss',
		 './../src/scss/about/about_desktop.scss',
		 './../src/scss/about/about_tablet.scss',
		 './../src/scss/about/about_mobile.scss',
		 './../src/scss/profile/profile_desktop.scss',
		 './../src/scss/profile/profile_tablet.scss',
		 './../src/scss/profile/profile_mobile.scss',
		 './../src/scss/donate/donate_desktop.scss',
		 './../src/scss/donate/donate_tablet.scss',
		 './../src/scss/donate/donate_mobile.scss',
		 './../src/scss/popup/popups.scss',
		 './../src/scss/search/search_desktop.scss',
		 './../src/scss/search/search_tablet.scss',
		 './../src/scss/search/search_mobile.scss',
		 './../src/scss/upload/upload_desktop.scss',
		 './../src/scss/upload/upload_tablet.scss',
		 './../src/scss/upload/upload_mobile.scss',
		 './../src/scss/share/share_desktop.scss',
		 './../src/scss/share/share_tablet.scss',
		 './../src/scss/share/share_mobile.scss',
		 './../src/scss/mainPage/main_desktop.scss',
		 './../src/scss/mainPage/main_tablet.scss',
		 './../src/scss/mainPage/main_mobile.scss',
		 './../src/scss/improve/improve_desktop.scss',
		 './../src/scss/improve/improve_tablet.scss',
		 './../src/scss/improve/improve_mobile.scss',
		 './../src/scss/reg/reg_desktop.scss',
		 './../src/scss/reg/reg_tablet.scss',
		 './../src/scss/reg/reg_mobile.scss',
		 './../src/scss/openPhoto/openPhoto_desktop.scss',
		 './../src/scss/openPhoto/openPhoto_tablet.scss',
		 './../src/scss/openPhoto/openPhoto_mobile.scss',
		 './../src/scss/settings/settings_desktop.scss',
		 './../src/scss/settings/settings_tablet.scss',
		 './../src/scss/settings/settings_mobile.scss',
		 './../src/scss/settings-edit/settings_desktop.scss',
		 './../src/scss/settings-edit/settings_tablet.scss',
		 './../src/scss/settings-edit/settings_mobile.scss',
		 './../src/scss/media.scss'
	]
};


// ==== tasks:  ==== 
var syncTask = require('./sync'),
    connectTask = require('./connect'),
    scssTask = require('./scss'),
	scssConcatTask = require('./scssConcat'),
	concat = require('./jsConcat'),
    copyTask = require('./copy');
// =======================================

gulp.task('sync', syncTask('../src/*.jade', '../public/html'));

gulp.task('connect', connectTask('../public'));

gulp.task('scss', scssTask(['./../src/scss/*.scss', './../src/scss/**/*.scss', './app/scss/**/**/*.scss'], './../public/css'));
gulp.task('scssConcat', scssConcatTask(config.scss, '../public/assets/css'));

gulp.task('js', copyTask('../src/js/*.js', '../public/js'));
gulp.task('jsConcat', concat(['../public/javascripts/*.js', '../public/javascripts/**/*.js'], '../public/assets/js'));
gulp.task('font', copyTask(['../src/fonts/**/*', '../src/fonts/**/**/*'], '../public/fonts'));
gulp.task('img', copyTask(['../src/svg/*', '../src/svg/**/*'], '../public/img'));

gulp.task('watch', function () {
	gulp.watch(['../src/scss/*.scss', '../src/scss/**/*.scss', './app/scss/**/**/*.scss'], ['scss', 'scssConcat']);
	gulp.watch('../src/*.jade', ['sync']);
	gulp.watch('../src/includes/*.jade', ['sync']);
	gulp.watch('../src/js/*.js', ['js']);
	gulp.watch('../public/javascript/*.js', ['jsConcat']);
	gulp.watch(['../public/javascripts/*.js', '../public/javascripts/**/*.js'], ['js']);
});


gulp.task('default', ['sync', 'scss', 'scssConcat', 'js', 'jsConcat', 'watch']);

gulp.task('build', ['scssConcat', 'jsConcat']);



// ======= M A R K U P 
gulp.task('markupSync', syncTask('../markup/*.jade', '../markup/'));
gulp.task('markupConnect', connectTask('../'));
gulp.task('markupScss',  scssTask(['../markup/scss/*.scss', '../markup/scss/**/*.scss', '../markup/scss/**/**/*.scss'], '../markup./../src/scss'))
gulp.task('markupWatch', function(){
	gulp.watch(['../markup/scss/*.scss'], ['markupScss'], function(){
		browserSync.reload({stream: true});
	});
	gulp.watch(['../markup/scss/**/**/*.scss'], ['markupScss'], function(){
		browserSync.reload({stream: true});
	});
	gulp.watch(['../markup/scss/**/*.scss'], ['markupScss'], function(){
		browserSync.reload({stream: true});
	});
	gulp.watch('../markup/*.jade', ['markupSync'], function(){
		browserSync.reload({stream: true});
	});
	gulp.watch('../markup/includes/*.jade', ['markupSync'], function(){
		browserSync.reload({stream: true});
	});
	gulp.watch('../markup/js/*.js', ['markupSync'], function(){
		browserSync.reload({stream: true});
	});
	gulp.watch("../markup/*.html").on('change', function(){
		browserSync.reload({stream: true});
	});

});
gulp.task('markup', ['markupSync', 'markupConnect', 'markupScss', 'markupWatch']);