angular
    .module('cinApp.models')
    .factory('Watchlist', function () 
    {
        var Watchlist = Parse.Object.extend({
            className: 'Watchlist',
            attrs: ['name', 'normalizedName']
        });
        
        return Watchlist;
    });