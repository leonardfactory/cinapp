angular
    .module('cinApp')
    .controller('MovieDetailController', function ($scope, $modalWindow, loaderService, dataStorage, moviesService,  movie) 
    {
        var _this = this;
        
        this.movie      = movie; /* Pass movie */
        
        this.watchlists = null;
        dataStorage.ready()
            .then(function () {
                _this.watchlists = dataStorage.watchlistCollection;
            });
        
        // Add to watchlists
        this.addToWatchlist = function(watchlist) 
        {   
            if(_this.movie !== null)
            {
                moviesService.addToWatchlist(_this.movie, watchlist)
                    .then(function () {
                        $modalWindow.successed();
                    })
                    .catch(function (error) {
                        $modalWindow.shake();
                    });
            }
        }
    });