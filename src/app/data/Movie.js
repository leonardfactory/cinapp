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
                
                this.setName(obj.title);
                this.setOriginalTitle(obj.original_title);
                this.setReleaseDate(moment(obj.release_date, 'YYYY-MM-DD').toDate());
                this.setStatus(obj.status);
                this.setPosterPath(obj.poster_path);
                this.setImdbId(obj.imdb_id);
                this.setTmdbId(obj.id.toString());
                this.setDirector(obj.director);
                this.setOverview(obj.overview);
                this.setRuntime(obj.runtime);
                this.setVoteAverage(obj.vote_average);
                
                // Genres
                var genres = [];
                angular.forEach(obj.genres, function (genre) {
                    genres.push(genre.name);
                });
                this.setGenres(genres);
            }
            
        });
        
        return Movie;
    });