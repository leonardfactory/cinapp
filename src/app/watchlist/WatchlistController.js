angular
    .module('cinApp')
    .controller('WatchlistController', function ($timeout, loaderService, Watchlist, WatchlistCollection, angularModal)
    {
        this.watchlists = new WatchlistCollection();
        
        var _this = this;
        
        // Deferred loading
        $timeout(loaderService.start)
            .then(function () {
                return _this.watchlists.fetch();
            })
            .then(loaderService.done);
            
        /**
         * Creates a new Watchlist.
         */
        this.createWatchlist = function () 
        {
            angularModal
                .show({
                    templateUrl: 'watchlist/modal-create.html',
                    closeDelay: 100 /* ms */
                })
                .then(function (result) {
                    if(result.result) {
                        var name = result.params;
                        
                        loaderService.start();
                        
                        var watchlist   = new Watchlist();
                        watchlist.name  = name;
                        
                        return _this.watchlists.addWatchlist(watchlist); 
                    }
                })
                .then(loaderService.done)
                .catch(function (error) {
                    console.log('Error ' + error);
                });
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