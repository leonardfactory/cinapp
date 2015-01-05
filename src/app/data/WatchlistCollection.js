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
                watchlist.usersCount = 1;
                
                // Compute normalizedName
                watchlist.normalizedName = watchlist.name.trim().replace(/\W+/g, '-').toLowerCase() + '-' + User.current().id.toLowerCase().substr(0, 3);
                
                return watchlist
                        .save()
                        .then(function (object) {
                            _this.add(object);
                            return object;
                        });
            },
            removeWatchlist: function (watchlist) {
                var _this = this;
                
                this.remove(watchlist);
                
                watchlist.usersCount--;
                
                // Delete cause no other users are interested
                if(watchlist.usersCount <= 0) {
                    return watchlist.destroy();
                }
                // Remove only current user
                else {
                    watchlist.relation('users').remove(User.current());
                    watchlist.setACL(Security.WatchlistRemove(watchlist, User.current()));
                    
                    return watchlist
                            .save()
                            .then(function (object) {
                                return object;
                            });
                }
            }
        });
        
        return WatchlistCollection;
    });