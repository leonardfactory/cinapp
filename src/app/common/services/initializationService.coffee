angular
    .module 'cinApp'
    .factory 'initializationService', ($q, $rootScope, loaderService, User, Watchlist, WatchlistCollection, WatchlistMoviesCollection) ->
        initializationService =
            
            # Creates a a first Watchlist and put some movies inside.
            #
            # @return {Promise} $q promise
            #
            initializeCurrent: ->
                unless User.current?
                    return $q.reject "Can't initialize the current user since no one is logged in."
                    
                user = User.current
                
                watchlist = new Watchlist
                watchlist.name = 'Benvenuto!'
                
                watchlist.ACL
                    .user(user).allow yes, yes
                    .public.read yes
                    
                watchlist.users.add user
                watchlist.usersCount = 1
                
                sharedWatchlist = Watchlist.get id: 'ChShgvahlU' # Benvenuto watchlist
                sharedWatchlistCollection = WatchlistMoviesCollection.get watchlist: sharedWatchlist
                
                loaderService.start()
                
                sharedWatchlist
                    .fetch()
                    .then ->
                        sharedWatchlistCollection.fetch()
                    .then ->
                        watchlist.movies.add movie for movie in sharedWatchlistCollection.models
                        watchlist.save()
                    .finally loaderService.done