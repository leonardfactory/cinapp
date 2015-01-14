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
                        currentUser = new User current: yes
                        if movie.model.imdbId in currentUser.model.watchedId
                            dataStorage.watchedCollection.removeMovie movie
                        else
                            dataStorage.watchedCollection.addMovie movie
                            
                    .finally loaderService.done