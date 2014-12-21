angular
    .module('cinApp')
    .service('loaderService', function ($rootScope) 
    {
        var self = {
            loading: false,
            counter: 0
        };
        
        self.start = function ()
        {
            self.counter++;
            self.loading = true;
        }
        
        self.done = function () 
        {
            self.counter--;
            if(self.counter === 0) {
                self.loading = false;   
            }
        }
        
        return self;
    });