angular
    .module 'cinApp'
    .factory 'watchlistService', ($q, loaderService, WatchlistCollection, NgParse, User, Watchlist, Movie) ->
        
        watchlistService =
            
            create: (watchlist) ->
                unless watchlist instanceof Watchlist
                    $q.reject "watchlist should be an instance of Watchlist"
                else
                    collection = WatchlistCollection.get()
                    collection.update().then => collection.addWatchlist watchlist
                    
            remove: (watchlist) ->
                unless watchlist instanceof Watchlist
                    $q.reject "watchlist should be an instance of Watchlist"
                else
                    collection = WatchlistCollection.get()
                    collection.update().then => collection.removeWatchlist watchlist
                            