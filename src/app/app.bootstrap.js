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