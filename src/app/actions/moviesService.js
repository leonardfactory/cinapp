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
            
            var movie, watchlistMovies;
            
            if(!(movieObj instanceof Movie)) {
                movie = new Movie();
                movie.fromApiObject(movieObj);
            }
            else {
                movie = movieObj;
            }
            
            dataStorage.ready()
                .then(function () {
                    return dataStorage.watchlistMoviesCollection(watchlist);
                })
                .then(function (_watchlistMovies) {
                    watchlistMovies = _watchlistMovies;
                    return watchlistMovies.addMovie(movie);
                })
                .then(function () {
                    deferred.resolve(movie);
                })
                .catch(function (err) {
                    console.log(err);
                    deferred.reject(err);
                })
                .finally(loaderService.done);
                
            return deferred.promise;
        }
        
        /**
         * Remove movie from watchlist
         */
        moviesService.removeFromWatchlist = function (movie, watchlist) 
        {
            var deferred = $q.defer();
            
            loaderService.start();
            
            // movie should be instanceof Movie
            if(!(movie instanceof Movie)) {
                return $q.reject('movie should be an instance of Movie Parse class');
            }
            
            var watchlistMovies;
            
            dataStorage.ready()
                .then(function () {
                    return dataStorage.watchlistMoviesCollection(watchlist);
                })
                .then(function (_watchlistMovies) {
                    watchlistMovies = _watchlistMovies;
                    return watchlistMovies.removeMovie(movie);
                })
                .then(function () {
                    deferred.resolve(movie);
                })
                .catch(function (err) {
                    console.log(err);
                    deferred.reject(err);
                })
                .finally(loaderService.done);
            
            return deferred.promise;
        }
        
        return moviesService;
    });
