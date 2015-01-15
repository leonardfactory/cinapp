angular
    .module 'cinApp'
    .controller 'MainController', (Movie) ->
        class MainController
            
            # Creates a new MainController
            #
            constructor: ->
                @title = "Cinapp"
                
                movie = Movie.get id: 'oVP1BA87Ny'
                movie
                    .fetch()
                    .then ->
                        movie.genres.push 'GenereTest'
                        console.log movie
                        movie
                            .save()
                            .then ->
                                console.log movie
            
            
        new MainController