angular
    .module('cinApp')
    .controller('MovieDetailController', function ($scope, $modalWindow, loaderService, dataStorage, Movie, WatchlistMoviesCollection,  movie, watchlists) 
    {
        var _this = this;
        
        this.movie      = movie; /* Pass movie */
        this.watchlists = watchlists; /* Pass watchlists in order to avoid to load them multiple times from parse */
        
        // Check movie as seen
        this.check = function () 
        {
            if(_this.result !== null) 
            {
                loaderService.start();
                
                var movie = new Movie();
                movie.fromApiObject(_this.movie);
                
                dataStorage.ready()
                    .then(function () {
                        if(dataStorage.watchedCollection.isMovieWatched(movie.imdbId)) {
                            // Uncheck
                            return dataStorage.watchedCollection.removeMovie(movie);
                        }
                        else {
                            // Check
                            return dataStorage.watchedCollection.addMovie(movie);
                        }
                    })
                    .then(function () {
                        console.log('Added: ' + _this.movie.title);
                    })
                    .catch(function (error) {
                        console.log('Whoops. Unabled to check movie.');
                        console.log(error);
                    })
                    .finally(function () {
                        loaderService.done();
                    });
            }
        }
        
        // Add to watchlists
        this.addToWatchlist = function(watchlist) 
        {   
            if(_this.result !== null)
            {
                var watchlistMovies = WatchlistMoviesCollection.fromWatchlist(watchlist);
                
                loaderService.start();
                
                watchlistMovies.fetch()
                    .then(function (results) {
                        var movie = new Movie();
                        movie.fromApiObject(_this.movie);
                        
                        return watchlistMovies.addMovie(movie);
                    })
                    .fail(function (err) {
                        console.log(err);
                        
                        // Shake the modal window.
                        $modalWindow.shake();
                    })
                    .always(loaderService.done);
            }
        }
    });