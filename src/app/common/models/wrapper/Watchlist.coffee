angular
    .module 'cinApp.models'
    .factory 'Watchlist', (NgParse, ParseWatchlist) ->
        class Watchlist extends NgParse.Object
            constructor: (options) ->
                _options = _.defaults
                                class: ParseWatchlist,
                                options
                super _options