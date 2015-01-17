angular
    .module 'cinApp.models'
    .factory 'WatchedCollection', (NgParse, User, Movie) ->
        class WatchedCollection extends NgParse.Collection
            
            @collectionName = 'WatchedCollection'
            
            constructor: (options) ->
                
                _options = _.defaults
                                class : Movie
                                query : User.current.watched.query(),
                                options
                                
                super _options
                
            
            addMovie: (movie) ->
                unless movie instanceof Movie and not movie.isNew
                    throw new Error "Can't add an object which is not an instance of `Movie` to the `WatchedCollection`"
                
                @add movie
                
                User.current.watched.add movie
                User.current.watchedId.push movie.imdbId
                User.current.save()
                        
            removeMovie: (movie) ->
                unless movie instanceof Movie and not movie.isNew
                    throw new Error "Can't remove an object which is not an instance of `Movie` from the `WatchedCollection`"
                
                @remove movie
                
                User.current.watched.remove movie
                User.current.watchedId.remove movie.imdbId
                User.current.save()
                        
            isMovieWatched: (movieImdbId) ->
                found = false
                for movie in @models when movie.imdbId is movieImdbId
                    found = true
                    break
                
                found
            