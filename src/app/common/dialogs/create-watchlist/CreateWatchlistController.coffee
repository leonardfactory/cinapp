angular
    .module 'cinApp'
    .controller 'CreateWatchlistController', ($scope, $modalWindow, Watchlist, loaderService, watchlistService) ->
        class CreateWatchlistController
            constructor: -> 
                # The watchlist to be created
                #
                @watchlist = new Watchlist()
                
            createWatchlist: ->
                loaderService.start()
                
                watchlistService
                    .create @watchlist
                    .then => $scope.$close true
                    .catch (error) =>
                        console.log 'Whoops. Cannot create watchlist.'
                        console.log error
                        $modalWindow.shake()
                    .finally loaderService.done
                
                
        new CreateWatchlistController