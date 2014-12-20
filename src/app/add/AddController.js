angular
    .module('cinApp')
    .controller('AddController', function (tmdbService, loaderService, Movie, $scope) 
    {
        var _this = this;
        
        this.url = '';
        this.result = null;
        
        this.modalShown = false;
        
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
        
        // Find movie
        this.find = function () 
        {
            var data = imdbRegex.exec(_this.url);
            if(data.length !== null) // Found 
            {
                loaderService.start();
                
                tmdbService.api
                    .find.getById({ id: data[1], external_source: "imdb_id" })
                    .then(function (results) 
                    {   
                        if(results.movie_results.length > 0) {
                            var tmdbId = results.movie_results[0].id;
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
                            _this.modalShown = true;
                            _this.result = movie;
                        });
                        
                        loaderService.done();
                        
                        console.log(movie);
                    })
                    .catch(function (error) 
                    {
                        console.log('Whoops! There was an error while retrieving movie.');
                        console.log(error);
                        
                        loaderService.done();
                    });
            }
        }
    });