angular
    .module('cinApp')
    .controller('CreateWatchlistController', function ($scope, $modalWindow, Watchlist, loaderService, watchlistService) 
    {
        var _this = this;
        
        this.watchlist = new Watchlist();
        
        this.createWatchlist = function () 
        {
            loaderService.start();
            
            watchlistService
                .create(_this.watchlist)
                .then(function () {
                    $scope.$close(true);
                })
                .catch(function (error) {
                    console.log('Whoops. Cannot create watchlist');
                    console.log(error);
                    $modalWindow.shake();
                })
                .finally(loaderService.done);
        }
    });