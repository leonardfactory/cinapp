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
            loaderService.start();
            
            var movie;

            if(!(movieObj instanceof Movie)) {
                movie = new Movie();
                movie.fromApiObject(movieObj);
            }
            else {
                movie = movieObj;
            }

            return dataStorage.ready()
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
                .finally(loaderService.done);
        }
        
        /**
         * Add to a watchlist and return a promise
         */
        moviesService.addToWatchlist = function (movieObj, watchlist) 
        {
            loaderService.start();
            
            var movie, watchlistMovies;
            
            if(!(movieObj instanceof Movie)) {
                movie = new Movie();
                movie.fromApiObject(movieObj);
            }
            else {
                movie = movieObj;
            }
            
            return dataStorage.ready()
                .then(function () {
                    return dataStorage.watchlistMovies.getCollection(watchlist.id, { watchlist: watchlist });
                })
                .then(function (_watchlistMovies) {
                    watchlistMovies = _watchlistMovies;
                    return watchlistMovies.addMovie(movie);
                })
                .finally(loaderService.done);
        }
        
        /**
         * Remove movie from watchlist
         */
        moviesService.removeFromWatchlist = function (movie, watchlist) 
        {   
            loaderService.start();
            
            // movie should be instanceof Movie
            if(!(movie instanceof Movie)) {
                return $q.reject('movie should be an instance of Movie Parse class');
            }
            
            var watchlistMovies;
            
            return dataStorage.ready()
                .then(function () {
                    return dataStorage.watchlistMovies.getCollection(watchlist.id, { watchlist: watchlist });
                })
                .then(function (_watchlistMovies) {
                    watchlistMovies = _watchlistMovies;
                    return watchlistMovies.removeMovie(movie);
                })
                .finally(loaderService.done);
        }
        
        return moviesService;
    });
