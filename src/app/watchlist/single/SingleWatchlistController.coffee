angular
    .module 'cinApp'
    .controller 'SingleWatchlistController', ($q, $stateParams, $timeout, $scope, loaderService, angularModal, NgParse, Watchlist, WatchlistMoviesCollection, WatchlistUsersCollection) ->
        class SingleWatchlistController
            
            constructor: ->
                @watchlist = null
                @movies = null
                @users = null
                
                $timeout loaderService.start
                    .then =>
                        query = new NgParse.Query class: Watchlist
                        query.where.attr('normalizedName').equal $stateParams.normalizedName
                        query.first()
                        
                    .then (watchlist) =>
                        @watchlist = watchlist
                        
                        # Load movies and users for this watchlist
                        @movies = WatchlistMoviesCollection.get watchlist: @watchlist
                        @users  = WatchlistUsersCollection.get watchlist: @watchlist
                        
                        # Loads all
                        $q.all [ @movies.update(), @users.update() ]
                        
                    .finally loaderService.done
                
            # Add an user to the current watchlist, showing an interface
            # where the current user can look for his friends
            #
            addUser: ->
                angularModal.show
                    templateUrl: 'common/dialogs/add-user/modal-add-user.html'
                    scope: $scope # todo: check
                    controller: 'AddUserController'
                    controllerAs: 'addUserCtrl'
                    locals:
                        watchlist: @watchlist
                        users: @users
            
        new SingleWatchlistController