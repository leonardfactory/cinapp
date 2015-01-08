angular
    .module('cinApp')
    .factory('MovieError', function () 
    {
        var MovieError = function (message) 
        {
            this.name       = 'MovieError';
            this.message    = message;
            var err         = new Error(message); // Trick to get stack
            this.stack      = err.stack;
        }
        
        return MovieError;
    });