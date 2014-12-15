angular
    .module('cinApp')
    .config(function ($stateProvider, $urlRouterProvider) 
    {
        $urlRouterProvider.otherwise("/");
        
        $stateProvider
            .state('movies', {
                url: '/movies',
                templateUrl: 'movies/movies.html',
                controller: 'MoviesCtrl',
                controllerAs: 'moviesCtrl'
            })
            .state('add', {
                url: '/add',
                templateUrl: 'add/add.html',
                controller: 'AddController',
                controllerAs: 'addCtrl'
            })
            .state('search', {
                url: '/search',
                templateUrl: 'search/search.html',
                controller: 'SearchCtrl',
                controllerAs: 'searchCtrl'
            })
            .state('main', {
                url: '/',
                templateUrl: 'main/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            });
    });