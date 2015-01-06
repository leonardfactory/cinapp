angular
    .module('cinApp.models')
    .factory('dataStorage', function (WatchedCollection, WatchlistCollection, User, $timeout) 
    {
        var dataStorage = {
            _ready : false,
            _callbacks : [],
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
                angular.forEach(dataStorage._callbacks, function (cb) {
                    cb();
                });
                dataStorage._callbacks = [];
            })
            .fail(function (error) {
                console.log('Error in dataStorage loading');
                console.log(error);
            });
        
        // DataStorage ready
        dataStorage.ready = function (cb) {
            if(dataStorage._ready) { 
                cb(); 
            }
            else {
                dataStorage._callbacks.push(cb);
            }
        }
        
        return dataStorage;
        // @todo refresh data on logOut
    });