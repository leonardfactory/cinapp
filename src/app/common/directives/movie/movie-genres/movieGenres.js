angular
    .module('cinApp')
    .directive('movieGenres', function () 
    {
        return {
            templateUrl: 'common/directives/movie/movie-genres/movie-genres.html',
            replace: true,
            scope: {
                movie: '='
            }
        }
    });
    
angular
    .module('cinApp')
    .filter('genreDisplayName', function () 
    {   
        return function (genre, isClassName) {
            var displayName = genre.name || genre;
            
            if(isClassName) {
                displayName = displayName.toLowerCase();
            }
            
            return displayName;
        }
    });