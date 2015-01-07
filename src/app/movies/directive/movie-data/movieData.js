angular
    .module('cinApp')
    .directive('movieData', function () 
    {
        return {
            templateUrl: 'movies/directive/movie-data/movie-data.html',
            replace: true,
            scope: {
                movie: '='
            },
            link: function (scope, element, attrs) {
                scope.$watch('movie', function (movie) {
                    if(movie !== null) {
                        // Vote Average
                        if(typeof movie.vote_average !== "undefined") {
                            scope.voteAverage = movie.vote_average;
                        }
                        else {
                            scope.voteAverage = movie.voteAverage;
                        }
                        
                        // Release Date
                        if(typeof movie.release_date !== "undefined") {
                            scope.releaseDate = moment(movie.release_date, 'YYYY-MM-DD').toDate();
                        }
                        else {
                            scope.releaseDate = movie.releaseDate;
                        }
                    }
                });
            }
        }
    });