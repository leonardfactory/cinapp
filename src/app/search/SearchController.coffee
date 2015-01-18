angular
    .module 'cinApp'
    .controller 'SearchController',
        class SearchController
            
            ### @ngInject ###
            constructor: ($q, $scope, $timeout, tmdbService, loaderService) ->
                
                @query = ''
                @queryError = false
                
                @tempResults = []
                @results = []
                
                @search = =>
                    
                    if @query is ''
                        @queryError = true
                        
                    else
                        # Reset loading
                        #
                        loaderService.start()
                        @queryError = false
                        @results = []
                        
                        # Start loading with TMDB Api
                        #
                        tmdbService.api
                            .search.getMovie query: @query, language: 'it'
                            .then (data) =>
                                
                                # Grab at most 10 results
                                @tempResults = if data.results.length > 10 then data.results.splice 0, 10 else data.results
                                
                                # Start processing results with a delay.
                                # since we have a strict request/minute limit imposed by TMDB, we can use
                                # this time to show a nice animation while fetching for successive results.
                                promises = []
                                
                                for tempResult, i in @tempResults
                                    do (tempResult) =>
                                        # Prepare var to hold result
                                        result = null
                                        
                                        # Create a promise for slow fetching
                                        promise = $timeout(
                                                -> tmdbService.api.movies.getById id: tempResult.id, language: 'it',
                                                500 * i # milliseconds
                                            ) 
                                            .then (movie) ->
                                                result = movie
                                                tmdbService.api.movies.getCredits id: tempResult.id
                                                
                                            .then (credits) =>
                                                director = _.find credits.crew, (crewMember) -> crewMember.job is 'Director'
                                                result.director = if director? then director.name else null
                                                
                                                # todo: check imdb_id and poster_path before performing credits query to TMDB
                                                unless result.director is null or not result.poster_path? or not result.imdb_id?
                                                    @results.push result
                                        
                                        # Store promise in the array
                                        promises.push promise
                                        
                                # Wait for all promises before stop loading indicator
                                $q.all promises
                            
                            .catch (error) =>
                                console.log error
                                
                            .finally ->
                                loaderService.done()
                                $scope.$apply()
                                
                                
                                        
                                         
                                
                                
                                