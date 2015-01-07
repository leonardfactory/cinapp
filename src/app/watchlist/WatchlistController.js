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
                    templateUrl: 'watchlist/modal-create.html'
                });
                
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
                    console.log('Error ' + error);
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
                .then(loaderService.done)
                .catch(function (error) {
                    loaderService.done();
                    console.log('Error: ');
                    console.log(error);
                });
        }
    });