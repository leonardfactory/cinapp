angular
    .module('cinApp')
    .controller('MovieDetailController', function ($scope, $modalWindow, loaderService, dataStorage, Movie, WatchlistMoviesCollection,  movie) 
    {
        var _this = this;
        
        this.movie      = movie; /* Pass movie */
        
        this.watchlists = null;
        dataStorage.ready()
            .then(function () {
                _this.watchlists = dataStorage.watchlistCollection;
            });
        
        // Add to watchlists
        this.addToWatchlist = function(watchlist) 
        {   
            if(_this.movie !== null)
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