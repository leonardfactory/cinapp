angular
    .module('cinApp')
    .service('userService', function ($q, dataStorage, loaderService, User) 
    {
        var userService = {};
        
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