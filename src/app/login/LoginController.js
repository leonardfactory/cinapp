angular
    .module('cinApp')
    .controller('LoginController', function ($scope, userService, User) 
    {
        var _this = this;
        
        this.logged = userService.logged();
        this.error = '';
        this.errorCount = 0;
        
        $scope.$watch(function () {
            return userService.logged();
        }, function (logged) {
            _this.logged = logged;
        });
        
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
            
            userService.login(_this.user.username, _this.user.password)
                .catch(function (error) {
                    _this.error = error;
                    $scope.$apply();
                });
        }
        
        this.logout = function () 
        {
            userService.logout();
        }
    });