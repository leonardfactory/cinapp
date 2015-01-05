var gulp = require('gulp');
var gutil = require('gulp-util');
var bowerFiles = require('main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
//var sass = require('gulp-ruby-sass');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var serve = require('gulp-serve');
var del = require('del');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');

var onError = function (err) {
    gutil.beep();
    console.log(err);
}

var paths = {
    build: './build/',
    
    src: './src/',
    assets: ['./src/assets/**/*.*'],
    app_js: ['./src/app/**/*.js', '!./src/app/**/*.spec.js'],
    common_js: ['./src/common/**/*.js', '!./src/common/**/*.spec.js'],
    sass: ['./src/sass/**/*.scss'],
    template: ['./src/app/**/*.html'],
    common_template: ['./src/common/**/*.html'],
    index: './src/index.html'
}

gulp.task('build:copy-libs', function (cb) 
{
    gulp.src(bowerFiles(), {base: './bower_components/' })
        .pipe(gulp.dest('./build/libs/'))
        .on('finish', cb);
});

gulp.task('build:assets', function (cb) 
{
    gulp.src(paths.assets)
        .pipe(gulp.dest('./build/assets/'))
        .on('finish', cb);
});

gulp.task('build:common', function (cb) 
{
    gulp.src(paths.common_js)
        .pipe(plumber(onError))
        .pipe(sourcemaps.init())
        .pipe(concat('common.js'))
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build + 'common/'))
        .on('finish', cb);
});

gulp.task('build:common-partials', function (cb) 
{
    gulp.src(paths.common_template)
        .pipe(plumber(onError))
        .pipe(templateCache({ standalone: true, module: 'common-templates' }))
        .pipe(gulp.dest(paths.build + 'common/'))
        .on('finish', cb);
});


gulp.task('build:angular', function (cb) 
{
    gulp.src(paths.app_js)
        .pipe(plumber(onError))
        .pipe(angularFilesort())
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build + 'app/'))
        .on('finish', cb);
});

gulp.task('build:sass-fast', function (cb) 
{
    gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({ errLogToConsole: true }))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(gulp.dest(paths.build + 'assets/css/'))
        .on('finish', cb);
});


gulp.task('build:partials', function (cb) 
{
    gulp.src(paths.template)
        .pipe(plumber(onError))
        .pipe(templateCache({ standalone: true }))
        .pipe(gulp.dest(paths.build + 'app/'))
        .on('finish', cb);
});


gulp.task('build:html', ['build:copy-libs', 'build:common', 'build:common-partials', 'build:angular', 'build:sass-fast', 'build:partials', 'build:assets'], function () 
{
    gulp.src('./src/index.html')
        .pipe(plumber(onError))
        .pipe(inject(gulp.src('./build/libs/**/*.{js,css}'), {name: 'bower', ignorePath: '/build/', addRootSlash: false})) // Bower
        .pipe(inject(gulp.src('./build/assets/**/*.{js,css}'), {name: 'assets', ignorePath: '/build/', addRootSlash: false})) // Assets
        .pipe(inject(gulp.src('./build/common/**/*.js'), {name: 'common', ignorePath: '/build/', addRootSlash: false})) // Common AngularJS components
        .pipe(inject(gulp.src('./build/app/**/*.js'), {name: 'app', ignorePath: '/build/', addRootSlash: false})) // AngularJS and Styles
        .pipe(gulp.dest('./build'));
});

gulp.task('build:clean', function (cb) 
{
    del([
        './build/**'
    ], cb);
});

gulp.task('default', ['build:html']);

gulp.task('serve', serve('build'));

gulp.task('watch', function () 
{
    watch(paths.template,           function () { gulp.start('build:partials'); });
    watch(paths.common_template,    function () { gulp.start('build:common-partials'); });
    watch(paths.app_js,             function () { gulp.start('build:angular'); });
    watch(paths.common_js,          function () { gulp.start('build:common'); });
    watch(paths.sass,               function () { gulp.start('build:sass-fast'); });
    watch(paths.index,              function () { gulp.start('build:html'); });
});