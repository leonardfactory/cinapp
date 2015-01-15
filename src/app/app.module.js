/**
 * Cinapp entry point.
 * Here we define the ngApp while initializing some useful stuff.
 */
var models = angular.module('cinApp.models', ['parse-extend']);
var app = angular.module('cinApp', ['cinApp.models', 'lfExtensions', 'angular-modal',
                                    'ngAnimate', 'ngParse', 'lfEffects', 'ui.router', 'templates', 'truncate']);
var templates = angular.module('templates', []);

app.run(function (parseService, tmdbService) 
{
    parseService.init();
});
