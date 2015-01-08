angular
    .module('cinApp')
    .controller('MainController', function (User, userService)
    {
        var _this = this;
    
        this.title = 'Cinapp';
        
        this.newUser = new User();
        
        this.register = function () 
        {
            userService.register(_this.newUser)
                .then(function () {
                    console.log('Registered!');
                });
        }
    });