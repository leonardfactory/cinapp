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
            
            # Check or uncheck a movie based on current user watched collection
            #
            # @param {Object | Movie} An object derived from API fetch OR a real Movie instance backed on Parse.com
            #
            check: (movieObj) ->
                loaderService.start()
                
                @getMovie movieObj
                    .then (movie) =>
                        # Get the WatchedCollection and decide action based on current
                        # user watched movies Array.
                        #
                        collection = WatchedCollection.get()
                        
                        if movie.imdbId in User.current.watchedId
                            collection.removeMovie movie
                        else
                            collection.addMovie movie
                        
                    .finally loaderService.done
                    
            # Add a movie to a watchlist
            #
            addToWatchlist: (movieObj, watchlist) ->
                
                loaderService.start()
                
                collection = null
                
                @getMovie movieObj
                    .then (movie) =>
                        collection = WatchlistMoviesCollection.get watchlist: watchlist
                        collection.addMovie movie
                    
                    .finally loaderService.done
                    
            # Remove a movie from a watchlist
            #
            removeFromWatchlist: (movie, watchlist) ->
                
                unless movie instanceof Movie
                    throw new Error "Can't remove an object that isn't an instanceof Movie from a Watchlist"
                
                loaderService.start()
                
                collection = WatchlistMoviesCollection.get watchlist: watchlist
                collection
                    .removeMovie movie
                    .finally loaderService.done
                
            