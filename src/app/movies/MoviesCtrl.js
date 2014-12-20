angular
    .module('cinApp')
    .controller('MoviesCtrl', function ($scope, $timeout, User, Movie, WatchedCollection) 
    {
        var _this = this;
        
        this.movies = new WatchedCollection();
        
        this.inlineMovie = {};
        
        // Deferred loading
        $timeout(function () {
            _this.loading = true;
        })
        .then(function () {
            return _this.movies.fetch();
        })
        .then(function () {
            _this.loading = false;
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
            movie.setYear(_this.inlineMovie.year);
            
            _this.movies.addMovie(movie).then(function () {
                // User.current().relation('watched').add(movie);
                
                _this.alerts.push({
                    message: 'Added movie `' + movie.getName() + '`',
                    type: 'success'
                });
            });
        };
    });