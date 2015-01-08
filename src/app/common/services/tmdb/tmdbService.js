angular
    .module('cinApp')
    .factory('tmdbService', function ($q) 
    {
        var tmdbService = {
            config: {},
            
            api: {
                search: {},
                movies: {},
                find: {},
                configurations: {}
            }
        };
        
        // Deferred transformer
        function deferredRequest(namespace, method) {
            return function (query) {
                var defer = $q.defer();
                
                theMovieDb[namespace][method](query, function (data) {
                    defer.resolve(JSON.parse(data));
                    return defer.promise;
                }, function (error) {
                    defer.reject(error);
                    return defer.promise;
                });
                
                return defer.promise;
            }
        }
        
        function deferredRequestNoParams(namespace, method) {
            return function () {
                var defer = $q.defer();
                
                theMovieDb[namespace][method](function (data) {
                    defer.resolve(JSON.parse(data));
                }, function (error) {
                    defer.reject(error);
                });
                
                return defer.promise;
            }
        }
        
        // Configuration
        tmdbService.api.configurations = {
            getConfiguration: deferredRequestNoParams('configurations', 'getConfiguration')
        };
        
        // Find
        tmdbService.api.find = {
            getById:    deferredRequest('find', 'getById')
        };
        
        // Movies
        tmdbService.api.movies = {
            getById:    deferredRequest('movies', 'getById'),
            getCredits: deferredRequest('movies', 'getCredits'),
            getImages:  deferredRequest('movies', 'getImages')
        };
        
        // Search
        tmdbService.api.search = {
            getMovie: deferredRequest('search', 'getMovie')
        };
        
        // Init
        tmdbService.init = function () {
            return tmdbService.api
                .configurations.getConfiguration()
                .then(function (data) 
                {
                    tmdbService.config = data;
                    return tmdbService;
                });
        };
        
        return tmdbService;
    });