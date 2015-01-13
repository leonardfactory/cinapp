describe('Controller: MainCtrl', function()
{
    beforeEach(angular.mock.module('cinApp'));
    
    var ctrl, scope;
    
    beforeEach(inject(function ($controller, $rootScope) 
    {
        scope = $rootScope.$new();
        ctrl = $controller('MainCtrl', { $scope: scope });
    }));
});