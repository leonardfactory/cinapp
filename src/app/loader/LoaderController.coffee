angular
    .module 'cinApp'
    .controller 'LoaderController',
        class LoaderController
            
            # Here we need to use the direct approach (passing directly the class
            # as a controller to Angular) since when using `ngController` we
            # can not use the `return new Controller` method.
            #
            ### @ngInject ###
            constructor: ($scope, loaderService) ->
                @loading = false

                $scope.$watch(
                    -> loaderService.loading,
                    (newVal, oldVal) =>
                        @loading = newVal if newVal isnt oldVal
                )