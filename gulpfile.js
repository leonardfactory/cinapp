var gulp = require('gulp');
var bowerFiles = require('main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var serve = require('gulp-serve');
var del = require('del');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
    build: './build/',
    
    src: './src/',
    assets: ['./src/assets/**/*.*'],
    app_js: ['./src/app/**/*.js', '!./src/app/**/*.spec.js'],
    sass: './src/sass/',
    template: ['./src/app/**/*.html'],
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

gulp.task('build:angular', function (cb) 
{
    gulp.src(paths.app_js)
        .pipe(angularFilesort())
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build + 'app/'))
        .on('finish', cb);
});

gulp.task('build:sass', function () 
{
    return sass(paths.sass, {
            sourcemap: false,
            style: 'compact',
            loadPath: [
                paths.sass,
                './bower_components/bootstrap-sass-official/assets/stylesheets'
            ]
        })
        .on('error', function (err) {
            console.error('Error', err.message);
        })
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(gulp.dest(paths.build + 'assets/css/'));
});

gulp.task('build:partials', function (cb) 
{
    gulp.src(paths.template)
        .pipe(templateCache({ standalone: true }))
        .pipe(gulp.dest(paths.build + 'app/'))
        .on('finish', cb);
});


gulp.task('build:html', ['build:copy-libs', 'build:angular', 'build:sass', 'build:partials', 'build:assets'], function () 
{
    gulp.src('./src/index.html')
        .pipe(inject(gulp.src('./build/libs/**/*.{js,css}'), {name: 'bower', ignorePath: '/build/', addRootSlash: false})) // Bower
        .pipe(inject(gulp.src(['./build/app/**/*.js', './build/assets/**/*.{js,css}']), {name: 'app', ignorePath: '/build/', addRootSlash: false})) // AngularJS and Styles
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
    gulp.watch(paths.template, ['build:partials']);
    gulp.watch(paths.app_js, ['build:angular']);
    gulp.watch('./src/sass/**/*.scss', ['build:sass']);
    gulp.watch(paths.index, ['build:html']);
});