angular
    .module('cinApp')
    .controller('WatchlistController', function ($timeout, loaderService, WatchlistCollection, angularModal)
    {
        this.watchlists = new WatchlistCollection();
        
        var _this = this;
        
        // Watchlist to be created
        this.created = {};
        
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
                .then(function (shouldAdd) {
                    console.log('Created name is ' + _this.created.name);
                    console.log('ShouldAdd is ' + shouldAdd);
                })
                .catch(function (error) {
                    console.log('Error ' + error);
                });
        }
    });