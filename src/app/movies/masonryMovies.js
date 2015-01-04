angular
    .module('cinApp')
    .directive('masonryMovies', function () 
    {
        return {
            template: '<div class="masonry" id="#{{masonryId}}" ng-transclude></div>',
            transclude: true,
            scope: {
                masonryId: '@'
            },
            link: function (scope, element, attrs) {
                var container = element[0];
                var msnry;
                // initialize Masonry after all images have loaded
                imagesLoaded(container, function() {
                    msnry = new Masonry(container);
                });
            }
        }
    });