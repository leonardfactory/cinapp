angular
    .module('cinApp.models')
    .factory('ParseWatchlist', function () 
    {
        var Watchlist = Parse.Object.extend({
            className: 'Watchlist',
            attrs: ['name', 'normalizedName', 'usersCount']
        });
        
        return Watchlist;
    });