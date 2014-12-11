describe('Controller: MainCtrl', function()
{
    beforeEach(module('cinApp'));
    
    var ctrl, scope;
    
    beforeEach(inject(function ($controller, $rootScope) 
    {
        scope = $rootScope.$new();
        ctrl = $controller('MainCtrl', { $scope: scope });
    }));
    
    it('should have title set', function()
    {
        expect(ctrl.title).toEqual('Cinapp');
    });
});