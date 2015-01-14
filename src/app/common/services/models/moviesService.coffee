angular
    .module 'cinApp'
    .service 'moviesService', ($q, dataStorage, loaderService, User, Movie, WatchlistMoviesCollection) ->
        moviesService =
            check: (movieObj) ->
                loaderService.start()
                
                unless movieObj instanceof Movie
                    movie = new Movie()
                    movie.model.fromApiObject movieObj
                else
                    movie = movieObj
                    
                dataStorage
                    .ready()
                    .then ->
                        currentUser = User.class.current()
                        if movie.model.imdbId in currentUser.watchedId
                            dataStorage.watchedCollection.removeMovie movie
                        else
                            dataStorage.watchedCollection.addMovie movie
                            
                    .finally loaderService.done