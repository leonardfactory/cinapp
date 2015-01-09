angular
    .module('cinApp')
    .controller('WatchlistController', function ($timeout, loaderService, dataStorage, Watchlist, angularModal)
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
            var modalWindow = angularModal
                .show({
                    templateUrl: 'common/dialogs/create-watchlist/modal-create.html'
                });
            
            // Todo move to service
            modalWindow.result
                .then(function (result) {
                    if(result.result) {
                        var name = result.params;
                        
                        loaderService.start();
                        
                        var watchlist   = new Watchlist();
                        watchlist.name  = name;
                        
                        return _this.watchlists.addWatchlist(watchlist); 
                    }
                })
                .catch(function (error) {
                    console.log('Error ');
                    console.log(error);
                })
                .finally(loaderService.done);
        }
        
        /**
         * Remove a watchlist
         */
        this.removeWatchlist = function (watchlist) 
        {
            $timeout(loaderService.start)
                .then(function () {
                    return _this.watchlists.removeWatchlist(watchlist);
                })
                .catch(function (error) {
                    console.log('Error: ');
                    console.log(error);
                })
                .finally(loaderService.done);
        }
    });