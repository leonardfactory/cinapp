angular
    .module('cinApp.models')
    .factory('User', function () 
    {   
        var User = Parse.User.extend({
            className: '_User',
            attrs: ['username', 'email', 'name'],
            displayName: function () {
                return this.name ? this.name : this.username;
            }
        });
        
        return User;
    });