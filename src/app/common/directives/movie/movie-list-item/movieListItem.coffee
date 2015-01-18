angular
    .module 'cinApp'
    .directive 'movieListItem', ->
        templateUrl: 'common/directives/movie/movie-list-item/movie-list-item.html'
        replace: true
        scope:
            movie: '='
            watchlist: '='
        controller: ($scope, angularModal) ->
            $scope.showDetail = ->
                angularModal.show
                    templateUrl: 'common/dialogs/movie-detail/modal-movie-detail.html'
                    # scope: $scope # Removed because if we do this, child scope is going to be destroyed on parent destroy.
                    controller: 'MovieDetailController'
                    controllerAs: 'movieCtrl'
                    locals:
                        movie: $scope.movie