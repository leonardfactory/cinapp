angular
    .module('cinApp')
    .controller('LoaderController', function ($scope, loaderService) 
    {
        var _this = this;
        
        $scope.$watch(
            function () {
                return loaderService.loading
            }, 
            function (newValue, oldValue) {
                if(newValue !== oldValue) {
                    _this.loading = newValue;
                }
            });
    });