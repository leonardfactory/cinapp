angular
    .module('cinApp')
    .directive('movieListItem', function () 
    {
        return {
            templateUrl: 'common/directives/movie/movie-list-item/movie-list-item.html',
            replace: true,
            scope: {
                movie: '=',
                watchlist: '='
            },
            link: function (scope, element, attrs) {
                // ...
            },
            controller: function ($scope, angularModal) {
                $scope.showDetail = function () {
                    var modalWindow = angularModal.show({
                        templateUrl     : 'common/dialogs/movie-detail/modal-movie-detail.html',
//                        scope           : $scope,         // Removed because in this way, child scope is going to be destroyed on parent destroy.
                        controller      : 'MovieDetailController',
                        controllerAs    : 'movieCtrl',
                        locals          : {
                            movie : $scope.movie
                        }
                    });
                }
            }
        }
    });