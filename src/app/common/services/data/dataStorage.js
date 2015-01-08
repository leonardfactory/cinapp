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
            
            var promises = $q.all([
                dataStorage.watchlistCollection.$fetch(),
                dataStorage.watchedCollection.$fetch()
            ]);
            
            /**
             * Execute ready callbacks when all resources have been loaded
             */
            promises
                .then(function () {
                    dataStorage._ready = true;
                    
                    console.log('dataStorage: ready for user ' + User.current().id);
                    
                    angular.forEach(dataStorage._promises, function (deferred) {
                        deferred.resolve(dataStorage);
                    });
                
                    dataStorage._promises = [];
                })
                .catch(function (error) {
                    console.log('Error in dataStorage loading');
                    console.log(error);
                
                    angular.forEach(dataStorage._promises, function (deferred) {
                        deferred.reject(error);
                    });
                    
                    dataStorage._promises = [];
                });
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
                
                var collection = new WatchlistMoviesCollection([], { watchlist: watchlist });
                collection.$fetch()
                    .then(function () {
                        // Cache
                        dataStorage._watchlistMovies[watchlist.id] = collection;
                        deferred.resolve(collection);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
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