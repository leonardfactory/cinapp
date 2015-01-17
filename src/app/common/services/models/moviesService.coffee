angular
    .module 'cinApp'
    .service 'moviesService', ($q, dataStorage, loaderService, NgParse, User, Movie, WatchedCollection, WatchlistMoviesCollection) ->
        
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
            
            #
            check: (movieObj) ->
                loaderService.start()
                
                collection = null
                movie = null
                
                @getMovie movieObj
                    .then (_movie) =>
                        movie = _movie
                        collection = WatchedCollection.get()
                        collection.update()
                    .then =>
                        if movie.imdbId in User.current.watchedId
                            collection.removeMovie movie
                        else
                            collection.addMovie movie
                        
                    .finally loaderService.done