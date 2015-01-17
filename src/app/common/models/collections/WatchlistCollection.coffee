angular
    .module 'cinApp.models'
    .factory 'WatchlistCollection', (NgParse, Watchlist, Movie, User) ->
        class WatchlistCollection extends NgParse.Collection
            
            # Creates a WatchlistCollection containing all the Watchlist
            # available for the current user
            #
            constructor: (options = {}) ->
                defaults =
                    class: Watchlist
                    query: NgParse.Query
                                .create class: Watchlist 
                                .where.attr('users').equalObject(User.current)
                
                _options = _.defaults defaults, options
                super _options
                
            # Simple hash as a constant, since we want to have only one collection per user.
            # @todo: add `User.current.id` ?
            #
            @hash: ->
                'WatchlistCollection'
            
            addWatchlist: (watchlist) ->
                
                unless watchlist instanceof Watchlist
                    throw new Error "Can't add an object that is not a `Watchlist` to `WatchlistCollection`"
                
                watchlist.ACL
                    .user(User.current).allow yes, yes
                    .public.read yes
                    
                watchlist.users.add User.current
                watchlist.usersCount = 1
                
                watchlist.save().then => @add watchlist
            
            removeWatchlist: (watchlist) ->
                
                unless watchlist instanceof Watchlist
                    throw new Error "Can't remove an object that is not a `Watchlist` from `WatchlistCollection`"
                    
                watchlist.usersCount--
                
                # Delete watchlist since there are no other users using it
                if watchlist.usersCount is 0
                    watchlist.delete().then => @remove watchlist
                 
                # Just remove me from the list, other users are still using it
                else
                    watchlist.users.remove User.current
                    watchlist.ACL
                        .user(User.current).allow no, no # Remove all flags
                    
                    watchlist.save().then => @remove watchlist
                