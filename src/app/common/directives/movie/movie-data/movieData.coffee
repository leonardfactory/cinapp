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
                    scope.voteAverage = if movie.vote_average? then movie.vote_average else movie.voteAverage
                    scope.releaseDate = if movie.release_date? then moment(movie.release_date, 'YYYY-MM-DD').toDate() else movie.releaseDate.moment.toDate()
    
    .filter 'minToHour', ->
        (mins) ->
            hours       = Math.floor mins / 60
            minutes     = mins % 60
            
            switch
                when mins is 0 then "N.A."
                when hours is 0 then "#{minutes}min"
                else "#{hours}h #{minutes}min"