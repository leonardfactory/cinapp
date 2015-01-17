angular
    .module 'cinApp'
    .service 'moviesService', ($q, dataStorage, loaderService, NgParse, User, Movie, WatchlistMoviesCollection) ->
        
        moviesService =
            
            getMovie: (movieObj) ->
                if movieObj instanceof Movie
                    $q.when movieObj
                else
                    query = new NgParse.Query class: Movie
                    query.where.attr('imdbId').equal movieObj.imdb_id
                    query
                        .first()
                        .then (result) =>
                            # Create if it's not in the database
                            if not result?
                                movie = new Movie
                                movie.fromApiObject movieObj
                                movie.save()
                            
                            else
                                result # Movie object
                
            check: (movieObj) ->
                loaderService.start()
                
                @getMovie movieObj
                    .then (movie) =>
                        dataStorage
                            .ready()
                            .then ->
                                if movie.imdbId in User.current.watchedId
                                    dataStorage.watchedCollection.removeMovie movie
                                else
                                    dataStorage.watchedCollection.addMovie movie
                            
                            .finally loaderService.done