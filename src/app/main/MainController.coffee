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
                    .login 'mario', 'mario'
                    .then (user) ->
                        console.log User.current
                        
                        # query
                        query = new NgParse.Query class: Movie
                        #query.where.attr('genres').contains('Thriller')
                        query.where.relatedTo 'watched', User.current
                            
                        #query.find().then (results) -> console.log results

                        #user.watched.add movie
                        #user.save()
                        #    .then ->
                        #        console.log user
                
                @logged = false
                $scope.$watch (-> User.logged() ), 
                    (isLogged) =>
                        @logged = isLogged
                
                # get movie
                movie = Movie.get id: 'oVP1BA87Ny'
                
                
                

            logout: ->
                User.logout()
            
            
        new MainController