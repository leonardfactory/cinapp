angular
    .module('cinApp')
    .directive('movieCheckButton', function (dataStorage, User) 
    {
        return {
            templateUrl: 'movies/directive/movie-check-button.html',
            replace: true,
            scope: {
                movie: '='
            },
            link: function (scope, element, attrs) {
                scope.loading = true;
                dataStorage.ready(function () {
                    scope.checked = dataStorage.watchedCollection.isMovieWatched(scope.movie.imdbId || scope.movie.imdb_id); 
                    scope.loading = false;
                });
            }
        }
    });