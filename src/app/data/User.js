angular
    .module('cinApp.models')
    .factory('User', function () 
    {   
        return Parse.User;
    });