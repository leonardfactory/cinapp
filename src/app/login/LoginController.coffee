angular
    .module 'cinApp'
    .controller 'LoginController',
        class LoginController
            
            ### @ngInject ###
            constructor: (@$scope, userService, User) ->
                
                @logged = userService.logged()
                
                $scope.$watch(
                    -> userService.logged(),
                    (logged) => @logged = logged
                )
                
                @user =
                    username: ''
                    password: ''
                    
                @login = =>
                    userService
                        .login @user.username, @user.password
                        .catch (error) => @error = error
                        
                @logout = ->
                    userService.logout()
                        