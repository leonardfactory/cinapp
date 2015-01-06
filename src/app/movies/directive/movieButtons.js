angular
    .module('cinApp')
    .directive('movieCheckButton', function (dataStorage, User) 
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
                
                dataStorage.ready()
                    .then(function () { 
                        scope.loading = false;
                        
                        scope.$watch(function () {
                            return dataStorage.watchedCollection.isMovieWatched(scope.movie.imdbId || scope.movie.imdb_id);
                        }, function (isWatched) {
                            scope.checked = isWatched;
                        });
                    });
            }
        }
    });