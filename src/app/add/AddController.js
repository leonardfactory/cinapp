angular
    .module('cinApp')
    .controller('AddController', function ($timeout, $scope, tmdbService, loaderService, Movie, WatchedCollection, Watchlist, WatchlistCollection, WatchlistMoviesCollection) 
    {
        var _this = this;
        
        this.url = '';
        this.result = null;
        
        this.modalShown = false;
        this.modalShake = false;
        
        this.movies = new WatchedCollection();
        
        var imdbRegex = /^(?:http:\/\/)?(?:www\.)?imdb\.com\/title\/(tt\d+)/i;
        
        // Watchlists
        this.watchlists = new WatchlistCollection();
        this.watchlists.fetch();
        
        // Mousetrap `esc` for Modal
        Mousetrap.bind('esc', function () 
        {
            if(_this.modalShown) {
                $scope.$apply(function () {
                     _this.modalShown = false;
                });
            }
        });
        
        // Check movie as seen
        this.check = function () 
        {
            if(_this.result !== null) 
            {
                loaderService.start();
                
                var movie = new Movie();
                movie.fromApiObject(_this.result);
                
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
                        movie.fromApiObject(_this.result);
                        
                        return watchlistMovies.addMovie(movie);
                    })
                    .fail(function (err) {
                        console.log(err);
                        
                        // Shake the modal window.
                        _this.modalShake = false;
                        $timeout(function () {
                            _this.modalShake = true;
                        }, 0);
                    })
                    .always(function () {
                        loaderService.done();
                    });
            }
        }
        
        // Find movie
        this.find = function () 
        {
            var tmdbId;
            var data = imdbRegex.exec(_this.url);
            
            if(data.length !== null) // Found 
            {
                loaderService.start();
                
                tmdbService.api
                    .find.getById({ id: data[1], external_source: "imdb_id" })
                    .then(function (results) 
                    {   
                        if(results.movie_results.length > 0) {
                            tmdbId = results.movie_results[0].id;
                            return tmdbService.api
                                .movies.getById({ id: tmdbId, language: 'it' });
                        }
                        else {
                            throw new Error('No movie found...');
                        }
                    })
                    .then(function (movie) 
                    {
                        $scope.$apply(function () {
                            _this.result = movie;
                        });
                        
                        // Now load director
                        return tmdbService.api
                            .movies.getCredits({ id: tmdbId })
                    })
                    .then(function (credits) 
                    {
                        var director = _.find(credits.crew, function (crewMember) {
                            return crewMember.job === "Director";
                        }).name;
                        
                        _this.result.director = director;
                        
                        $scope.$apply(function () {
                            _this.modalShown = true;
                            loaderService.done();
                        });
                    })
                    .catch(function (error) 
                    {
                        console.log('Whoops! There was an error while retrieving movie.');
                        console.log(error);
                        
                        $scope.$apply(function () {
                            loaderService.done();
                        });
                    });
            }
        }
    });