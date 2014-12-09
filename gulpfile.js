var gulp = require('gulp');
var bowerFiles = require('main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var serve = require('gulp-serve');
var del = require('del');

var paths = {
    build: './build/',
    
    src: './src/',
    app_js: ['./src/app/**/*.js'],
    sass: ['./src/sass/**/*.scss']
}

gulp.task('build:copy-libs', function (cb) 
{
    gulp.src(bowerFiles(), {base: './bower_components/' })
        .pipe(gulp.dest('./build/libs/'))
        .on('finish', cb);
});

gulp.task('build:angular', function (cb) 
{
    gulp.src(paths.app_js)
        .pipe(angularFilesort())
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build + 'app/'))
        .on('finish', cb);
});

gulp.task('build:sass', function (cb) 
{
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(concat('app.css'))
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(gulp.dest(paths.build + 'app/'))
        .on('finish', cb);
});


gulp.task('build:html', ['build:copy-libs', 'build:angular', 'build:sass'], function () 
{
    gulp.src('./src/index.html')
        .pipe(inject(gulp.src('./build/libs/**/*.{js,css}'), {name: 'bower', ignorePath: '/build/', addRootSlash: false})) // Bower
        .pipe(inject(gulp.src(['./build/app/**/*.{js,css}']), {name: 'app', ignorePath: '/build/', addRootSlash: false})) // AngularJS
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
    gulp.watch(paths.app_js, ['build:angular', 'build:html']);
    gulp.watch(paths.sass, ['build:sass', 'build:html']);
});