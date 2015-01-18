angular
    .module 'cinApp'
    .directive 'movieGenres', ->
        templateUrl: 'common/directives/movie/movie-genres/movie-genres.html'
        replace: true
        scope:
            movie: '='
    
    # Convert a movie genre name to a class name or to a displayed text
    #
    .filter 'genreDisplayName', ->
        (genre, isClassName) ->
            displayName = genre.name or genre
            displayName = displayName.toLowerCase() if isClassName
            displayName