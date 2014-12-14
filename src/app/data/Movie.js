angular
    .module('cinApp.models')
    .factory('Movie', function () 
    {   
        var Movie = Parse.Object.extend({
            className: 'Movie',
            attrs: ['name', 'director', 'year']
        });
        
        return Movie;
    });