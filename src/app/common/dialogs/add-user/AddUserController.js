angular
    .module('cinApp')
    .controller('AddUserController', function ($scope, $modalWindow, loaderService, userService, User,   watchlist, watchlistUsers) /* locals */
    {
        var _this = this;
        
        this.addUserQuery = '';
        
        this.watchlist      = watchlist;
        this.watchlistUsers = watchlistUsers;
        
        this.addUser = function () 
        {
            loaderService.start();

            var queryUsername = new Parse.Query(User);
            queryUsername.equalTo("username", _this.addUserQuery);

            var queryMail = new Parse.Query(User);
            queryMail.equalTo("email", _this.addUserQuery);

            var query = Parse.Query.or(queryUsername, queryMail); // Find email or username matching
            
            query.$first()
                .then(function (user) {
                    return userService.addToWatchlist(user, _this.watchlist);
                })
                .then(function () {
                    $scope.$close(true);
                })
                .catch(function (error) {
                    $modalWindow.shake();
                })
                .finally(loaderService.done);
        }
    });