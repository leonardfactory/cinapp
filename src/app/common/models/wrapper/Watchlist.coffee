angular
    .module 'cinApp.models'
    .factory 'Watchlist', (NgParse) ->
        class Watchlist extends NgParse.Object
            
            @registerForClassName 'Watchlist'
            
            @defineAttributes [ 'name', 'normalizedName', 'usersCount', 
                                { name: 'users',    type: NgParse.Relation, className: '_User' },
                                { name: 'movies',   type: NgParse.Relation, className: 'Movie'} ]