angular
    .module 'cinApp'
    .directive 'movieImg', (tmdbService) ->
        template: '<img ng-src="{{baseImagePath}}{{movie.posterPath || movie.poster_path}}" width="{{width}}" height="{{height}}" />'
        scope:
            movie: '='
            width: '@'
            height: '@'
        link: (scope, element, attrs) ->
            if tmdbService.config
                scope.baseImagePath = tmdbService.config.images.base_url + '/' + tmdbService.config.images.poster_sizes[3]
            
            scope.width     = attrs.width ? 'auto'
            scope.height    = attrs.height ? 'auto'