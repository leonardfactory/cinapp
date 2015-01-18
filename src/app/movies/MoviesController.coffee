angular
    .module 'cinApp'
    .controller 'MoviesController', ($scope, loaderService, WatchedCollection) ->
        class MoviesController
            
            constructor: ->
                @movies = WatchedCollection.get()
                @predicate = 'name'
                
                loaderService.start()
                @movies.update().finally loaderService.done
            
        new MoviesController