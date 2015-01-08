angular
    .module('cinApp.models')
    .factory('WatchlistMoviesCollection', function ($q, User, Movie, MovieError) 
    {
        var WatchlistMoviesCollection = Parse.Collection.extend({
            /**
             * Initialize movies from passed watchlist
             */
            initialize: function (models, options) {
                if(options && options.watchlist) {
                    this._watchlist = options.watchlist;
                    this.query = options.watchlist.relation('movies').query();
                }
            },
            model: Movie,
            className: 'Movie',
            _watchlist: null,
            comparator: function (model) {
                return -model.createdAt.getTime();
            },
            addMovie: function (movie) {
                var _this = this;
                
                return Parse.Cloud
                    .$run('insertMovie', { movie: movie.toObject() })
                    .then(function (object) {
                        try {
                            _this._watchlist.relation('movies').add(object);
                            _this.add(object);
                        }
                        catch (e) {
                            return $q.reject('Movie already added');
                        }
                        
                        return _this._watchlist.$save();
                    });
            },
            hasMovie: function (movie) {
                return _.some(this.models, function (model) {
                    return model.id === movie.imdbId;
                });
            },
            removeMovie: function (movie) {
                this._watchlist.relation('movies').remove(movie);
                this.remove(movie);
                
                return this._watchlist.$save();
            }
        }, {
            /**
             * Static method to retrieve a new Movies collection
             * based on the movies saved inside a particular collection
             * @deprecated
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