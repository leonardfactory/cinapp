angular
    .module 'cinApp'
    .directive 'moviesFilter', (Movie) ->
        templateUrl: 'common/directives/filter/movies-filter.html'
        replace: true
        scope:
            filters: '=' # Pass filters object
        link: (scope, element, attrs) ->
            scope.genres = Movie.genres
            