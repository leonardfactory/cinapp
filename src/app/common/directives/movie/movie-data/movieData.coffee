angular
    .module 'cinApp'
    .directive 'movieData', ->
        templateUrl: 'common/directives/movie/movie-data/movie-data.html'
        replace: yes
        scope:
            movie: '='
        link: (scope, element, attrs) ->
            scope.$watch 'movie', (movie) ->
                if movie?
                    scope.voteAverage = if movie.vote_average? then movie.vote_average else movie.model.voteAverage
                    scope.releaseDate = if movie.release_date? then moment(movie.release_date, 'YYYY-MM-DD').toDate() else movie.model.releaseDate