angular
    .module('cinApp')
    .directive('movieImg', function (tmdbService) 
    {
        return {
            template: '<img ng-src="{{baseImagePath}}{{movie.model.posterPath || movie.poster_path}}" width="{{width}}" height="{{height}}" />',
            replace: true,
            scope: {
                movie: '=',
                width: '@',
                height: '@'
            },
            link: function (scope, element, attrs) {
                if(tmdbService.config) {
                    scope.baseImagePath = tmdbService.config.images.base_url + '/' + tmdbService.config.images.poster_sizes[3];
                }
                scope.width     = attrs.width ? attrs.width : 'auto';
                scope.height    = attrs.height ? attrs.height : 'auto';
            }
        }
    });