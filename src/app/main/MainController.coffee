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
                userService.register(@user)
            
            
        new MainController