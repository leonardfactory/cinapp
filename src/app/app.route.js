angular
    .module('cinApp')
    .config(function ($stateProvider, $urlRouterProvider) 
    {
        $urlRouterProvider.otherwise("/");
        
        $stateProvider
            .state('movies', {
                url: '/movies',
                templateUrl: 'movies/movies.html',
                controller: 'MoviesController',
                controllerAs: 'moviesCtrl'
            })
            .state('watchlist', {
                url: '/watchlist',
                templateUrl: 'watchlist/watchlist.html',
                controller: 'WatchlistController',
                controllerAs: 'watchlistCtrl'
            })
            .state('watchlist.single', {
                url: '/:normalizedName',
                templateUrl: 'watchlist/single/single.html',
                controller: 'SingleWatchlistController',
                controllerAs: 'singleCtrl'
            })
            /*
            .state('add', {
                url: '/add',
                templateUrl: 'add/add.html',
                controller: 'AddController',
                controllerAs: 'addCtrl'
            })*/
            .state('search', {
                url: '/search',
                templateUrl: 'search/search.html',
                controller: 'SearchController',
                controllerAs: 'searchCtrl'
            })
            .state('main', {
                url: '/',
                templateUrl: 'main/main.html',
                controller: 'MainController',
                controllerAs: 'mainCtrl'
            });
    });