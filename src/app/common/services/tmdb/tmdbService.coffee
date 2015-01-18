angular
    .module 'cinApp'
    .factory 'tmdbService', ($q) ->
        
        # Create a deferred request
        #
        deferredRequest = (namespace, method) ->
            (query) ->
                defer = $q.defer()
                
                theMovieDb[namespace][method] query,
                    (data) -> defer.resolve JSON.parse data,
                    (error) -> defer.reject error
                
                defer.promise
        
        # Create a deferred request without params
        #
        deferredRequestNoParams = (namespace, method) ->
            () ->
                defer = $q.defer()
                
                theMovieDb[namespace][method](
                    (data) -> defer.resolve JSON.parse data,
                    (error) -> defer.reject error
                )
                
                defer.promise
        
        # tmdbService object
        #
        tmdbService =
            config: {}
            
            api:
                search:
                    getMovie: deferredRequest 'search', 'getMovie'
                    
                movies:
                    getById: deferredRequest 'movies', 'getById'
                    getCredits: deferredRequest 'movies', 'getCredits'
                    getImages: deferredRequest 'movies', 'getImages'
                
                find:
                    getById: deferredRequest 'find', 'getById'
                    
                configurations:
                    getConfiguration: deferredRequestNoParams 'configurations', 'getConfiguration'
                    
            init: =>
                tmdbService.api
                    .configurations.getConfiguration()
                    .then (data) =>
                        tmdbService.config = data
                        tmdbService