angular
    .module('cinApp')
    .controller('MoviesCtrl', function ($scope, $timeout, loaderService, User, Movie, WatchedCollection) 
    {
        var _this = this;
        
        this.movies = new WatchedCollection();
        
        this.inlineMovie = {};
        
        // Deferred loading
        $timeout(loaderService.start)
            .then(function () {
                return _this.movies.fetch();
            })
            .then(loaderService.done);
        
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