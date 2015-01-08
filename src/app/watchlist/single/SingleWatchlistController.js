angular
    .module('cinApp')
    .controller('SingleWatchlistController', function ($stateParams, $timeout, $scope, loaderService, dataStorage, User, Watchlist, WatchlistMoviesCollection, WatchlistUsersCollection, angularModal) 
    {
        var _this = this;
        
        this.watchlist = null;
        
        this.movies = null;
        
        this.watchlistUsers = null;
        
        // Created
        this.addUserQuery = '';
        
        $timeout(loaderService.start)
            .then(function () {
                // Find current watchlist based on `normalizedName` passed to this UIRouter state.
                // @todo Can be optimized passing directly the watchlist with UIRouter.
                var query = new Parse.Query(Watchlist);
                query.equalTo('normalizedName', $stateParams.normalizedName);
                return query.first();
            })
            .then(function (watchlist) {
                _this.watchlist = watchlist;
                return dataStorage.ready();
            })
            .then(function () {
                return dataStorage.watchlistMoviesCollection(_this.watchlist);
            })
            .then(function (watchlistMovies) {
                _this.movies = watchlistMovies;
                
                _this.watchlistUsers = WatchlistUsersCollection.fromWatchlist(_this.watchlist);
                return _this.watchlistUsers.fetch();
            })
            .catch(function (error) {
                console.log('Whoops. Unable to load Watchlist.');
            })
            .finally(loaderService.done);
            
        // Trigger add user modal dialog.
        this.addUser = function () 
        {
            var modalWindow = angularModal
                .show({
                    templateUrl: 'common/dialogs/add-user/modal-add-user.html',
                    scope: $scope,
                    controller: 'AddUserController',
                    controllerAs: 'addUserCtrl',
                    locals: {
                        watchlist: _this.watchlist,
                        watchlistUsers: _this.watchlistUsers
                    }
                });
                
            modalWindow.result
                .then(function (result) {
                })
                .catch(function (error) {
                    console.log('Cannot add user.');
                });
        }
    });