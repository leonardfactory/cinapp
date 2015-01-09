angular
    .module('cinApp')
    .service('userService', function ($q, $rootScope, dataStorage, loaderService, User) 
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
        
        return userService;
    });