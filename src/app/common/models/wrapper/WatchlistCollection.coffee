angular
    .module 'cinApp.models'
    .factory 'WatchlistCollection', (NgParse, Watchlist, Movie, User) ->
        class WatchlistCollection extends NgParse.Collection
            
            constructor: (options = {}) ->
                defaults =
                    class: Watchlist
                    query: NgParse.Query
                                .create class: Watchlist 
                                .where.attr('users').equalObject(User.current)
                
                _options = _.defaults defaults, options
                super _options
            
            
                