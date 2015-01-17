angular
    .module 'cinApp'
    .controller 'AddUserController', ($scope, $modalWindow, loaderService, userService, NgParse, User,   watchlist, users) -> # locals 
        class AddUserController
            
            constructor: ->
                @addUserQuery = ''
                
                @watchlist  = watchlist
                @users      = users
            
            # Grab an user from Parse.com matching the desired query, then
            # adds it to the Watchlist to share the list with him.
            #
            addUser: ->
                loaderService.start()
                
                query = new NgParse.Query class: User
                query
                    .where.attr('username').equal @addUserQuery
                    .or.attr('email').equal @addUserQuery
                    
                query.first()
                    .then (user) => userService.addToWatchlist user, watchlist
                    .then => $scope.$close true
                    .catch (error) => $modalWindow.shake()
                    .finally loaderService.done
                    
            
        new AddUserController