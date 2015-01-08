angular
    .module('cinApp.models')
    .factory('WatchlistUsersCollection', function ($q, User, Movie, Security) 
    {
        var WatchlistUsersCollection = Parse.Collection.extend({
            /**
             * Create custom query based on passed watchlist.
             */
            initialize: function (models, options) {
                if(options && options.watchlist) {
                    this._watchlist     = options.watchlist;
                    this.query          = options.watchlist.relation('users').query();  
                }
            },
            model: User,
            _watchlist: null,
            comparator: function (a, b) {
                return a.username.localeCompare(b.username); // Alphabetical sort
            },
            addUser: function (user) {
                var _this = this;
                
                if(!(user instanceof User)) {
                    return $q.reject('User not found');
                }
                
                this._watchlist.setACL(Security.WatchlistUpdate(this._watchlist, user));
                this._watchlist.usersCount++;
                this._watchlist.relation('users').add(user);
                
                this.add(user);
                
                return this._watchlist.$save();
            }
        }, {
            /**
             * Static method to retrieve a new Users collection
             * based on the users saved inside a particular collection
             * @deprecated
             */
            fromWatchlist: function (watchlist) 
            {
                var collection          = new WatchlistUsersCollection();
                collection._watchlist   = watchlist;
                collection.query        = watchlist.relation('users').query();
                return collection;
            }
        });
        
        return WatchlistUsersCollection;
    });