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
                
            # Add a movie
            #
            addMovie: (movie) ->
                
                if @contains movie
                    throw new Error "Movie is already contained in the Watchlist"
                
                @watchlist.movies.add movie
                @add movie
                
                @watchlist.save()
                
            # Remoe a movie
            #
            removeMovie: (movie) ->
                @watchlist.movies.remove movie
                @remove movie
                
                @watchlist.save()