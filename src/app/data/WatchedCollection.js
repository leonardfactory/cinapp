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
                
                movie.relation('users').add(User.current());
                
                return movie.save().then(function (object) {
                    _this.add(object);
                    User.current().relation('watched').add(movie);
                    
                    return User.current().save().then(function (user) {
                        return object;
                    });
                });
            }
        });
        
        return WatchedCollection;
    });