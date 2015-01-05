angular
    .module('cinApp')
    .controller('SingleWatchlistController', function ($stateParams, $timeout, loaderService, User, Watchlist, WatchlistMoviesCollection, WatchlistUsersCollection, angularModal) 
    {
        var _this = this;
        
        this.watchlist = null;
        
        this.movies = null;
        
        this.watchlistUsers = null;
        
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
                
                _this.movies = WatchlistMoviesCollection.fromWatchlist(watchlist);
                return _this.movies.fetch();
            })
            .then(function (movies) {
                _this.watchlistUsers = WatchlistUsersCollection.fromWatchlist(_this.watchlist);
                return _this.watchlistUsers.fetch();
            })
            .then(loaderService.done)
            .catch(function (error) {
                console.log('Whoops. Unable to load Watchlist.');
                loaderService.done();
            });
            
        // Trigger add user modal dialog.
        this.addUser = function () 
        {
            angularModal
                .show({
                    templateUrl: 'watchlist/modal-add-user.html'
                })
                .then(function (result) {
                    if(result.result) {
                        console.log('Searching for: ' + result.params);
                        loaderService.start();
                        
                        var userData = result.params;

                        var queryUsername = new Parse.Query(User);
                        queryUsername.equalTo("username", userData);

                        var queryMail = new Parse.Query(User);
                        queryMail.equalTo("email", userData);

                        var query = Parse.Query.or(queryUsername, queryMail); // Find email or username matching
                        return query.first();
                    }
                })
                .then(function (user) {
                    if(user) { // Found
                        console.log('Found user: ' + user.username);
                        return _this.watchlistUsers.addUser(user);
                    }
                })
                .then(loaderService.done)
                .catch(function (error) {
                    console.log('Cannot add user.');
                    loaderService.done();
                });
        }
    });