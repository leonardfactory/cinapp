var gulp            = require('gulp');
var gutil           = require('gulp-util');
var bowerFiles      = require('main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var inject          = require('gulp-inject');
var concat          = require('gulp-concat');
var sourcemaps      = require('gulp-sourcemaps');
//var sass          = require('gulp-ruby-sass');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var serve           = require('gulp-serve');
var del             = require('del');
var templateCache   = require('gulp-angular-templatecache');
var ngAnnotate      = require('gulp-ng-annotate');
var plumber         = require('gulp-plumber');
var watch           = require('gulp-watch');
var gulpif          = require('gulp-if');
var coffee          = require('gulp-coffee');
var rev             = require('gulp-rev-append');
var uglify          = require('gulp-uglify');
var minifyCSS       = require('gulp-minify-css');


var onError = function (err) {
    gutil.beep();
    console.log(err);
}

var paths = {
    build: 'build/',
    src: 'src/',
    assets: ['./src/assets/**/*.*'],
    app_js: ['src/app/**/*.{js,coffee}', '!src/app/**/*.spec.{js,coffee}'],
    shared_js: ['src/shared/**/*.{js,coffee}', '!src/shared/**/*.spec.{js,coffee}'],
    sass: ['src/sass/**/*.scss'],
    template: ['src/app/**/*.html'],
    shared_template: ['src/shared/**/*.html'],
    index: 'src/index.html'
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

gulp.task('build:shared', function (cb) 
{
    gulp.src(paths.shared_js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(gulpif(/[.]coffee$/, coffee()))
        .pipe(angularFilesort())
        .pipe(concat('shared.js'))
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build + 'shared/'))
        .on('finish', cb);
});

gulp.task('build:shared-partials', function (cb) 
{
    gulp.src(paths.shared_template)
        .pipe(plumber(onError))
        .pipe(templateCache({ standalone: true, module: 'shared-templates' }))
        .pipe(gulp.dest(paths.build + 'shared/'))
        .on('finish', cb);
});


gulp.task('build:angular', function (cb) 
{
    gulp.src(paths.app_js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(coffee({ bare: true }))
        .pipe(angularFilesort())
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


gulp.task('build:html', ['build:copy-libs', 'build:shared', 'build:shared-partials', 'build:angular', 'build:sass-fast', 'build:partials', 'build:assets'], function () 
{
    gulp.src('./src/index.html')
        .pipe(plumber(onError))
        .pipe(inject(gulp.src('./build/libs/**/*.{js,css}'), {name: 'bower', ignorePath: '/build/', addRootSlash: false})) // Bower
        .pipe(inject(gulp.src('./build/assets/**/*.{js,css}'), {name: 'assets', ignorePath: '/build/', addRootSlash: false})) // Assets
        .pipe(inject(gulp.src('./build/shared/**/*.js'), {name: 'shared', ignorePath: '/build/', addRootSlash: false})) // Shared AngularJS components
        .pipe(inject(gulp.src('./build/app/**/*.js'), {name: 'app', ignorePath: '/build/', addRootSlash: false})) // AngularJS and Styles
        .pipe(rev()) // Add hashes to files requiring it
        .pipe(gulp.dest('./build'));
});

gulp.task('build:clean', function (cb) 
{
    del([
        './build/**'
    ], cb);
});

// ==========
// Production
// ==========

gulp.task('prod:copy-libs', function (cb) 
{
    var vendor = [
        './bower_components/angular/angular.min.js',
        './bower_components/angular/angular.min.js.gzip',
        './bower_components/angular/angular.min.js.map',
        './bower_components/angular-animate/angular-animate.min.js',
        './bower_components/angular-animate/angular-animate.min.js.map',
        './bower_components/angular-deferred-bootstrap/angular-deferred-bootstrap.min.js',
        './bower_components/angular-locker/dist/angular-locker.min.js',
        './bower_components/angular-locker/dist/angular-locker.min.js.map',
        './bower_components/angular-route/angular-route.min.js',
        './bower_components/angular-route/angular-route.min.js.map',
        './bower_components/angular-truncate/src/truncate.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js',
        './bower_components/animate-css/animate.min.css',
        './bower_components/moment/min/moment.min.js',
        './bower_components/ng-parse/dist/ng-parse.min.js',
        './bower_components/underscore/underscore-min.js',
        './bower_components/underscore/underscore-min.map',
    ]
    
    gulp.src(vendor, {base: './bower_components/' })
        .pipe(gulp.dest('./prod/libs/'))
        .on('finish', cb);
});

gulp.task('prod:assets', function (cb) 
{
    gulp.src(paths.assets)
        .pipe(gulp.dest('./prod/assets/'))
        .on('finish', cb);
});

gulp.task('prod:shared', function (cb) 
{
    gulp.src(paths.shared_js)
        .pipe(plumber())
        .pipe(gulpif(/[.]coffee$/, coffee()))
        .pipe(angularFilesort())
        .pipe(concat('shared.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./prod/shared/'))
        .on('finish', cb);
});

gulp.task('prod:shared-partials', function (cb) 
{
    gulp.src(paths.shared_template)
        .pipe(plumber())
        .pipe(templateCache({ standalone: true, module: 'shared-templates' }))
        .pipe(uglify())
        .pipe(gulp.dest('./prod/shared/'))
        .on('finish', cb);
});


gulp.task('prod:angular', function (cb) 
{
    gulp.src(paths.app_js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(coffee({ bare: true }))
        .pipe(angularFilesort())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./prod/app/'))
        .on('finish', cb);
});

gulp.task('prod:sass', function (cb) 
{
    gulp.src(paths.sass)
        .pipe(sass({ errLogToConsole: true }))
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./prod/assets/css/'))
        .on('finish', cb);
});


gulp.task('prod:partials', function (cb) 
{
    gulp.src(paths.template)
        .pipe(plumber())
        .pipe(templateCache({ standalone: true }))
        .pipe(uglify())
        .pipe(gulp.dest('./prod/app/'))
        .on('finish', cb);
});


gulp.task('prod:html', ['prod:copy-libs', 'prod:shared', 'prod:shared-partials', 'prod:angular', 'prod:sass', 'prod:partials', 'prod:assets'], function () 
{
    gulp.src('./src/index.html')
        .pipe(plumber(onError))
        .pipe(inject(gulp.src('./prod/libs/**/*.{js,css}'), {name: 'bower', ignorePath: '/prod/', addRootSlash: false})) // Bower
        .pipe(inject(gulp.src('./prod/assets/**/*.{js,css}'), {name: 'assets', ignorePath: '/prod/', addRootSlash: false})) // Assets
        .pipe(inject(gulp.src('./prod/shared/**/*.js'), {name: 'shared', ignorePath: '/prod/', addRootSlash: false})) // Shared AngularJS components
        .pipe(inject(gulp.src('./prod/app/**/*.js'), {name: 'app', ignorePath: '/prod/', addRootSlash: false})) // AngularJS and Styles
        .pipe(rev()) // Add hashes to files requiring it
        .pipe(gulp.dest('./prod'));
});

gulp.task('serve-prod', serve('prod'));

gulp.task('prod:clean', function (cb) 
{
    del([
        './prod/**'
    ], cb);
});

gulp.task('prod', [ 'prod:html', 'serve-prod' ]);

gulp.task('prod:copy', [ 'prod:html'], function()
{
    gulp.src('./prod/**')
        .pipe(gulp.dest('../cinapp-cloud/public/'));
});

// =======
// General
// =======

gulp.task('default', ['build:html']);

gulp.task('serve', serve('build'));

gulp.task('watch', ['watch:ng-parse'], function () 
{
    watch(paths.template,           function () { gulp.start('build:partials'); });
    watch(paths.shared_template,    function () { gulp.start('build:shared-partials'); });
    watch(paths.app_js,             function () { gulp.start('build:angular'); });
    //gulp.watch(paths.app_js, ['build:angular']);
    watch(paths.shared_js,          function () { gulp.start('build:shared'); });
    watch(paths.sass,               function () { gulp.start('build:sass-fast'); });
    watch(paths.index,              function () { gulp.start('build:html'); });
});

// Watches even ng-parse since it may be rebuilt
gulp.task('watch:ng-parse', function () 
{
    watch('bower_components/ng-parse/dist/**/*.js', function () { gulp.start('build:copy-libs'); })
});