/**
 * Cinapp entry point.
 * Here we define the ngApp while initializing some useful stuff.
 */
var app = angular.module('cinApp', ['ui.bootstrap', 'parse-angular', 'ngRoute', 'templates']);
var templates = angular.module('templates', []);

app.run(function (parseService) 
{
    parseService.init();
});
