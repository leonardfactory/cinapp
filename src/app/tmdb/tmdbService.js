angular
    .module('cinApp')
    .factory('tmdbService', function ($q) 
    {
        var tmdbService = {
            api: {
                search: {},
                movies: {}
            }
        };
        
        // Deferred transformer
        function deferredRequest(namespace, method) {
            return function (query) {
                var defer = $q.defer();
                
                theMovieDb[namespace][method](query, function (data) {
                    defer.resolve(data);
                }, function (error) {
                    defer.reject(error);
                });
                
                return defer.promise;
            }
        }
        
        // Movies
        tmdbService.api.movies = {
            getById:    deferredRequest('movies', 'getById'),
            getImages:  deferredRequest('movies', 'getImages')
        }
        
        // Search
        tmdbService.api.search = {
            getMovie: deferredRequest('search', 'getMovie')
        };
        
        return tmdbService;
    });