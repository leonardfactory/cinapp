angular
    .module 'cinApp'
    .controller 'MainController', ($scope, Movie, NgParse) ->
        class MainController
            
            # Creates a new MainController
            #
            constructor: ->
                @title = "Cinapp"
                
                # login
                NgParse.User
                    .login 'leonardo', 'leonardo'
                    .then (user) ->
                        user.username = 'leonardo2'
                        console.log user
                #        console.log NgParse.User.current
                
                console.log NgParse.User.current
                
                @logged = false
                $scope.$watch (-> NgParse.User.logged), 
                    (isLogged) =>
                        @logged = isLogged
                
                # get movie
                movie = Movie.get id: 'oVP1BA87Ny'
                movie
                    .fetch()
                    .then ->
                        movie.genres.push 'GenereTest'
                        console.log movie
#                       movie
#                             .save()
#                             .then ->
#        console.log movie


            logout: ->
                NgParse.User.logout()
                console.log NgParse.User.current
            
            
        new MainController