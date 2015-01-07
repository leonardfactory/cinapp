angular
    .module('cinApp')
    .controller('MoviesCtrl', function ($scope, $timeout, loaderService, User, Movie, dataStorage) 
    {
        var _this = this;
        
        this.movies = null;
        
        this.inlineMovie = {};
        
        // Predicate
        this.predicate = 'name';
        
        // Deferred loading
        loaderService.start();
        dataStorage.ready()
            .then(function () {
                _this.movies = dataStorage.watchedCollection;
                loaderService.done();
            });
        
        this.alerts = [];
        
        this.closeAlert = function(index) 
        {
            _this.alerts.splice(index, 1);
        };
        
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