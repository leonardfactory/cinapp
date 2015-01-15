angular
    .module 'cinApp.models'
    .factory 'User', (NgParse, ParseUser) ->
        class User extends NgParse.User
            
            @className = '_User'
            