angular
    .module('cinApp')
    .directive('movieListItem', function () 
    {
        return {
            templateUrl: 'movies/directive/movie-list-item/movie-list-item.html',
            replace: true,
            scope: {
                movie: '=',
                watchlist: '='
            },
            link: function (scope, element, attrs) {
                
            }
        }
    });