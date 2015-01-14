angular
    .module 'cinApp'
    .factory 'userService', ($q, $rootScope, dataStorage, loaderService, User, Watchlist) ->
        
        userService =
            logged: ->
                User.current().model isnt null
            
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
            
            # addToWatchlist: (user, watchlist) ->
#                 unless watchlist instanceof Watchlist
#                     $q.reject 'watchlist should be an instance of Watchlist'
#
#                 dataStorage.ready()
#                     .then ->
                        