angular
    .module('cinApp')
    .directive('movieImg', function (tmdbService) 
    {
        return {
            template: '<img src="{{baseImagePath}}{{movie.poster_path}}" width="{{width}}" />',
            scope: {
                movie: '=',
                size: '@'
            },
            link: function (scope, element, attrs) {
                if(tmdbService.config) {
                    scope.baseImagePath = tmdbService.config.images.base_url + '/' + tmdbService.config.images.poster_sizes[3];
                }
                scope.width = attrs.size ? attrs.size : 'auto';
            }
        }
    });