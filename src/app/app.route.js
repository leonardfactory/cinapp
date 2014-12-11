angular.module('cinApp')
    .config(['$routeProvider', 
    function ($routeProvider) 
    {
        $routeProvider
            .when('/movies', {
                templateUrl: 'movies/movies.html',
                controller: 'MoviesCtrl',
                controllerAs: 'moviesCtrl'
            })
            .otherwise({
                redirectTo: '/',
                templateUrl: 'main/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            });
    }]);