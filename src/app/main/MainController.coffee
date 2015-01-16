angular
    .module 'cinApp'
    .controller 'MainController', ($scope, Movie, User, NgParse) ->
        class MainController
            
            # Creates a new MainController
            #
            constructor: ->
                @title = "Cinapp"
                
                # login
                User
                    .login 'leonardo', 'leonardo'
                    .then (user) ->
                        user.username = 'leonardo2'
                        console.log User.current
                #        console.log NgParse.User.current
                
                @logged = false
                $scope.$watch (-> User.logged() ), 
                    (isLogged) =>
                        @logged = isLogged
                
                # get movie
                movie = Movie.get id: 'oVP1BA87Ny'
                movie
                    .fetch()
                    .then ->
                        movie.genres.push 'GenereTest'
#                       movie
#                             .save()
#                             .then ->
#        console.log movie


            logout: ->
                User.logout()
            
            
        new MainController