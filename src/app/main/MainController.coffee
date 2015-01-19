angular
    .module 'cinApp'
    .controller 'MainController', ($scope, loaderService, userService, Movie, User, NgParse) ->
        class MainController
            
            # Creates a new MainController
            #
            constructor: ->
                @title = "Cinapp"
                
                @user = new User
                
                @logged = userService.logged()
                $scope.$watch(
                    -> userService.logged(),
                    (logged) => 
                        console.log "Logged: #{logged}"
                        @logged = logged
                )
                
            register: =>
                loaderService.start()
                console.log @user
                @user
                    .signup()
                    .then =>
                        console.log 'logged in!'
                    .catch (error) =>
                        console.log error
                    .finally loaderService.done
            
            
        new MainController