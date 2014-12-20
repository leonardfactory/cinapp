/**
 * Cinapp entry point.
 * Here we define the ngApp while initializing some useful stuff.
 */
var models = angular.module('cinApp.models', ['parse-angular', 'parse-angular.enhance']);
var app = angular.module('cinApp', ['cinApp.models', 'parse-angular', 'parse-angular.enhance', 'ngAnimate', 'ui.router', 'templates']);
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
