angular
    .module('cinApp')
    .controller('AddController', function (tmdbService, loaderService, Movie, WatchedCollection, $scope) 
    {
        var _this = this;
        
        this.url = '';
        this.result = null;
        
        this.modalShown = false;
        
        this.movies = new WatchedCollection();
        
        var imdbRegex = /^(?:http:\/\/)?(?:www\.)?imdb\.com\/title\/(tt\d+)/i;
        
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
                movie.setName(_this.result.title);
                movie.setOriginalTitle(_this.result.original_title);
                movie.setReleaseDate(moment(_this.result.release_date, 'YYYY-MM-DD').toDate());
                movie.setStatus(_this.result.status);
                movie.setPosterPath(_this.result.poster_path);
                movie.setImdbId(_this.result.imdb_id);
                movie.setTmdbId(_this.result.id.toString());
                movie.setDirector(_this.result.director);
                movie.setOverview(_this.result.overview);
                movie.setRuntime(_this.result.runtime);
                movie.setVoteAverage(_this.result.vote_average);
                
                _this.movies.addMovie(movie).then(function () {
                    loaderService.done();
                    console.log('Added: ' + _this.result.title);
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
                            console.error('No movie found...');
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