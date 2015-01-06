angular
    .module('cinApp.models')
    .factory('WatchedCollection', function (User, Movie) 
    {   
        var WatchedCollection = Parse.Collection.extend({
            model: Movie,
            className: 'Movie',
            query: User.current().relation('watched').query(),
            comparator: function (model) {
                return -model.createdAt.getTime();
            },
            addMovie: function (movie) {
                var _this = this;
                
                return Parse.Cloud
                    .run('insertMovie', { movie: movie.toObject() })
                    .then(function (object) {
                        _this.add(object);
                        User.current().relation('watched').add(object);
                    
                        return User.current().save();
                    });
            },
            removeMovie: function (movie) {
                var _this = this;
                
                return Parse.Cloud
                    .run('removeWatchedMovie', { movie: movie.toObject() })
                    .then(function (savedMovie) {
                        _this.remove(savedMovie);
                    });        
            },
            isMovieWatched: function (movieImdbId) {
                return _.some(this.models, function (model) {
                    return model.imdbId === movieImdbId;
                });
            }
        });
        
        return WatchedCollection;
    });