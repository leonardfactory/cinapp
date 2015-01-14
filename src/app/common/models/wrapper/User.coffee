angular
    .module 'cinApp.models'
    .factory 'User', (NgParse, ParseUser) ->
        class User extends NgParse.User
            
            @class = ParseUser
            @className = '_User'
            