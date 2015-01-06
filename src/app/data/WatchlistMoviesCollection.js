angular
    .module('cinApp.models')
    .factory('WatchlistMoviesCollection', function ($q, User, Movie, MovieError) 
    {
        var WatchlistMoviesCollection = Parse.Collection.extend({
            model: Movie,
            className: 'Movie',
            _watchlist: null,
            comparator: function (model) {
                return -model.createdAt.getTime();
            },
            addMovie: function (movie) {
                var _this = this;
                
                return Parse.Cloud
                    .run('insertMovie', { movie: movie.toObject() })
                    .then(function (object) {
                        try {
                            _this._watchlist.relation('movies').add(object);
                            _this.add(object);
                        }
                        catch (e) {
                            return $q.reject('Movie already added');
                        }
                        
                        return _this._watchlist.save();
                    });
            }
        }, {
            /**
             * Static method to retrieve a new Movies collection
             * based on the movies saved inside a particular collection
             */
            fromWatchlist: function (watchlist) 
            {
                var collection          = new WatchlistMoviesCollection();
                collection._watchlist   = watchlist;
                collection.query        = watchlist.relation('movies').query();
                return collection;
            }
        });
        
        return WatchlistMoviesCollection;
    });