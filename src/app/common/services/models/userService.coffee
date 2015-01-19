angular
    .module 'cinApp'
    .factory 'userService', ($q, $rootScope, loaderService, initializationService, User, Watchlist, WatchlistUsersCollection) ->
        
        userService =
            
            logged: ->
                User.logged()
            
            login: (username, password) ->
                loaderService.start()
                
                User.login username, password
                    .finally loaderService.done
            
            logout: ->
                User.logout()
                    
            register: (user) ->
                loaderService.start()
                
                user.signup()
                    .then -> initializationService.initializeCurrent()
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
                        
                
                        