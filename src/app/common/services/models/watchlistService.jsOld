angular
    .module('cinApp')
    .service('watchlistService', function ($q, dataStorage, Movie, Watchlist, WatchlistMoviesCollection) 
    {
        var watchlistService = {};
        
        /**
         * Create a new watchlist with specified name
         * @param {Watchlist} watchlist
         * @return {Promise}
         */
        watchlistService.create = function (watchlist) 
        {   
            if(!(watchlist instanceof Watchlist)) {
                return $q.reject('watchlist should be an instanceof Watchlist');
            }
            
            return dataStorage.ready()
                .then(function () {
                    return dataStorage.watchlistCollection.addWatchlist(watchlist);
                });
        }
        
        watchlistService.remove = function (watchlist) 
        {
            if(!(watchlist instanceof Watchlist)) {
                return $q.reject('watchlist should be an instanceof Watchlist');
            }
            
            return dataStorage.ready()
                .then(function () {
                    return dataStorage.watchlistCollection.removeWatchlist(watchlist);
                });
        }
        
        
        return watchlistService;
    });