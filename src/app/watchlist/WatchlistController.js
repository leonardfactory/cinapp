angular
    .module('cinApp')
    .controller('WatchlistController', function ($timeout, loaderService, WatchlistCollection, watchlistService, angularModal)
    {
        this.watchlists = WatchlistCollection.get();
        
        var _this = this;
        
        // Deferred loading
        loaderService.start();
        
        this.watchlists.update().finally(loaderService.done);
        /**
         * Creates a new Watchlist.
         */
        this.createWatchlist = function () 
        {
            angularModal
                .show({
                    templateUrl: 'common/dialogs/create-watchlist/modal-create-watchlist.html',
                    controller: 'CreateWatchlistController',
                    controllerAs: 'createCtrl'
                });
        }
        
        /**
         * Remove a watchlist
         */
        this.removeWatchlist = function (watchlist) 
        {
            $timeout(loaderService.start)
                .then(function () {
                    return watchlistService.remove(watchlist);
                })
                .catch(function (error) {
                    console.log('Error: ');
                    console.log(error);
                })
                .finally(loaderService.done);
        }
    });