angular
    .module('cinApp.models')
    .factory('Security', function (User) 
    {
        var Security = {};
        
        Security.Watchlist = function () 
        {
            var acl = new Parse.ACL();
            acl.setPublicReadAccess(true);
            acl.setWriteAccess(User.current().id, true);
            return acl;
        }
        
        Security.WatchlistUpdate = function (watchlist, user) 
        {
            var acl = watchlist.getACL();
            acl.setWriteAccess(user.id, true);
            return acl;
        }
        
        return Security;
    });