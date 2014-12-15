angular
    .module('cinApp')
    .directive('movieImg', function (tmdbService) 
    {
        return {
            template: '<img src="{{baseImagePath}}{{movie.poster_path}}" />',
            scope: {
                movie: '='
            },
            link: function (scope, element, attrs) {
                scope.baseImagePath = tmdbService.config.images.base_url + '/' + tmdbService.config.images.poster_sizes[0];
            }
        }
    });