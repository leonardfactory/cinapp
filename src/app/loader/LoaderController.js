angular
    .module('cinApp')
    .controller('LoaderController', function ($scope, loaderService) 
    {
        var _this = this;
        
        $scope.$watch('loaderService.loading', function (newValue, oldValue) {
            if(newValue !== oldValue) {
                _this.loading = newValue;
            }
        });
    });