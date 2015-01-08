/**
 * Cinapp entry point.
 * Here we define the ngApp while initializing some useful stuff.
 */
var models = angular.module('cinApp.models', ['parse-extend']);
var app = angular.module('cinApp', ['cinApp.models', 'parse-extend', 'angular-modal',
                                    'ngAnimate', 'ui.router', 'templates', 'truncate']);
var templates = angular.module('templates', []);

angular.element(document).ready(function() {
    deferredBootstrapper.bootstrap({
        element: document.body,
        module: 'cinApp',
        injectorModules: 'cinApp',
        resolve: {
            tmdbService: function (tmdbService) {
                return tmdbService.init();
            }
        }
    });
});

app.run(function (parseService, tmdbService) 
{
    parseService.init();
});
