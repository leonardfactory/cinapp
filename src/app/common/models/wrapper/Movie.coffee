angular
    .module 'cinApp.models'
    .factory 'Movie', (NgParse) ->
        class Movie extends NgParse.Object
            
            @registerForClassName 'Movie'
                
            @defineAttributes ['name', 'originalTitle', 'director', {name: 'releaseDate', type: NgParse.Date }, 'posterPath', 'overview', 'imdbId', 'tmdbId', 'status', 'voteAverage', 'runtime', {name: 'genres', type: NgParse.Array }]
            
            constructor: (options) ->
                super options