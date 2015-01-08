angular
    .module('cinApp')
    .controller('SearchCtrl', function ($q, $scope, $timeout, tmdbService, loaderService) 
    {
        var _this = this;
        
        this.query = '';
        this.queryError = false;
        
        this.tempResults    = [];
        this.results        = [];
        
        /**
         * Search for a query with TMDB APIs, showing only meaningful results.
         */
        this.search = function () 
        {
            if(_this.query !== '') 
            {
                loaderService.start();
                
                _this.queryError = false;
                _this.results = [];
                tmdbService.api
                    .search.getMovie({ query: _this.query, language: 'it' })
                    .then(function (data) 
                    {
                        // Show max 10 results
                        _this.tempResults = data.results;
                        if(_this.tempResults.length > 10) {
                            _this.tempResults = data.results.splice(0, 10);
                        }
                        
                        // Start processing results with a delay.
                        // Since we have a strict request/minute limit imposed by TMDB, we can use
                        // this time to show a nice animation while fetching for successive results.
                        var promises = [];
                        var i = 0;
                        angular.forEach(_this.tempResults, function (tempResult) 
                        {
                            var result;
                            var promise = $timeout(function () {
                                    return tmdbService.api.movies.getById({ id: tempResult.id, language: 'it' });
                                }, 500 * i++)
                                .then(function (movie) {
                                    result = movie;
                                    return tmdbService.api.movies.getCredits({ id: tempResult.id });
                                })
                                .then(function (credits) {
                                    var director;
                                    try {
                                        director = _.find(credits.crew, function (crewMember) {
                                            return crewMember.job === "Director";
                                        }).name;
                                    }
                                    catch (e) {
                                        director = null;
                                    }
                                    result.director = director;
                                    
                                    // Filter only meaningful reasults
                                    if(result.director === null) return;
                                    if(!result.poster_path) return;
                                    
                                    _this.results.push(result);
                                });
                            
                            promises.push(promise);
                        });
                        
                        return $q.all(promises);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .finally(function () {
                        loaderService.done();
                        $scope.$apply();
                    });
            }
            else
            {
                _this.queryError = true;
            }
        }
    });