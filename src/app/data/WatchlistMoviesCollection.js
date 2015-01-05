angular
    .module('cinApp.models')
    .factory('WatchlistMoviesCollection', function (User, Movie) 
    {
        var WatchlistMoviesCollection = Parse.Collection.extend({
            model: Movie,
            className: 'Movie'
        }, {
            /**
             * Static method to retrieve a new Movies collection
             * based on the movies saved inside a particular collection
             */
            fromWatchlist: function (watchlist) 
            {
                var collection = new WatchlistMoviesCollection();
                collection.query = watchlist.relation('movies').query();
                return collection;
            }
        });
        
        return WatchlistMoviesCollection;
    });