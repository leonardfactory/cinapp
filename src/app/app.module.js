/**
 * Cinapp entry point.
 * Here we define the ngApp while initializing some useful stuff.
 */
var models = angular.module('cinApp.models', ['parse-angular', 'parse-angular.enhance']);
var app = angular.module('cinApp', ['ui.bootstrap', 'cinApp.models', 'parse-angular', 'parse-angular.enhance', 'ngAnimate', 'ngRoute', 'templates']);
var templates = angular.module('templates', []);

app.run(function (parseService) 
{
    parseService.init();
});
