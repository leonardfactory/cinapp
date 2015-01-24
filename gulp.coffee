gulp            = require 'gulp'
gutil           = require 'gulp-util'
bowerFiles      = require 'main-bower-files'
angularFilesort = require 'gulp-angular-filesort'
inject          = require 'gulp-inject'
concat          = require 'gulp-concat'
sourcemaps      = require 'gulp-sourcemaps'
#sass           = require('gulp-ruby-sass'
sass            = require 'gulp-sass'
autoprefixer    = require 'gulp-autoprefixer'
serve           = require 'gulp-serve'
del             = require 'del'
templateCache   = require 'gulp-angular-templatecache'
ngAnnotate      = require 'gulp-ng-annotate'
plumber         = require 'gulp-plumber'
watch           = require 'gulp-watch'
gulpif          = require 'gulp-if'
coffee          = require 'gulp-coffee'
rev             = require 'gulp-rev-append'
uglify          = require 'gulp-uglify'
minifyCSS       = require 'gulp-minify-css'
shell           = require 'gulp-shell'


onError = (err) ->
    gutil.beep()
    gutil.log   gutil.colors.cyan('Plumber') + gutil.colors.red(' found unhandled error:\n'),
                err.toString()

paths =
    build:              'build/'
    src:                'src/'
    assets:             ['src/assets/**/*.*']
    app_src:            ['src/app/**/*.{js,coffee}', '!src/app/**/*.spec.{js,coffee}']
    shared_src:         ['src/shared/**/*.{js,coffee}', '!src/shared/**/*.spec.{js,coffee}']
    sass:               ['src/sass/**/*.scss']
    template:           ['src/app/**/*.html']
    shared_template:    ['src/shared/**/*.html']
    index:              'src/index.html'

gulp.task 'build:copy-libs', ->
    gulp.src bowerFiles(), base: './bower_components/'
        .pipe gulp.dest './build/libs/'

gulp.task 'build:assets', ->
    gulp.src paths.assets
        .pipe gulp.dest './build/assets/'

gulp.task 'build:shared', ->
    gulp.src paths.shared_src
        .pipe plumber onError
        .pipe sourcemaps.init()
        .pipe coffee()
        .pipe angularFilesort()
        .pipe concat 'shared.js'
        .pipe ngAnnotate()
        .pipe uglify()
        .pipe sourcemaps.write()
        .pipe gulp.dest paths.build + 'shared/'

gulp.task 'build:shared-partials', ->
    gulp.src paths.shared_template
        .pipe plumber(onError)
        .pipe templateCache standalone: true, module: 'shared-templates'
        .pipe uglify()
        .pipe gulp.dest paths.build + 'shared/'


gulp.task 'build:angular', ->
    gulp.src paths.app_src
        .pipe plumber(onError)
        .pipe sourcemaps.init()
        .pipe coffee bare: true
        .pipe angularFilesort()
        .pipe concat 'app.js'
        .pipe ngAnnotate()
        .pipe uglify()
        .pipe sourcemaps.write()
        .pipe gulp.dest paths.build + 'app/'

gulp.task 'build:sass', ->
    gulp.src paths.sass
        .pipe sourcemaps.init()
        .pipe sass errLogToConsole: true
        .pipe autoprefixer browsers: ['last 2 versions'], cascade: false
        .pipe minifyCSS()
        .pipe sourcemaps.write()
        .pipe gulp.dest paths.build + 'assets/css/'

gulp.task 'build:partials', ->
    gulp.src paths.template
        .pipe plumber onError
        .pipe templateCache standalone: true
        .pipe uglify()
        .pipe gulp.dest paths.build + 'app/'


gulp.task 'build:html', ['build:copy-libs', 'build:shared', 'build:shared-partials', 'build:angular', 'build:sass', 'build:partials', 'build:assets'], -> 
    gulp.src 'src/index.html'
        .pipe plumber onError
        .pipe inject gulp.src('./build/libs/**/*.{js,css}'), {name: 'bower', ignorePath: '/build/', addRootSlash: false} # Bower
        .pipe inject gulp.src('./build/assets/**/*.{js,css}'), {name: 'assets', ignorePath: '/build/', addRootSlash: false} # Assets
        .pipe inject gulp.src('./build/shared/**/*.js'), {name: 'shared', ignorePath: '/build/', addRootSlash: false} # Shared AngularJS components
        .pipe inject gulp.src('./build/app/**/*.js'), {name: 'app', ignorePath: '/build/', addRootSlash: false} # AngularJS and Styles
        .pipe rev() # Add hashes to files requiring it
        .pipe gulp.dest './build'

gulp.task 'build:clean', ->
    del [
        './build/**'
    ], cb

# ==========
# Production
# ==========

gulp.task 'prod:copy-libs', ->
    vendor = [
        './bower_components/angular/angular.min.js'
        './bower_components/angular/angular.min.js.gzip'
        './bower_components/angular/angular.min.js.map'
        './bower_components/angular-animate/angular-animate.min.js'
        './bower_components/angular-animate/angular-animate.min.js.map'
        './bower_components/angular-deferred-bootstrap/angular-deferred-bootstrap.min.js'
        './bower_components/angular-locker/dist/angular-locker.min.js'
        './bower_components/angular-locker/dist/angular-locker.min.js.map'
        './bower_components/angular-route/angular-route.min.js'
        './bower_components/angular-route/angular-route.min.js.map'
        './bower_components/angular-truncate/src/truncate.js'
        './bower_components/angular-ui-router/release/angular-ui-router.min.js'
        './bower_components/animate-css/animate.min.css'
        './bower_components/moment/min/moment.min.js'
        './bower_components/ng-parse/dist/ng-parse.min.js'
        './bower_components/underscore/underscore-min.js'
        './bower_components/underscore/underscore-min.map'
    ]
    
    gulp.src vendor, { base : './bower_components/' }
        .pipe gulp.dest './prod/libs/'


# Copy to production
gulp.task 'prod:copy', [ 'build:html' ], ->
    gulp.src('./build/**')
        .pipe gulp.dest '../cinapp-cloud/public/'

gulp.task('prod:deploy', ['prod:copy'], shell.task([
        'parse deploy'
    ], 
        cwd: '../cinapp-cloud/' 
))

# =======
# General
# =======

gulp.task 'default', ['build:html']

gulp.task 'serve', serve('build')

gulp.task 'watch', ['watch:ng-parse'], -> 
    watch paths.template,           -> gulp.start('build:partials')
    watch paths.shared_template,    -> gulp.start('build:shared-partials')
    watch paths.app_src,            -> gulp.start('build:angular')
    watch paths.shared_src,         -> gulp.start('build:shared')
    watch paths.sass,               -> gulp.start('build:sass')
    watch paths.index,              -> gulp.start('build:html')

# Watches even ng-parse since it may be rebuilt
gulp.task 'watch:ng-parse', ->
    watch 'bower_components/ng-parse/dist/**/*.js', (-> gulp.start('build:copy-libs'))
    null # return null stream