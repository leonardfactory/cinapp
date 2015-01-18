angular
    .module 'cinApp'
    .directive 'movieWatchlistRemoveButton', ->
        templateUrl: 'common/directives/movie/movie-buttons/movie-watchlist-remove-button.html'
        replace: true
        scope:
            movie: '='
            watchlist: '='
            small: '@'
        controller: ($scope, moviesService) ->
            movieId = $scope.movie.imdb_id or $scope.movie.imdbId
            
            $scope.remove = ($event) ->
                $event.stopPropagation()
                
                unless $scope.loading
                    $scope.loading = true
                    
                    moviesService
                        .removeFromWatchlist $scope.movie, $scope.watchlist
                        .catch (error) ->
                            console.log error
                        .finally ->
                            $scope.loading = false