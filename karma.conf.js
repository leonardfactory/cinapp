// Karma configuration
// Generated on Tue Dec 09 2014 21:38:00 GMT+0100 (CET)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'angular-filesort'],


        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-deferred-bootstrap/angular-deferred-bootstrap.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/moment/moment.js',
            'bower_components/underscore/underscore.js',
            'bower_components/parse-js-sdk/lib/parse.js',
            'src/shared/**/*.{js,coffee}',
            'src/app/**/*.{js,coffee}'
        ],
        
        angularFilesort: {
            whitelist: [
                'src/shared/**/*.{js,coffee}',
                'src/app/**/*.{js,coffee}'
            ]
        },


        // list of files to exclude
        exclude: [
            'src/app/app.bootstrap.js'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/*.coffee': ['coffee']
        },
    
        coffeePreprocessor: {
            // options passed to the coffee compiler
            options: {
                bare: true,
                sourceMap: true
            },
            // transforming the filenames
            transformPath: function(path) {
                return path.replace(/\.coffee$/, '.js');
            }
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
