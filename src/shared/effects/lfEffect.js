angular
    .module('lfEffects', ['ngAnimate'])
    .service('lfAnimator', function ($timeout, $animate) 
    {
        return {
            applyEffect: function (element, animationClass) {
                return $animate.addClass(element, animationClass)
                    .then(function () {
                        element.removeClass(animationClass);
                    });
            }
        }
    })
    .directive('lfShakeError', function ($timeout, lfAnimator) 
    {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.lfShakeError, function (error) {
                    if(error) {
                        lfAnimator.applyEffect(element, 'lf-effect-shake');
                    }
                });
            }
        }
    })
    