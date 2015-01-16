angular
    .module 'cinApp.models'
    .factory 'Watchlist', (NgParse) ->
        class Watchlist extends NgParse.Object
            
            @registerForClassName 'Watchlist'
            
            @defineAttributes ['name', 'normalizedName', 'usersCount']