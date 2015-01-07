angular
    .module('cinApp')
    .service('moviesService', function ($q, dataStorage, loaderService, User, Movie, WatchlistMoviesCollection) 
    {
        var moviesService = {};
        
        /**
         * Check a movie and return a promise
         */
        moviesService.check = function (movieObj) 
        {
            var deferred = $q.defer();
            
            loaderService.start();
            
            var movie;

            if(!(movieObj instanceof Movie)) {
                movie = new Movie();
                movie.fromApiObject(movieObj);
            }
            else {
                movie = movieObj;
            }

            dataStorage.ready()
                .then(function () {
                    if(_.contains(User.current().watchedId, movie.imdbId)) {
                        // Uncheck
                        return dataStorage.watchedCollection.removeMovie(movie);
                    }
                    else {
                        // Check
                        return dataStorage.watchedCollection.addMovie(movie);
                    }
                })
                .then(function () {
                    deferred.resolve(movie);
                })
                .catch(function (error) {
                    console.log('Whoops. Unabled to check movie.');
                    console.log(error);
                    deferred.reject(error);
                })
                .finally(function () {
                    loaderService.done();
                });
                
            return deferred.promise;
        }
        
        /**
         * Add to a watchlist and return a promise
         */
        moviesService.addToWatchlist = function (movieObj, watchlist) 
        {
            var deferred = $q.defer();

            loaderService.start();
            
            var movie;
            
            if(!(movieObj instanceof Movie)) {
                movie = new Movie();
                movie.fromApiObject(movieObj);
            }
            else {
                movie = movieObj;
            }
            
            var watchlistMovies = WatchlistMoviesCollection.fromWatchlist(watchlist);
            
            watchlistMovies.fetch()
                .then(function (results) {
                    return watchlistMovies.addMovie(movie);
                })
                .then(function () {
                    deferred.resolve(movie);
                })
                .fail(function (err) {
                    console.log(err);
                    deferred.reject(err);
                })
                .always(loaderService.done);
                
            return deferred.promise;
        }
        
        return moviesService;
    });
