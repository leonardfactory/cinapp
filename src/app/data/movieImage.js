angular
    .module('cinApp')
    .directive('movieImg', function (tmdbService) 
    {
        return {
            template: function(elems, attrs) {
                return '<img src="' + tmdbService.config.images.base_url + '/' + tmdbService.config.images.poster_sizes[0] + '{{movie.poster_path}}" />';
            }
        }
    });