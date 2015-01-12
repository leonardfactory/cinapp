angular
    .module 'cinApp.models'
    .factory 'User', (NgParse, ParseUser) ->
        class User extends NgParse.Object
            constructor: (options) ->
                _options = _.defaults
                                class: ParseUser,
                                options
                super _options