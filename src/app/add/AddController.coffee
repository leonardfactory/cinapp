angular
    .module 'cinApp'
    .controller 'AddController',
        class AddController
            
            ### @ngInject ###
            constructor: (@$timeout, @$scope, @tmdbService, @loaderService, @angularModal, @Movie, @Watchlist, @WatchlistMoviesCollection) ->
                @url = ''
                @result = null
                @imdbRegex = /^(?:http:\/\/)?(?:www\.)?imdb\.com\/title\/(tt\d+)/i
            
            # Reset text field value on click
            #
            reset: =>
                @url = ''    
            
            # Find a movie based on a pasted url
            #
            find: =>
                @$timeout @_findDelayed, 0
                
                
            # We should run this function with a 0ms timeout in order to propagate ng-model
            # change to the controller, elseway the `find` callback is run on paste, before
            # `@url` is updated.
            #
            _findDelayed: =>
                tmdbId = 0
                data = @imdbRegex.exec @url
                
                if data.length?
                    @loaderService.start()
            
                    @tmdbService.api
                        .find.getById id: data[1], external_source: 'imdb_id'
                        .then (results) =>
                            if results.movie_results.length is 0
                                throw new Error 'No movie found..'
                    
                            tmdbId = results.movie_results[0].id
                            @tmdbService.api.movies.getById id: tmdbId, language: 'it'
                    
                        .then (movie) =>
                            @result = movie
                            @tmdbService.api.movies.getCredits id: tmdbId
                
                        .then (credits) =>
                            director = _.find credits.crew, (member) -> member.job is 'Director'
                            @result.director = director?.name ? null
                    
                            @angularModal.show
                                templateUrl: 'common/dialogs/movie-detail/modal-movie-detail.html'
                                controller: 'MovieDetailController'
                                controllerAs: 'movieCtrl'
                                locals:
                                    movie: @result
                
                        .catch (error) =>
                            console.log 'Whoops. There was an error while searching for the movie'
                
                        .finally @loaderService.done
                
                