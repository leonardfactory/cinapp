angular
    .module('cinApp')
    .controller('AddUserController', function ($scope, $modalWindow, loaderService, User,   watchlist, watchlistUsers) /* locals */
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
            
            query.first()
                .then(function (user) {
                    if(user) { // Found
                        return _this.watchlistUsers.addUser(user);
                    }
                })
                .then(function () {
                    $scope.$close(true);
                })
                .fail(function (error) {
                    $scope.$close(false);
                })
                .always(loaderService.done);
        }
    });