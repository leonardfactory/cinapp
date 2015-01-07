angular
    .module('cinApp')
    .directive('movieCheckButton', function (dataStorage) 
    {
        return {
            templateUrl: 'movies/directive/movie-check-button.html',
            replace: true,
            scope: {
                movie: '=',
                small: '@'
            },
            link: function (scope, element, attrs) {
                scope.loading = true;
            },
            controller: function ($scope, moviesService) {
                
                var movieId = $scope.movie.imdbId || $scope.movie.imdb_id;
                
                // Check status
                dataStorage.ready()
                    .then(function () { 
                        $scope.loading = false;
                        
                        var isWatchedListener = $scope.$watch(function () {
                            return dataStorage.watchedCollection.isMovieWatched(movieId);
                        }, function (isWatched) {
                            $scope.checked = isWatched;
                        });
                        
                        $scope.$on('$destroy', function () {
                            isWatchedListener();
                        });
                    });
                    
                $scope.check = function ($event) 
                {
                    $event.stopPropagation();
                    
                    $scope.loading = true;
                    moviesService
                        .check($scope.movie)
                        .finally(function () {
                            $scope.loading = false;
                        });
                }
            }
        }
    });