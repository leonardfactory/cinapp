describe('Controller: MoviesCtrl', function()
{
    beforeEach(angular.mock.module('cinApp'));
    
    var ctrl, scope;
    
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('MoviesCtrl', { $scope: scope });
    }));
    
});