angular
    .module('cinApp.models')
    .factory('DeferredCollections', function ($q) 
    {
        /**
         * Describe a Parse.com set of collection which needs to be accessible in the `dataStorage`.
         * Since we need to provide caching features, we specify with this class how
         * the collections should be cached and how `dataStorage` should handle them.
         * @class
         */
        function DeferredCollections(collectionName, initializer)
        {
            this.collectionName = collectionName;
            this.initializer = initializer;
            
            this._maps      = {};
            this._promises  = {};
        }
        
        DeferredCollections.prototype.getCollection = function (id, options) 
        {
            var _this = this;
            
            if(this._maps[id]) {
                return $q.when(this._maps[id]);
            }
            else {
                // Return old promise if we started to fetch the collection
                if(this._promises[id]) {
                    return this._promises[id];
                }
                // Start fetching and register the promise fetch
                else {
                    var deferred = $q.defer();
                    this._promises[id] = deferred.promise;
                    
                    var collection = this.initializer(options);
                    collection.$fetch()
                        .then(function (results) {
                            _this._maps[id] = collection;
                            deferred.resolve(collection);
                        })
                        .catch(function (error) {
                            deferred.reject(error);
                        })
                        .finally(function () {
                            _this._promises[id] = null;
                        });
                    
                    return deferred.promise;
                }
            }
        }
        
        return DeferredCollections;
    });
    
angular
    .module('cinApp.models')
    .factory('dataStorage', function ($q, $timeout, $rootScope, DeferredCollections, WatchedCollection, WatchlistCollection, WatchlistMoviesCollection, WatchlistUsersCollection, Watchlist, User) 
    {
        var dataStorage = {
            _ready      : false,
            _promises   : []
        };
        
        /**
         * Init dataStorage with new user
         */
        dataStorage.init = function () 
        {   
            dataStorage.watchedCollection = new WatchedCollection();
            dataStorage.watchlistCollection = new WatchlistCollection();
            
            var promises = $q.all([
                dataStorage.watchlistCollection.fetch(),
                dataStorage.watchedCollection.fetch()
            ]);
            
            /**
             * Execute ready callbacks when all resources have been loaded
             */
            promises
                .then(function () {
                    dataStorage._ready = true;
                    
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
        dataStorage.watchlistMovies = new DeferredCollections('WatchlistMoviesCollection', function (options) {
            return new WatchlistMoviesCollection([], options);
        });
        
        /**
         * Get Watchlist Users collection
         */
        dataStorage.watchlistUsers = new DeferredCollections('WatchlistUsersCollection', function (options) {
            return new WatchlistUsersCollection([], options);
        });
        
        // Init if User is logged
        if(User.current() !== null) {
            dataStorage.init();
        }
        
        // Update on user logout
        $rootScope.$watch(function () {
            return User.current();
        },
        function (newUser, oldUser) {
            if(newUser !== null && (!oldUser || newUser.id !== oldUser.id)) {
                dataStorage._ready = false;
                dataStorage.init();
            }
        });
        
        return dataStorage;
        // @todo refresh data on logOut
    });