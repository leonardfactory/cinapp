angular
    .module 'cinApp'
    .controller 'MainController', ($scope, loaderService, Movie, User, NgParse) ->
        class MainController
            
            # Creates a new MainController
            #
            constructor: ->
                @title = "Cinapp"
                
                @user = new User
                
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