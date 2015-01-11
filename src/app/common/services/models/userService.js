angular
    .module('cinApp')
    .service('userService', function ($q, $rootScope, dataStorage, loaderService, User, Watchlist) 
    {
        var userService = {};
        
        /**
         * Check if is logged
         */
        userService.logged = function () {
            return User.current() !== null;
        }
        
        /**
         * Login
         */
        userService.login = function (username, password) 
        {
            loaderService.start();
            
            return User.$logIn(username, password)
                .then(function () {
                    $rootScope.$apply();
                })
                .finally(loaderService.done);
        }
        
        /**
         * Logout
         */
        userService.logout = function () {
            User.logOut();
        }
        
        /**
         * Register
         */
        userService.register = function (user) 
        {   
            loaderService.start();
            
            return user
                .$signUp()
                .finally(loaderService.done);
        }
        
        /**
         * Add user to a watchlist
         */
        userService.addToWatchlist = function (user, watchlist) 
        {
            loaderService.start();
            
            if(!(watchlist instanceof Watchlist)) {
                return $q.reject('watchlist should be an instance of Watchlist');
            }
            
            return dataStorage.ready()
                .then(function () {
                    return dataStorage.watchlistUsers.getCollection(watchlist.id, { watchlist: watchlist });
                })
                .then(function (watchlistUsers) {
                    return watchlistUsers.addUser(user);
                })
                .finally(loaderService.done);
        }
        
        return userService;
    });