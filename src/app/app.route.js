angular.module('cinApp')
    .config(['$routeProvider', 
    function ($routeProvider) 
    {
        $routeProvider
            .otherwise({
                redirectTo: '/',
                templateUrl: 'main/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            });
    }]);