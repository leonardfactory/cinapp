angular
    .module('cinApp.models')
    .factory('Movie', function () 
    {   
        var Movie = Parse.Object.extend({
            className: 'Movie',
            attrs: ['name', 'originalTitle', 'director', 'releaseDate', 'posterPath', 'overview', 'imdbId', 'tmdbId', 'status', 'voteAverage', 'runtime']
        });
        
        return Movie;
    });