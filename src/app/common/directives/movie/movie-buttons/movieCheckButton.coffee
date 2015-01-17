angular
    .module 'cinApp'
    .directive 'movieCheckButton', (User) ->
        templateUrl: 'common/directives/movie/movie-buttons/movie-check-button.html'
        replace: true
        scope:
            movie: '='
            small: '@'
        controller: ($scope, moviesService) ->
            movieId = $scope.movie.imdb_id || $scope.movie.imdbId
            $scope.loading = no
            
            isWatchedListener = $scope.$watch(
                (-> 
                    if User.current then (movieId in User.current.watchedId) else null)
                ,
                ((isWatched) ->
                    if isWatched?
                        $scope.loading = no
                        $scope.checked = isWatched
                    else
                        $scope.loading = yes)
            )
            
            $scope.$on '$destroy', -> isWatchedListener()
            
            $scope.check = ($event) ->
                $event.stopPropagation()
                
                if not $scope.loading
                    $scope.loading = yes
                    moviesService
                        .check($scope.movie)
                        .finally ->
                            $scope.loading = no