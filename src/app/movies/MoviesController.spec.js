describe('Controller: MoviesCtrl', function()
{
    beforeEach(module('cinApp'));
    
    var ctrl, scope;
    
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('MoviesCtrl', { $scope: scope });
    }));
    
    it('should have `movies` array', function()
    {
        expect(ctrl.movies.length).toBe(2);
    });
});