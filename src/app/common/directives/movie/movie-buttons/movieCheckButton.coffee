angular
    .module 'cinApp'
    .directive 'movieCheckButton', (dataStorage, User) ->
        templateUrl: 'common/directives/movie/movie-buttons/movie-check-button.html'
        replace: true
        scope:
            movie: '='
            small: '@'
        link: (scope, element, attrs) ->
            scope.loading = yes
        controller: ($scope, moviesService) ->
            movieId = $scope.movie.imdb_id || $scope.movie.imdbId
            
            dataStorage.ready()
                .then ->
                    $scope.loading = no
                    
                    isWatchedListener = $scope.$watch(
                        -> movieId in User.current.watchedId ,
                        (isWatched) -> $scope.checked = isWatched 
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