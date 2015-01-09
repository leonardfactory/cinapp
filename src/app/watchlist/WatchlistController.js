angular
    .module('cinApp')
    .controller('WatchlistController', function ($timeout, loaderService, dataStorage, watchlistService, angularModal)
    {
        this.watchlists = null;
        
        var _this = this;
        
        // Deferred loading
        loaderService.start();
        dataStorage.ready()
            .then(function () {
                _this.watchlists = dataStorage.watchlistCollection;
            })
            .finally(loaderService.done);
            
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