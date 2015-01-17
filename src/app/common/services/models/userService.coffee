angular
    .module 'cinApp'
    .factory 'userService', ($q, $rootScope, dataStorage, loaderService, User, Watchlist, WatchlistUsersCollection) ->
        
        userService =
            logged: ->
                User.logged()
            
            login: (username, password) ->
                loaderService.start()
                
                User.login username, password
                    .then ->
                        $rootScope.$apply()
                    .finally loaderService.done
            
            logout: ->
                User.logout()
                    
            register: (user) ->
                loaderService.start()
                
                user.signUp()
                    .finally loaderService.done
            
            addToWatchlist: (user, watchlist) ->
                
                loaderService.start()
                
                unless watchlist instanceof Watchlist
                    $q.reject 'watchlist should be an instance of Watchlist'
                    
                else
                    collection = WatchlistUsersCollection.get watchlist: watchlist
                    collection.update()
                        .then => collection.addUser user
                        .finally loaderService.done
                        