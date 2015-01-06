angular
    .module('cinApp')
    .controller('MovieDetailController', function ($scope, $modalWindow, loaderService, Movie, WatchlistMoviesCollection,  movie, watchlists) 
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
                
                _this.movies.addMovie(movie).then(function () {
                    loaderService.done();
                    console.log('Added: ' + _this.result.title);
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