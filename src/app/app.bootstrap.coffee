angular
    .element document
    .ready ->
        deferredBootstrapper.bootstrap
            element: document.body
            module: 'cinApp'
            injectorModules: 'cinApp'
            resolve:
                tmdbService: (tmdbService) ->
                    tmdbService.init()
