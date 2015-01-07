angular
    .module('cinApp')
    .service('moviesService', function (dataStorage, loaderService, Movie) 
    {
        var moviesService = {};
        
        /**
         * Check a movie and return a promise
         */
        moviesService.check = function (movieObj) 
        {
            if(movie !== null) 
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
                        if(dataStorage.watchedCollection.isMovieWatched(movie.imdbId)) {
                            // Uncheck
                            return dataStorage.watchedCollection.removeMovie(movie);
                        }
                        else {
                            // Check
                            return dataStorage.watchedCollection.addMovie(movie);
                        }
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
        
        return moviesService;
    });
