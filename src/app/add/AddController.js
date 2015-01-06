angular
    .module('cinApp')
    .controller('AddController', function ($timeout, $scope, tmdbService, loaderService, angularModal, Movie, WatchedCollection, Watchlist, WatchlistCollection, WatchlistMoviesCollection) 
    {
        var _this = this;
        
        this.url = '';
        this.result = null;
        
        this.movies = new WatchedCollection();
        
        var imdbRegex = /^(?:http:\/\/)?(?:www\.)?imdb\.com\/title\/(tt\d+)/i;
        
        // Watchlists
        this.watchlists = new WatchlistCollection();
        this.watchlists.fetch();
        
        // Mousetrap `esc` for Modal
        /* Mousetrap.bind('esc', function () 
        {
            if(_this.modalShown) {
                $scope.$apply(function () {
                     _this.modalShown = false;
                });
            }
        }); */
        
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
                        _this.result = movie;
                        
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
                        
                        var modalWindow = angularModal.show({
                            templateUrl     : 'add/movie-detail/modal-movie-detail.html',
                            scope           : $scope,
                            controller      : 'MovieDetailController',
                            controllerAs    : 'movieCtrl',
                            locals          : {
                                movie : _this.result,
                                watchlists : _this.watchlists
                            }
                        });
                    })
                    .catch(function (error) 
                    {
                        console.log('Whoops! There was an error while retrieving movie.');
                        console.log(error);
                    })
                    .finally(loaderService.done);
            }
        }
    });