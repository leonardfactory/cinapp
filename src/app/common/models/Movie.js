angular
    .module('cinApp.models')
    .factory('Movie', function () 
    {   
        var Movie = Parse.Object.extend({
            className: 'Movie',
            attrs: ['name', 'originalTitle', 'director', 'releaseDate', 'posterPath', 'overview', 'imdbId', 'tmdbId', 'status', 'voteAverage', 'runtime', 'genres'],
            
            /**
             * Fill this Parse Object fields with data retrieved from TMDB Api
             */
            fromApiObject: function (obj) 
            {
                var _this = this;
                
                this.name = obj.title;
                this.originalTitle = obj.original_title;
                this.releaseDate = moment(obj.release_date, 'YYYY-MM-DD').toDate();
                this.status = obj.status;
                this.posterPath = obj.poster_path;
                this.imdbId = obj.imdb_id;
                this.tmdbId = obj.id.toString();
                this.director = obj.director;
                this.overview = obj.overview;
                this.runtime = obj.runtime;
                this.voteAverage = obj.vote_average;
                
                // Genres
                var genres = [];
                angular.forEach(obj.genres, function (genre) {
                    genres.push(genre.name);
                });
                this.genres = genres;
            }
            
        });
        
        return Movie;
    });