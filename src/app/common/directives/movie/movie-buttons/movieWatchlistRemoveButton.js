angular
    .module('cinApp')
    .directive('movieWatchlistRemoveButton', function (dataStorage) 
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
                var movieId = $scope.movie.imdbId || $scope.movie.imdb_id;
                var _watchlistMoviesCollection;
                
                // Is in watchlist status
                /*dataStorage.ready()
                    .then(function () { 
                        return dataStorage.watchlistMoviesCollection($scope.watchlist);
                    })
                    .then(function (watchlistMoviesCollection) {
                        $scope.loading = false;
                        console.log('watchlistMoviesCollection');
                        console.log(watchlistMoviesCollection);
                        _watchlistMoviesCollection = watchlistMoviesCollection;
                         var removeListener = $scope.$watch(function () {
                            return watchlistMoviesCollection.hasMovie($scope.movie);
                        }, function (hasMovie) {
                            $scope.checked = isWatched;
                        });
                    
                        $scope.$on('$destroy', function () {
                            removeListener();
                        }); 
                    }) */
                
                // Remove movie from watchlist
                $scope.remove = function ($event) 
                {
                    $event.stopPropagation();
                    
                    if(!$scope.loading) 
                    {
                        $scope.loading = true;
                        
                        // We do not need to call dataStorage.ready() because $scope.loading can be false only if it is yet loaded.
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