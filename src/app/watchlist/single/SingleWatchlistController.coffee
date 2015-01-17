angular
    .module 'cinApp'
    .controller 'SingleWatchlistController', ($stateParams, $timeout, $scope, loaderService, dataStorage, NgParse, User, Watchlist, WatchlistMoviesCollection) ->
        class SingleWatchlistController
            
            constructor: ->
                @watchlist = null
                @movies = null
                
                $timeout loaderService.start
                    .then =>
                        query = new NgParse.Query class: Watchlist
                        query.where.attr('normalizedName').equal $stateParams.normalizedName
                        query.first()
                        
                    .then (watchlist) =>
                        console.log watchlist
                        @watchlist = watchlist
                        
                        # Load movies for this watchlist
                        @movies = WatchlistMoviesCollection.get watchlist: @watchlist
                        @movies.update()
                        console.log @movies
                        
                    .finally loaderService.done
                
            
        new SingleWatchlistController