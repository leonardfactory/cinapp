angular
    .module('cinApp.models')
    .factory('User', function () 
    {   
        var User = Parse.User.extend({
            className: '_User',
            attrs: ['username', 'password', 'email', 'name', 'watchedId'],
            displayName: function () {
                return this.name ? this.name : this.username;
            }
        });
        
        return User;
    });