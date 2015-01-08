angular
    .module('cinApp.models')
    .factory('dataStorage', function (WatchedCollection, WatchlistCollection, WatchlistMoviesCollection, User, $q, $timeout, $rootScope) 
    {
        var dataStorage = {
            _ready      : false,
            _promises   : [],
            
            // Watchlists
            _watchlistMovies : {}
        };
        
        /**
         * Init dataSotrage with new user
         */
        dataStorage.init = function () 
        {
            dataStorage.watchedCollection = new WatchedCollection();
            dataStorage.watchlistCollection = new WatchlistCollection();
            
            dataStorage
                .watchlistCollection.fetch()
                .then(function () {
                    return dataStorage.watchedCollection.fetch();
                })
                /**
                 * Execute ready callbacks when all resources have been loaded
                 */
                .then(function () {
                    dataStorage._ready = true;
                
                    angular.forEach(dataStorage._promises, function (deferred) {
                        deferred.resolve(dataStorage);
                    });
                
                    dataStorage._promises = [];
                })
                .fail(function (error) {
                    console.log('Error in dataStorage loading');
                    console.log(error);
                
                    angular.forEach(dataStorage._promises, function (deferred) {
                        deferred.reject(error);
                    });
                })
                .done();
        }
        
        /**
         * Async promise used to compute something only when 
         * data has been loaded from parse.
         */
        dataStorage.ready = function () {

            if(dataStorage._ready) { 
                return $q.when(dataStorage);
            }
            else {
                var deferred = $q.defer();
                dataStorage._promises.push(deferred);
                return deferred.promise;
            }
        }
        
        /**
         * Get Watchlist Movies collection
         */
        dataStorage.watchlistMoviesCollection = function (watchlist) 
        {
            if(dataStorage._watchlistMovies[watchlist.id]) {
                return $q.when(dataStorage._watchlistMovies[watchlist.id]);
            }
            else {
                var deferred = $q.defer();
                
                var collection = WatchlistMoviesCollection.fromWatchlist(watchlist);
                collection.fetch()
                    .then(function () {
                        // Cache
                        dataStorage._watchlistMovies[watchlist.id] = collection;
                        deferred.resolve(collection);
                    });
                
                return deferred.promise;
            }
        }
        
        // Init if User is logged
        if(User.current() !== null) {
            dataStorage.init();
        }
        
        // Update on user logout
        $rootScope.$watch(function () {
            return User.current();
        },
        function (newUser) {
            if(newUser !== null) {
                dataStorage._ready = false;
                dataStorage.init();
            }
        });
        
        return dataStorage;
        // @todo refresh data on logOut
    });