angular
    .module('cinApp')
    .factory('moviesFactory', function () 
    {
        var _this = this;
        
        this.Movie = Parse.Object.extend({
            className: 'Movie',
            attrs: ['name', 'director', 'year']
        });
        
        this.UserMovie = Parse.Object.extend({
            className: 'UserMovie',
            attrs: ['user', 'movie']
        });
    });