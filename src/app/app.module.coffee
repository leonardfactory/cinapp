###
Cinapp entry point.
Here we define the ngApp while initializing some useful stuff.
###

models  = angular.module 'cinApp.models', ['ngParse']
app     = angular.module 'cinApp', ['cinApp.models', 'angular-modal', 
                                    'ngAnimate', 'lfEffects', 'lfSlider', 'ui.router', 'templates', 'truncate']
                                    
templates = angular.module( 'templates', [] )

app.run (NgParse, User, tmdbService) ->
    NgParse.initialize 'iWpIHpzgt0smKYu82KpebMVwoWtNIHNPb1NpAKU9', 'pndsi4DCFDZBzB0YQK4m2D8wwLr779mdhkggC30m'