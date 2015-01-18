angular
    .module 'cinApp'
    .controller 'WatchlistController',
        class WatchlistController
            
            ### @ngInject ###
            constructor: (@$scope, @$timeout, @angularModal, @loaderService, WatchlistCollection, @watchlistService) ->
                
                @watchlists = WatchlistCollection.get()
                
                # Update watchlists if necessary
                loaderService.start()
                @watchlists.update().finally loaderService.done
                
            # Show the modal dialog to create a new watchlist.
            #
            createWatchlist: ->
                @angularModal.show
                    templateUrl: 'common/dialogs/create-watchlist/modal-create-watchlist.html'
                    controller: 'CreateWatchlistController'
                    controllerAs: 'createCtrl'
                    
            # Removes a watchlist
            #
            removeWatchlist: (watchlist) ->
                @$timeout @loaderService.start
                    .then => @watchlistService.remove watchlist
                    .catch (error) =>
                        console.log 'Whoops. Cannot remove watchlist.' # todo add a visual indicator
                        console.log error
                    .finally @loaderService.done