angular
    .module('cinApp')
    .controller('MoviesController', function ($scope, $timeout, loaderService, WatchedCollection, User, Movie, dataStorage) 
    {
        var _this = this;
        
        this.movies = WatchedCollection.get();
        
        this.inlineMovie = {};
        
        // Predicate
        this.predicate = 'model.name';
        
        // Deferred loading
        loaderService.start();
        
        this.movies.update().finally(loaderService.done);
        
        this.alerts = [];
        
        this.closeAlert = function(index) 
        {
            _this.alerts.splice(index, 1);
        };
        
        /**
         * @deprecated
         */
        this.addMovie = function () 
        {
            var movie = new Movie();
            movie.setName(_this.inlineMovie.name);
            movie.setDirector(_this.inlineMovie.director);
            movie.setYear(parseInt(_this.inlineMovie.year, 10));
            
            _this.movies.addMovie(movie).then(function () {
                // User.current().relation('watched').add(movie);
                
                _this.alerts.push({
                    message: 'Added movie `' + movie.getName() + '`',
                    type: 'success'
                });
            });
        };
    });