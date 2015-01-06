angular
    .module('cinApp.models')
    .factory('dataStorage', function (WatchedCollection, WatchlistCollection, User, $q, $timeout) 
    {
        var dataStorage = {
            _ready      : false,
            _promises   : [],
        };
        
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
        
        // DataStorage ready
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
        
        return dataStorage;
        // @todo refresh data on logOut
    });