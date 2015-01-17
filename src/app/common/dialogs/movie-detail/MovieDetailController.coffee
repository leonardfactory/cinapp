angular
    .module 'MovieDetailController', ($scope, $modalWindow, loaderService, WatchlistCollection, moviesService, movie) ->
        class MovieDetailController
            constructor: ->
                @movie = movie
                @watchlists = WatchlistCollection.get()
                @watchlists.update()
                
            addToWatchlist: (watchlist) ->
                if @movie?
                    moviesService
                        .addToWatchlist @movie, watchlist
                        .then => $modalWindow.successed()
                        .catch (error) => $modalWindow.shake()
            
        new MovieDetailController