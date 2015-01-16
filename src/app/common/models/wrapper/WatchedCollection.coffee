angular
    .module 'cinApp.models'
    .factory 'WatchedCollection', (NgParse, User, Movie) ->
        class WatchedCollection extends NgParse.Collection
            constructor: (options) ->
                
                _options = _.defaults
                                class : Movie
                                query : User.current.watched.query(),
                                options
                                
                super _options
                
            
            addMovie: (movie) ->
                unless movie instanceof Movie
                    throw new Error "Can't add an object which is not an instance of `Movie` to the `WatchedCollection`"
                
                ###Parse.Cloud
                    .$run 'insertMovie', movie: movie.model.toObject()
                    .then (object) =>
                        savedMovie = new Movie model: object
                        
                        @add savedMovie
                        
                        currentUser = new User model: User.class.current()
                        currentUser.model.relation('watched').add savedMovie.model
                        currentUser.model.add 'watchedId', savedMovie.model.imdbId
                        
                        currentUser.save()###
                        
            removeMovie: (movie) ->
                unless movie instanceof Movie
                    throw new Error "Can't remove an object which is not an instance of `Movie` from the `WatchedCollection`"
                    ###
                Parse.Cloud
                    .$run 'removeWatchedMovie', movie: movie.model.toObject()
                    .then (object) =>
                        savedMovie = new Movie model: object
                        
                        @remove savedMovie.id
                        
                        currentUser = new User model: User.class.current()
                        
                        # Saving the user here should not be necessary, since it's saved by CloudCode.
                        # However Parse has troubles handling the array without calling the save operation.
                        currentUser.model.remove 'watchedId', savedMovie.model.imdbId
                        currentUser.save()###
                        
            isMovieWatched: (movieImdbId) ->
                found = false
                for movie in @models when movie.imdbId is movieImdbId
                    found = true
                    break
                
                found
            