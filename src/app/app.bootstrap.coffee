angular
    .element document
    .ready ->
        deferredBootstrapper.bootstrap
            element: document.body
            module: 'cinApp'
            injectorModules: 'cinApp'
            resolve:
                ### @ngInject ###
                tmdbService: (tmdbService) ->
                    tmdbService.init()
