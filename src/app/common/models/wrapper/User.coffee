angular
    .module 'cinApp.models'
    .factory 'User', (NgParse, Movie) ->
        class User extends NgParse.User
            
            @registerForClassName '_User'
            
            @defineAttributes [ 'name', { name: 'watchedId', type: NgParse.Array }, { name: 'watched', type: NgParse.Relation, className: 'Movie' } ]
            
            # Show name if provided, or directly username.
            #
            Object.defineProperty @prototype, 'displayName',
                get: -> @name ? @username