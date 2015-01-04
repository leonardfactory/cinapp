angular
    .module('cinApp')
    .directive('movieImg', function (tmdbService) 
    {
        return {
            template: '<img src="{{baseImagePath}}{{posterPath}}" width="{{width}}" />',
            replace: true,
            scope: {
                movie: '=',
                size: '@',
                masonry: '@'
            },
            link: function (scope, element, attrs) {
                if(tmdbService.config) {
                    scope.baseImagePath = tmdbService.config.images.base_url + '/' + tmdbService.config.images.poster_sizes[3];
                }
                scope.width = attrs.size ? attrs.size : 'auto';
                
                if(attrs.masonry !== null) {
                    element.addClass('movie-cover');
                }
                
                // Adapt movie
                scope.$watch('movie', function (movie) {
                    if(movie && movie.poster_path) {
                        scope.posterPath = movie.poster_path;
                    }
                    else if(movie && movie.getPosterPath) {
                        scope.posterPath = movie.getPosterPath();
                    }
                });
            }
        }
    });