angular
    .module('cinApp')
    .directive('movieWatchlistRemoveButton', function () 
    {
        return {
            templateUrl: 'common/directives/movie/movie-buttons/movie-watchlist-remove-button.html',
            replace: true,
            scope: {
                movie: '=',
                watchlist: '=',
                small: '@'
            },
            link: function (scope, element, attrs) {
                // scope.loading = true;
            },
            controller: function ($scope, moviesService) {
                var movieId = $scope.movie.imdb_id || $scope.movie.imdbId;
                
                // Remove movie from watchlist
                $scope.remove = function ($event) 
                {
                    $event.stopPropagation();
                    
                    if(!$scope.loading) 
                    {
                        $scope.loading = true;
                        
                        moviesService
                            .removeFromWatchlist($scope.movie, $scope.watchlist)
                            .catch(function (error) {
                                console.log('Error while removing movie from watchlist');
                                console.log(error);
                            })
                            .finally(function () {
                                $scope.loading = false;
                            });
                    }
                }
            }
        }
    });