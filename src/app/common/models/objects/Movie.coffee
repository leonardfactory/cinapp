angular
    .module 'cinApp.models'
    .factory 'Movie', (NgParse) ->
        class Movie extends NgParse.Object
            
            @registerForClassName 'Movie'
                
            @defineAttributes ['name', 'originalTitle', 'director', {name: 'releaseDate', type: NgParse.Date }, 'posterPath', 'overview', 'imdbId', 'tmdbId', 'status', 'voteAverage', 'runtime', {name: 'genres', type: NgParse.Array }]
            
            constructor: (options) ->
                super options
                
            # Convert a movie from a TMDB JSON record to an instance
            #
            fromApiObject: (obj) ->
                @name = obj.title
                @originalTitle = obj.original_title
                @releaseDate = new NgParse.Date moment: moment(obj.release_date, 'YYYY-MM-DD')
                @status = obj.status
                @posterPath = obj.poster_path
                @overview = obj.overview
                @imdbId = obj.imdb_id
                @tmdbId = obj.id.toString()
                @director = obj.director
                @runtime = obj.runtime
                @voteAverage = obj.vote_average
                
                @genres = new NgParse.Array
                @genres.push genre.name for genre in obj.genres
                
            # Default known genres
            #
            @genres = [ 'Dramma', 'Crime', 'Thriller', 'Avventura', 'Azione', 'Fantascienza', 'Storia', 'Fantasy', 'Commedia', 'Mistero', 'Documentario' ]
                