angular
    .module 'cinApp.models'
    .factory 'User', (NgParse) ->
        class User extends NgParse.User
            
            @registerForClassName '_User'
            
            @defineAttributes [ 'name', { name: 'watchedId', type: NgParse.Array }, { name: 'watched', type: NgParse.Relation } ]
            