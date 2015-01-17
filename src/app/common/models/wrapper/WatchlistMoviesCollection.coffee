angular
    .module 'cinApp.models'
    .factory 'WatchlistMoviesCollection', (NgParse, Watchlist, Movie) ->
        class WatchlistMoviesCollection extends NgParse.Collection
            
            @collectionName = 'WatchlistMoviesCollection'
            
            # A WatchlistMoviesCollection contains all the movies inserted
            # into a singular Watchlist.
            #
            constructor: (options = {}) ->
                
                unless options.watchlist?
                    throw new Error "Can't create a WatchlistMoviesCollection without a watchlist"
                
                @watchlist = options.watchlist
                
                defaults =
                    class: Movie
                    query: @watchlist.movies.query()
                
                _options = _.defaults defaults, options
                super _options
            
            # Custom hash
            #
            @hash: (options = {}) -> 
                @collectionName + ':' + options.watchlist.id