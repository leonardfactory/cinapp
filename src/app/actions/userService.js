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
            var deferred = $q.defer();
            
            loaderService.start();
            
            user.signUp()
                .then(function (user) {
                    deferred.resolve(user);
                })
                .fail(function (error) {
                    deferred.reject(error);
                })
                .always(loaderService.done);
                
            return deferred.promise;
        }
        
        return userService;
    });