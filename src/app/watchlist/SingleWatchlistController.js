angular
    .module('cinApp')
    .factory('SingleWatchlistController', function ($stateParams, $timeout, loaderService, Watchlist, WatchlistMoviesCollection) 
    {
        var _this = this;
        
        this.watchlist = null;
        
        $timeout(loaderService.start)
            .then(function () {
                // Find current watchlist based on `normalizedName` passed to this UIRouter state.
                var query = new Parse.Query(Watchlist);
                query.equalTo('normalizedName', $stateParams.normalizedName);
                return query.first();
            })
            .then(function (watchlist) {
                _this.watchlist = watchlist;
                console.log('Found watchlist');
            })
            .then(loaderService.done)
            .catch(function (error) {
                console.log('Whoops. Unable to load Watchlist.');
                loaderService.done();
            });
    });