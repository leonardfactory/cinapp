angular
    .module 'cinApp.models'
    .factory 'Movie', (NgParse, ParseMovie) ->
        class Movie extends NgParse.Object
            
            @class = ParseMovie
            @className = 'Movie'
            
            constructor: (options) ->
                super options