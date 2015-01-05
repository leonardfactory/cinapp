angular
    .module('cinApp.models')
    .factory('WatchlistCollection', function (User, Watchlist, Security) 
    {
        var WatchlistCollection = Parse.Collection.extend({
            model: Watchlist,
            className: 'Watchlist',
            query: (new Parse.Query(Watchlist)).equalTo('users', User.current()),
            comparator: function (a, b) {
                return a.name.localeCompare(b.name); // Alphabetical sort
            },
            addWatchlist: function (watchlist) {
                var _this = this;
                
                watchlist.setACL(Security.Watchlist());
                watchlist.relation('users').add(User.current());
                
                // Compute normalizedName
                watchlist.normalizedName = watchlist.name.replace(/\W+/g, '-').toLowerCase();
                
                return watchlist
                        .save()
                        .then(function (object) {
                            _this.add(object);
                            return object;
                        });
            }
        });
        
        return WatchlistCollection;
    });