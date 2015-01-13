angular
    .module('cinApp.models')
    .factory('old_WatchedCollection', function (User, Movie) 
    {   
        var WatchedCollection = Parse.Collection.extend({
            constructor: function () {
                this.query = User.current().relation('watched').query();
                Parse.Collection.apply(this, arguments);
            },
            model: Movie,
            className: 'Movie',
            query: null,
            comparator: function (model) {
                return -model.createdAt.getTime();
            },
            addMovie: function (movie) {
                var _this = this;
                
                return Parse.Cloud
                    .$run('insertMovie', { movie: movie.toObject() })
                    .then(function (object) {
                        _this.add(object);
                        User.current().relation('watched').add(object);
                        User.current().add('watchedId', object.imdbId);
                    
                        return User.current().$save();
                    });
            },
            removeMovie: function (movie) {
                var _this = this;
                
                return Parse.Cloud
                    .$run('removeWatchedMovie', { movie: movie.toObject() })
                    .then(function (savedMovie) {
                        _this.remove(savedMovie);
                        
                        /*
                         * Saving the user here should not be necessary, since it's saved by CloudCode.
                         * However Parse has troubles handling the array without calling the save operation.
                         */
                        User.current().remove('watchedId', savedMovie.imdbId);
                        return User.current().$save();
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