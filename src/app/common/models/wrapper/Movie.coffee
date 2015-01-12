angular
    .module 'cinApp.models'
    .factory 'Movie', (NgParse, ParseMovie) ->
        class Movie extends NgParse.Object
            constructor: (options) ->
                _options = _.defaults
                                class: ParseMovie,
                                options
                super _options