angular
    .module 'cinApp.models'
    .factory 'User', (NgParse) ->
        class User extends NgParse.User
            
            @defineAttributes [ 'name', { name: 'watchedId', type: NgParse.Array }, { name: 'watched', type: NgParse.Relation } ]
            