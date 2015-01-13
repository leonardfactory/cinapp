angular
    .module 'cinApp.models'
    .factory 'User', (NgParse, ParseUser) ->
        class User extends NgParse.Object
            
            @class = ParseUser
            @className = '_User'
            
            constructor: (options) ->
                super options