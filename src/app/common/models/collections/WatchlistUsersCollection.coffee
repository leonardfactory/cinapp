angular
    .module 'cinApp'
    .factory 'WatchlistUsersCollection', ($q, NgParse, User, Movie) ->
        class WatchlistUsersCollection extends NgParse.Collection
            
            @collectionName = 'WatchlistUsersCollection'
            
            # A WatchlistUsersCollection contains all the users sharing
            # the same Watchlist
            #
            constructor: (options = {}) ->
                
                unless options.watchlist?
                    throw new Error "Can't create a WatchlistMoviesCollection without a watchlist"
                    
                @watchlist = options.watchlist
                
                defaults =
                    class: User
                    query: @watchlist.users.query()
                
                super _.defaults defaults, options
                
            # Custom hash, different for each watchlist.
            #
            @hash: (options = {}) ->
                @collectionName + ':' + options.watchlist.id
            
            # Add an user to this watchlist
            #
            addUser: (user) ->
                unless user instanceof User
                    $q.reject "user should be an instance of User"
                else
                    @watchlist.ACL.user(user).allow yes, yes
                    @watchlist.usersCount++
                    @watchlist.users.add user
                    
                    @add user
                    
                    @watchlist.save()
        