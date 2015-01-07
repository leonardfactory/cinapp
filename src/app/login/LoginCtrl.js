angular
    .module('cinApp')
    .controller('LoginCtrl', function ($scope, parseService, User) 
    {
        var _this = this;
        
        this.logged = parseService.logged();
        
        this.user = {
            username: '',
            password: ''
        }
        
        this.alert = null;
        
        this.closeAlert = function () 
        {
            _this.alert = null;
        }
        
        this.login = function () 
        {
            _this.alert = null;
            
            User
                .logIn(_this.user.username, _this.user.password)
                .then(function (user) 
                {
                    _this.logged = parseService.logged();
                },
                function (error) 
                {
                    _this.logged = false;
                    _this.alert = 'Error while logging: ' + error;
                });
        }
        
        this.logout = function () 
        {
            User.logOut();
            _this.logged = false;
        }
    });